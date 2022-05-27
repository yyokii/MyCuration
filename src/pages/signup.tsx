import Link from 'next/link'
import Layout from '../components/Layout'
import { login, logout } from '../lib/firebase-auth'

export default function Signup() {
  const handleLogout = (): void => {
    logout().catch((error) => console.error(error))
  }

  return (
    <Layout>
      <div className='text-center'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-6'>
            <h1>サインイン</h1>
            <Link href='/auth-redirect?redirect_uri=onboarding'>
              <a className='mt-5 btn btn-primary' role='button'>
                ログイン
              </a>
            </Link>
            {/* <button onClick={handleLogout}>ログアウト</button> */}
          </div>
        </div>
      </div>
    </Layout>
  )
}
