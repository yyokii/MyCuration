import Layout from '../../components/Layout'
import TwitterShareButton from '../../components/TwitterShareButton'
import { useAuthentication } from '../../hooks/authentication'
import Image from 'next/image'

export default function UsersMe() {
  const user = useAuthentication()

  if (user === null) {
    return (
      <Layout>
        <div></div>
      </Layout>
    )
  }

  const url = `${process.env.NEXT_PUBLIC_WEB_URL}/users/${user.uid}`

  return (
    <Layout>
      <section className='text-center'>
        <Image src={user.profileImageURL} width={100} height={100} alt='display name' />
        <h1 className='h4'>{user.name}のページ</h1>
        <p className='user-select-all overflow-auto'>{url}</p>
        <p>このURLをシェアしてみんなに質問してもらおう！</p>
        <div className='d-flex justify-content-center'>
          <TwitterShareButton url={url} text='質問してね！'></TwitterShareButton>
        </div>
      </section>
    </Layout>
  )
}
