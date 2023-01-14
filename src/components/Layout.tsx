import { ToastContainer } from 'react-toastify'
import Head from 'next/head'
import Footer from './Fotter'
import Header from './Header'
import { Box, Flex } from '@chakra-ui/react'

export default function Layout({ children }) {
  const title = 'My Curation'
  const description = 'My Curation'
  const ogpImageUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/images/ogp_card.png`

  return (
    <Box>
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
      <Header />
      <Box className='container'>{children}</Box>
      <ToastContainer />
      <Footer />
    </Box>
  )
}
