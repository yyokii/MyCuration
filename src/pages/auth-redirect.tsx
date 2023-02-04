import { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as firebaseAuth from 'firebase/auth'
import Layout from '../components/Layout'
import { auth } from '../lib/firebase'

const redirectableWhiteList = ['', 'onboarding']

const AuthRedirectPage: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    ;(async () => {
      /*
       getRedirectResultがSafariでうまく機能しない問題がある。 https://github.com/firebase/firebase-js-sdk/issues/6716
       vercelのrewriteを利用して対応している。https://zenn.dev/s7/scraps/a5188235db00d0
       */
      const result = await firebaseAuth.getRedirectResult(auth)
      if (result == null) {
        // result がない時は認証前
        // `auth/redirect-cancelled-by-user` 等のエラー検証が必要
        // https://firebase.google.com/docs/reference/js/auth#autherrorcodes
        await firebaseAuth
          .signInWithRedirect(auth, new firebaseAuth.GoogleAuthProvider())
          .catch((error) => {
            console.log(error)
            // TODO: エラーページを表示する
          })
      } else {
        // result がある時は認証済み
        const redirectUri = router.query['redirect_uri'] as string | undefined
        if (redirectableWhiteList.includes(redirectUri)) {
          // オープンリダイレクタ回避
          router.push(redirectUri)
        } else {
          // TODO: エラーページを表示する？
          router.push(redirectUri || '/')
        }
      }
    })()
  }, [router, router.isReady])

  return (
    <Layout>
      <div className='text-center'>
        <div className='row justify-content-center'>
          <h1>Loading</h1>
        </div>
      </div>
    </Layout>
  )
}

export default AuthRedirectPage
