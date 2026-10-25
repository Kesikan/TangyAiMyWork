import { initializeApp, type FirebaseApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore'

const env = import.meta.env

const required = {
  VITE_FIREBASE_API_KEY: env.VITE_FIREBASE_API_KEY,
  VITE_FIREBASE_AUTH_DOMAIN: env.VITE_FIREBASE_AUTH_DOMAIN,
  VITE_FIREBASE_PROJECT_ID: env.VITE_FIREBASE_PROJECT_ID,
  VITE_FIREBASE_STORAGE_BUCKET: env.VITE_FIREBASE_STORAGE_BUCKET,
  VITE_FIREBASE_MESSAGING_SENDER_ID: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  VITE_FIREBASE_APP_ID: env.VITE_FIREBASE_APP_ID,
}

const missing = Object.entries(required)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missing.length > 0) {
  throw new Error(
    `Missing Firebase environment variables: ${missing.join(', ')}. Copy .env.example to .env and fill them in.`,
  )
}

const app: FirebaseApp = initializeApp({
  apiKey: required.VITE_FIREBASE_API_KEY,
  authDomain: required.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: required.VITE_FIREBASE_PROJECT_ID,
  storageBucket: required.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: required.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: required.VITE_FIREBASE_APP_ID,
})

export const db: Firestore = getFirestore(app)

if (env.VITE_USE_EMULATORS === 'true') {
  connectFirestoreEmulator(db, 'localhost', 8080)
}
