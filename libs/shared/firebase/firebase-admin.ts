import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'local'}` });

let privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (!privateKey) throw new Error('Missing FIREBASE_PRIVATE_KEY');
privateKey = privateKey.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey,
  }),
});
export default admin;