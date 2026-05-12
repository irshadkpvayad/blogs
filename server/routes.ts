import express from 'express';
import { db } from './firebase';
import { verifyToken, optionalAuth, AuthRequest } from './middleware';
import { FieldValue } from 'firebase-admin/firestore';

const router = express.Router();

// ---- USERS ----
router.get('/users', verifyToken, async (req: AuthRequest, res) => {
  try {
    const usersSnap = await db.collection('users').get();
    const users = usersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/users/:uid', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const userDoc = await db.collection('users').doc(req.params.uid).get();
    if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/users', verifyToken, async (req: AuthRequest, res) => {
  try {
    const user = req.user;
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      const role = user.email === 'geektyle8@gmail.com' ? 'admin' : 'user';
      const newUserData = {
        uid: user.uid,
        name: user.name || 'Anonymous',
        email: user.email,
        photoURL: user.picture || '',
        bio: '',
        joinedDate: Date.now(),
        role: role,
        totalPosts: 0,
        totalComments: 0,
        rating: 0,
        followersCount: 0,
        followingCount: 0,
        emailVerified: user.email_verified || false
      };
      await userRef.set(newUserData);
      return res.json(newUserData);
    }
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

router.put('/users/:uid/role', verifyToken, async (req: AuthRequest, res) => {
  try {
    const { role } = req.body;
    await db.collection('users').doc(req.params.uid).update({ role });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// ---- POSTS ----
router.get('/posts', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const { authorId, category, status, search, limit, orderBy: orderField, orderDirection } = req.query;
    let query: FirebaseFirestore.Query = db.collection('posts');

    if (authorId) query = query.where('authorId', '==', authorId);
    if (category) query = query.where('category', '==', category);
    if (status) query = query.where('status', '==', status);
    
    if (orderField) {
      query = query.orderBy(orderField as string, (orderDirection as 'asc' | 'desc') || 'desc');
    } else {
      query = query.orderBy('createdAt', 'desc');
    }

    if (limit) {
      query = query.limit(parseInt(limit as string));
    }

    const postsSnap = await query.get();
    let posts = postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (search) {
      const s = (search as string).toLowerCase();
      posts = posts.filter(p => 
        (p as any).title?.toLowerCase().includes(s) || 
        (p as any).content?.toLowerCase().includes(s)
      );
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.post('/posts', verifyToken, async (req: AuthRequest, res) => {
  try {
    const postData = req.body;
    postData.createdAt = FieldValue.serverTimestamp();
    postData.updatedAt = FieldValue.serverTimestamp();
    const docRef = await db.collection('posts').add(postData);
    
    if (postData.authorId) {
       await db.collection('users').doc(postData.authorId).update({
           totalPosts: FieldValue.increment(1)
       });
    }

    res.json({ id: docRef.id, ...postData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/posts/:id', optionalAuth, async (req: AuthRequest, res) => {
  try {
    const docRef = db.collection('posts').doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) return res.status(404).json({ error: 'Post not found' });
    
    // increment views
    await docRef.update({ views: FieldValue.increment(1) });
    
    const postData = docSnap.data();
    postData!.views = (postData!.views || 0) + 1;

    res.json({ id: docSnap.id, ...postData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.put('/posts/:id', verifyToken, async (req: AuthRequest, res) => {
  try {
    const postData = req.body;
    postData.updatedAt = FieldValue.serverTimestamp();
    await db.collection('posts').doc(req.params.id).update(postData);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.delete('/posts/:id', verifyToken, async (req: AuthRequest, res) => {
  try {
    await db.collection('posts').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ---- COMMENTS ----
router.get('/comments/:postId', optionalAuth, async (req, res) => {
  try {
    const commentsSnap = await db.collection('posts').doc(req.params.postId).collection('comments').orderBy('createdAt', 'desc').get();
    const comments = commentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.post('/comments/:postId', verifyToken, async (req: AuthRequest, res) => {
  try {
    const commentData = req.body;
    commentData.createdAt = Date.now(); // using Date.now() for simplicity if client expects it
    const postRef = db.collection('posts').doc(req.params.postId);
    const docRef = await postRef.collection('comments').add(commentData);
    
    await postRef.update({
      commentsCount: FieldValue.increment(1)
    });

    res.json({ id: docRef.id, ...commentData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// ---- ANALYTICS ----
router.get('/analytics', verifyToken, async (req: AuthRequest, res) => {
  try {
    const postsSnap = await db.collection('posts').get();
    const usersSnap = await db.collection('users').get();
    
    let totalViews = 0;
    let totalLikes = 0;
    
    postsSnap.docs.forEach(doc => {
      const data = doc.data();
      totalViews += (data.views || 0);
      totalLikes += (data.likes || 0);
    });

    res.json({
      totalPosts: postsSnap.size,
      totalUsers: usersSnap.size,
      totalViews,
      totalLikes
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
