import * as admin from 'firebase-admin'
import { shouldUseEmulator } from './firebase'

if (admin.apps.length == 0) {
  if (shouldUseEmulator()) {
    admin.initializeApp({
      projectId: 'my-curation',
    })
  } else {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
    })
  }
}

const firestore = admin.firestore()
const auth = admin.auth()
export { firestore, auth }
