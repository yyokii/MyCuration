import { Box, Button, StackDivider, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { login, logout } from '../lib/firebase-auth'

export default function Signup() {
  const handleLogout = (): void => {
    logout().catch((error) => console.error(error))
  }

  return (
    <Layout>
      <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='center'>
        <Box h='40px' my={5}>
          <Link href='/auth-redirect?redirect_uri=onboarding' passHref>
            <Button as='a'>ログイン</Button>
          </Link>
        </Box>
      </VStack>
    </Layout>
  )
}
