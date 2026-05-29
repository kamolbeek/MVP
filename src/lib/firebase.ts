import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId:     process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Singleton app — Next.js hot-reload da ikki marta initializeApp chaqirilmasligi uchun
function firebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

// Servislar lazy (kechiktirilgan) initsializatsiya qilinadi.
// Shu sababli modulni import qilishning o'zi getAuth() ni chaqirmaydi —
// statik sahifalarni build paytida prerender qilishda (kalit bo'lmasa ham) ilova yiqilmaydi.
let _auth: Auth | undefined;
let _db: Firestore | undefined;
let _storage: FirebaseStorage | undefined;

export function getAuthClient(): Auth {
  return (_auth ??= getAuth(firebaseApp()));
}

export function getDb(): Firestore {
  return (_db ??= getFirestore(firebaseApp()));
}

export function getStorageClient(): FirebaseStorage {
  return (_storage ??= getStorage(firebaseApp()));
}
