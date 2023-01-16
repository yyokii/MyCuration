import { signOut as signOutCurrentUser } from 'firebase/auth'
import { collection, doc, getDoc } from 'firebase/firestore'
import { User, userConverter } from '../types/user'
import { auth, firestore } from './firebase'

async function checkIfRegistered(uid: string) {
  const userDocRef = doc(firestore, 'users', uid)
  const snapshot = await getDoc(userDocRef)

  return snapshot.exists()
}

async function fetchUser(uid: string): Promise<User> {
  // uidからユーザー情報を取得
  const userDocRef = doc(collection(firestore, 'users'), uid).withConverter(userConverter)
  const userDoc = await getDoc(userDocRef)

  if (!userDoc.exists()) {
    return
  }

  const user = userDoc.data() as User
  return user
}

async function signOut(): Promise<void> {
  return signOutCurrentUser(auth)
}

export { checkIfRegistered, fetchUser, signOut }
