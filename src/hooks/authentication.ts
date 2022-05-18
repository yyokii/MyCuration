import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { User } from '../models/User'
import { atom, useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore'

/**
 * Userがnull: 未ログインユーザー
 * UserのisFinishedRegisterUserInfoの値がfalse: ユーザー情報登録がまだ完了していない
 * UserのisFinishedRegisterUserInfoの値がtrue: ユーザー情報登録が完了している
 */
const userState = atom<User>({
  key: 'user',
  default: null,
})

/**
 * ログイン中のユーザー情報を取得する
 *
 * @returns {User} ログイン中のユーザー情報
 */
export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState)

  // https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
  useEffect(() => {
    if (user !== null) {
      console.log('User is signed in')
      return
    }

    const auth = getAuth()

    onAuthStateChanged(auth, async function (firebaseUser) {
      if (firebaseUser) {
        console.log('Set user')

        const googleProviderData = firebaseUser.providerData.filter(
          (data) => data.providerId === 'google.com',
        )[0]

        // 且つ、usersコレクションにも存在しているか確認
        const isRegisterd = await checkIfRegistered(firebaseUser.uid)

        const loginUser: User = {
          uid: firebaseUser.uid,
          isFinishedRegisterUserInfo: isRegisterd,
          name: googleProviderData.displayName,
          profileImageURL: googleProviderData.photoURL,
        }

        setUser(loginUser)
        createUserIfNotFound(loginUser)
      } else {
        console.log('User is not signed in')
        setUser(null)
      }
    })
  }, [])

  return user
}

async function createUserIfNotFound(user: User) {
  const db = getFirestore()
  const usersCollection = collection(db, 'users')
  const userRef = doc(usersCollection, user.uid)
  const document = await getDoc(userRef)
  if (document.exists()) {
    return
  }

  await setDoc(userRef, {
    name: new Date().getTime(),
  })
}

async function checkIfRegistered(uid: string) {
  const db = getFirestore()
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
