import { firestore } from './firebase'
import { User } from '../types/user'
import { doc, collection, getDoc } from 'firebase/firestore'
import { UserID } from '../types/userID'

export async function fetchUserWithName(name: string): Promise<User> {
  // ユーザー名からuidを取得
  const userNameRef = doc(collection(firestore, 'userNames'), name)
  const userNameDoc = await getDoc(userNameRef)

  if (!userNameDoc.exists()) {
    return
  }

  const userID = (userNameDoc.data() as UserID).uid

  // uidからユーザー情報を取得
  const userDocRef = doc(collection(firestore, 'users'), userID)
  const userDoc = await getDoc(userDocRef)

  if (!userDoc.exists()) {
    return
  }

  const user = userDoc.data() as User
  user.uid = userDoc.id
  return user
}
