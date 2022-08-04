import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

import 'firebase/analytics'
import { connectAuthEmulator, getAuth } from 'firebase/auth'
import 'firebase/firestore'
import { connectFirestoreEmulator, Firestore, getFirestore } from 'firebase/firestore'

var firebaseApp: FirebaseApp

export const shouldUseEmulator = () => {
  const useEmulator: string = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR
  return useEmulator === 'true'
}

// No Firebase App '[DEFAULT]' has been created - call Firebase App.initializeApp() (app/no-app)
// https://github.com/vercel/next.js/discussions/11351
if (getApps().length === 0) {
  // 初期化済みでない場合に実行
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  }

  firebaseApp = initializeApp(firebaseConfig)

  if (shouldUseEmulator()) {
    connectFirestoreEmulator(getFirestore(firebaseApp), 'localhost', 8081)
    connectAuthEmulator(getAuth(firebaseApp), 'http://localhost:9099')
  }

  if (typeof window !== 'undefined') {
    getAnalytics(firebaseApp)
  }
} else {
  firebaseApp = getApps()[0]
}

export const app = firebaseApp
export const firestore = getFirestore(app)
export const auth = getAuth(app)
