import Link from 'next/link'
import Layout from '../components/Layout'
import { useCurrentUser } from '../hooks/useCurrentUser'

export default function Home() {
  const { currentUser } = useCurrentUser()
  const myPagePath = `/users/${currentUser?.name}`

  return (
    <Layout>
      <div className='text-center'>
        <div className='row justify-content-center'>
          <div className='row col-12 col-md-6'>
            <h1>Myサービス</h1>
            <p>ここはサービスです。</p>
            <Link href={myPagePath}>
              <a className='btn btn-primary' role='button'>
                Hi！
              </a>
            </Link>
            <Link href='/signup'>
              <a className='mt-5 btn btn-primary' role='button'>
                サインアップ
              </a>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  )
}
