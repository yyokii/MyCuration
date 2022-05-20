import { NextPage } from 'next'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import * as firebaseAuth from 'firebase/auth'
import Layout from '../components/Layout'

const AuthRedirectPage: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    if (!router.isReady) {
      return
    }

    ;(async () => {
      const result = await firebaseAuth.getRedirectResult(firebaseAuth.getAuth())
      if (result == null) {
        // result がない時は認証前
        // `auth/redirect-cancelled-by-user` 等のエラー検証が必要だが、ここでは省略
        await firebaseAuth.signInWithRedirect(
          firebaseAuth.getAuth(),
          new firebaseAuth.GoogleAuthProvider(),
        )
      } else {
        // result がある時は認証済み
        // オープンリダイレクタ等を回避するために検証が必要だが、ここでは省略
        const redirectUri = router.query['redirect_uri'] as string | undefined
        router.push(redirectUri || '/')
      }
    })()
  }, [router.isReady])

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
