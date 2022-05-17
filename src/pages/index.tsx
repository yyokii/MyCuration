import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  return (
    // TODO: サインイン、会員登録機能への導線を追加する
    <Layout>
      <div className='text-center'>
        <div className='row justify-content-center'>
          <div className='row col-12 col-md-6'>
            <h1>Myサービス</h1>
            <p>ここはサービスです。</p>
            <Link href='/users/me'>
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
