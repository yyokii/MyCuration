import { VStack } from '@chakra-ui/react'
import FeaturesList from '../components/FeaturesList'
import Hero from '../components/Hero'
import Layout from '../components/Layout'
import { useCurrentUser } from '../hooks/useCurrentUser'

export default function Home() {
  const { currentUser } = useCurrentUser()
  const myPagePath = `/users/${currentUser?.name}`

  return (
    <Layout>
      <VStack spacing={4} align='center'>
        <Hero />
        <FeaturesList />
      </VStack>
    </Layout>
  )
}
