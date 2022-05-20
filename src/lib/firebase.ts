import { initializeApp, getApps, FirebaseApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

import 'firebase/analytics'
import 'firebase/auth'
import 'firebase/firestore'

var firebaseApp: FirebaseApp

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
  getAnalytics()
} else {
  firebaseApp = getApps()[0]
}

export const app = firebaseApp
