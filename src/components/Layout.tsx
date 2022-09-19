import { ToastContainer } from 'react-toastify'
import Head from 'next/head'
import Footer from './Fotter'
import Header from './Header'

export default function Layout({ children }) {
  const title = 'Myサービス'
  const description = '〜なサービスです。'
  const ogpImageUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/images/ogp_card.png`

  const menuContents = []

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
