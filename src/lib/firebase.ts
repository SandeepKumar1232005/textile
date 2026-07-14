import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import config from '../../firebase-applet-config.json';

// We need to parse the config format given by the AI studio setup
const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
  measurementId: config.measurementId,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app, config.firestoreDatabaseId || '(default)');
export const auth = getAuth(app);
export const storage = getStorage(app);
