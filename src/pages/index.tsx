import { Box, Button, chakra, StackDivider, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { useCurrentUser } from '../hooks/useCurrentUser'

export default function Home() {
  const { currentUser } = useCurrentUser()
  const myPagePath = `/users/${currentUser?.name}`

  return (
    <Layout>
      <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='center'>
        <Box h='40px'>Myサービス</Box>
        <Box h='40px'>
          <Link href={myPagePath} passHref>
            <Button as='a'>My page</Button>
          </Link>
        </Box>
        <Box h='40px' my={5}>
          <Link href='/signup' passHref>
            <Button as='a'>サインアップ</Button>
          </Link>
        </Box>
      </VStack>
    </Layout>
  )
}
