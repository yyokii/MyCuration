import { GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'
import { collection, doc, getDoc } from 'firebase/firestore'
import { User } from '../types/User'
import { auth, firestore } from './firebase'

export async function checkIfRegistered(uid: string) {
  const userDocRef = doc(firestore, 'users', uid)
  const snapshot = await getDoc(userDocRef)

  if (snapshot.exists()) {
    console.log('ユーザー情報登録済みのユーザーです')
    return true
  } else {
    console.log('ユーザー情報登録がまだ登録されていません')
    return false
  }
}

export async function fetchUser(uid: string): Promise<User> {
  // uidからユーザー情報を取得
  const userDocRef = doc(collection(firestore, 'users'), uid)
  const userDoc = await getDoc(userDocRef)

  if (!userDoc.exists()) {
    return
  }

  const user = userDoc.data() as User
  user.uid = userDoc.id
  return user
}

export const login = (): Promise<never> => {
  // TODO: 言語設定などの設定変更
  const provider = new GoogleAuthProvider()
  return signInWithRedirect(auth, provider)
}

export const logout = (): Promise<void> => {
  return signOut(auth)
}
