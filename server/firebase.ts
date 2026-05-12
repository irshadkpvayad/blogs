import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
try {
  const serviceAccountPath = path.resolve(process.cwd(), 'firebase-adminsdk-fbsvc.json');
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully.');
  } else {
    console.warn('Firebase Admin service account not found at', serviceAccountPath);
    // Initialize without credentials for local emulators or if relying on environment variables
    admin.initializeApp();
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
}

export const db = admin.firestore();
export const auth = admin.auth();
