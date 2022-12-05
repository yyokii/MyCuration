import { Box, Button, StackDivider, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { FaGoogle } from 'react-icons/fa'
import Layout from '../components/Layout'

export default function Signup() {
  const router = useRouter()

  return (
    <Layout>
      <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='center'>
        <Box h='40px' my={8}>
          <Button
            colorScheme='teal'
            leftIcon={<FaGoogle />}
            onClick={() => {
              router.push('/auth-redirect?redirect_uri=onboarding')
            }}
          >
            Sign in with Google
          </Button>
        </Box>
      </VStack>
    </Layout>
  )
}
