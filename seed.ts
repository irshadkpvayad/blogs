import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import fs from 'fs';

const fbConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);

async function seed() {
  const images = [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  ];
  
  const techTitles = [
    "The Future of React and VDOM",
    "Tailwind CSS Pro Tips",
    "Understanding Firebase Security Rules",
    "Serverless vs Containers",
    "Building Micro-Frontends",
    "State Management in 2024",
    "Mastering TypeScript Generics",
    "Optimizing Webpack Builds",
    "Intro to WebAssembly",
    "Designing Scalable Systems",
    "UI Animation Best Practices",
    "Writing Clean Code",
    "Effective Node.js Logging",
    "Gatsby vs Next.js",
    "A Guide to GraphQL"
  ];

  const catRef = await addDoc(collection(db, 'categories'), {
    name: 'Technology',
    slug: 'technology',
    createdAt: Date.now()
  });

  const subCatRef = await addDoc(collection(db, 'categories', catRef.id, 'subcategories'), {
    name: 'Web Dev',
    slug: 'web-dev',
    createdAt: Date.now()
  });

  for (let i = 0; i < 15; i++) {
     await addDoc(collection(db, 'posts'), {
        title: techTitles[i] || `Amazing Post ${i}`,
        subtitle: `An in-depth look at ${techTitles[i] || 'the topic'} with practical examples and insights.`,
        thumbnail: images[i % images.length],
        content: `<p>This is the amazing content for <strong>${techTitles[i]}</strong>.</p>
        <p>Technology continues to evolve rapidly. Let's explore how we can leverage these new tools to build better software.</p>`,
        categoryId: catRef.id,
        subCategoryId: subCatRef.id,
        authorId: 'admin_seeded',
        status: 'published',
        createdAt: Date.now() - (i * 86400000), // spread over days
        updatedAt: Date.now(),
        views: Math.floor(Math.random() * 1000),
        likes: Math.floor(Math.random() * 100)
     });
  }
  console.log("Seeding complete!");
  process.exit(0);
}
seed();
