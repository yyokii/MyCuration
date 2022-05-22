import { getAuth, GoogleAuthProvider, signInWithRedirect, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { app, firestore } from './firebase'

export async function checkIfRegistered(uid: string) {
  const db = firestore
  const userDocRef = doc(db, 'users', uid)
  const snapshot = await getDoc(userDocRef)

  if (snapshot.exists()) {
    console.log('ユーザー情報登録済みのユーザーです')
    return true
  } else {
    console.log('ユーザー情報登録がまだ登録されていません')
    return false
  }
}

export const login = (): Promise<never> => {
  // TODO: 言語設定などの設定変更
  const provider = new GoogleAuthProvider()
  const auth = getAuth(app)
  return signInWithRedirect(auth, provider)
}

export const logout = (): Promise<void> => {
  const auth = getAuth(app)
  return signOut(auth)
}
