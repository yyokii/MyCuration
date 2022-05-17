import Layout from '../components/Layout'
import { login, logout } from '../lib/firebase-auth'

export default function Signup() {
  const handleLogin = (): void => {
    console.log('login')
    login().catch((error) => console.error(error))
  }

  const handleLogout = (): void => {
    logout().catch((error) => console.error(error))
  }

  return (
    <Layout>
      <div className='text-center'>
        <div className='row justify-content-center'>
          <div className='col-12 col-md-6'>
            <h1>サインイン</h1>
            <button onClick={handleLogin}>ログイン</button>
            <button onClick={handleLogout}>ログアウト</button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
