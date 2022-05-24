import { RecoilRoot, useSetRecoilState } from 'recoil'
import '../lib/firebase'
import '../hooks/useCurrentUser'
import '../styles/globals.scss'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { userState } from '../states/user'
import { useEffect } from 'react'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, getFirestore, setDoc } from 'firebase/firestore'
import { User } from '../types/User'
import { app } from '../lib/firebase'
import { checkIfRegistered, fetchUser } from '../lib/firebase-auth'
import { useRouter } from 'next/router'

// TODO: 将来必要に応じて変更する
dayjs.locale('ja')

function AppInit() {
  const setUser = useSetRecoilState(userState)
  const auth = getAuth(app)
  const router = useRouter()

  useEffect(() => {
    onAuthStateChanged(auth, async function (firebaseUser) {
      console.log('called onAuthStateChanged')
      if (firebaseUser) {
        console.log('Set user')

        const googleProviderData = firebaseUser.providerData.filter(
          (data) => data.providerId === 'google.com',
        )[0]

        // 且つ、usersコレクションにも存在しているか確認
        const isRegisterd = await checkIfRegistered(firebaseUser.uid)

        let user: User
        if (isRegisterd) {
          user = await fetchUser(firebaseUser.uid)
        } else {
          console.log('ユーザー情報未入力')
          user = {
            uid: firebaseUser.uid,
            isFinishedRegisterUserInfo: isRegisterd,
            name: ``,
            profileImageURL: googleProviderData.photoURL,
          }
          if (router.isReady) {
            router.push('/onboarding')
          }
        }

        setUser(user)
      } else {
        console.log('User is not signed in')
        setUser(null)
      }
    })
  }, [])

  return null
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

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <AppInit />
    </RecoilRoot>
  )
}

export default MyApp
