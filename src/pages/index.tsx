import { Heading, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import FeaturesList from '../components/FeaturesList'
import GoogleSignInButton from '../components/GoogleSignInButton'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import { useCurrentUser } from '../hooks/useCurrentUser'

export default function Home() {
  const { currentUser } = useCurrentUser()
  const router = useRouter()

  const myPagePath = `/users/${currentUser?.name}`

  return (
    <Layout>
      <VStack spacing={4} align='center'>
        <Hero />
        <FeaturesList />
        <VStack spacing={4} pb={8}>
          <Heading fontSize={'3xl'}>Start</Heading>
          <GoogleSignInButton
            onClick={() => {
              router.push('/auth-redirect?redirect_uri=onboarding')
            }}
          />
        </VStack>
      </VStack>
    </Layout>
  )
}
