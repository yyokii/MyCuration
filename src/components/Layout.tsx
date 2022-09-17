import { ToastContainer } from 'react-toastify'
import Head from 'next/head'
import Footer from './Fotter'
import Header from './Header'
import { signOut } from '../lib/firebase-auth'
import { RepositoryFactory } from '../repository/repository'
import { UserRepository } from '../repository/userRepository'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const title = 'Myサービス'
  const description = '〜なサービスです。'
  const ogpImageUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/images/ogp_card.png`

  const router = useRouter()

  const userRepository: UserRepository = RepositoryFactory.get('user')

  const menuContents = [
    {
      title: 'Sign out',
      action: async () => {
        await signOut()
      },
    },
    {
      title: 'Delete account',
      action: async () => {
        await userRepository.delete()
        router.push('/')
      },
    },
  ]

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta property='og:image' key='ogImage' content={ogpImageUrl} />
        <meta name='twitter:card' key='twitterCard' content='summary' />
        <meta name='twitter:image' key='twitterImage' content={ogpImageUrl} />
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
          rel='stylesheet'
        ></link>
      </Head>
      <Header menuContents={menuContents} />
      <div className='container'>{children}</div>
      <ToastContainer />
      <Footer />
    </div>
  )
}
