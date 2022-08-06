import { ChakraProvider } from '@chakra-ui/react'
import { RecoilRoot, useSetRecoilState } from 'recoil'
import '../lib/firebase'
import '../hooks/useCurrentUser'
import '../styles/globals.scss'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import { userState } from '../states/user'
import { useEffect } from 'react'
import { onIdTokenChanged } from 'firebase/auth'
import { User } from '../types/User'
import { auth } from '../lib/firebase'
import { checkIfRegistered, fetchUser } from '../lib/firebase-auth'
import { useRouter } from 'next/router'

// TODO: 将来必要に応じて変更する
dayjs.locale('ja')

function AppInit() {
  const setUser = useSetRecoilState(userState)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async function (firebaseUser) {
      // User is signed in or token was refreshed.
      console.log('called onIdTokenChanged')

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

          const token = await firebaseUser.getIdToken()
          if (token) {
            console.log('Set token')
            user.identifierToken = token
            setUser(user)
          }
        } else {
          console.log('ユーザー情報未入力')
          user = {
            uid: firebaseUser.uid,
            identifierToken: ``,
            isFinishedRegisterUserInfo: isRegisterd,
            name: ``,
            profileImageURL: googleProviderData.photoURL,
            articlesCount: 0,
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

    return () => unsubscribe()
  }, [])

  return null
}

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
      <AppInit />
    </RecoilRoot>
  )
}

export default MyApp
