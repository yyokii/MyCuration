import { signOut as signOutCurrentUser } from 'firebase/auth'
import { collection, doc, getDoc } from 'firebase/firestore'
import { User } from '../types/user'
import { auth, firestore } from './firebase'

export async function checkIfRegistered(uid: string) {
  const userDocRef = doc(firestore, 'users', uid)
  const snapshot = await getDoc(userDocRef)

  return snapshot.exists()
}

async function fetchUser(uid: string): Promise<User> {
  // uidからユーザー情報を取得
  const userDocRef = doc(collection(firestore, 'users'), uid)
  const userDoc = await getDoc(userDocRef)

  if (!userDoc.exists()) {
    return
  }

  const user = userDoc.data() as User

  user.uid = userDoc.id
  user.convertObjectToCategoriesCountMap(user.categoriesCount)
  return user
}

async function signOut(): Promise<void> {
  return signOutCurrentUser(auth)
}

export { fetchUser, signOut }
