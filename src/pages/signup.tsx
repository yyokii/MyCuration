import { Button, StackDivider, VStack } from '@chakra-ui/react'
import { FaGoogle } from 'react-icons/fa'
import Layout from '../components/Layout'

export default function Signup() {
  return (
    <Layout>
      <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='center'>
        <Button my={8} colorScheme='teal' leftIcon={<FaGoogle />}>
          Sign in with Google
        </Button>{' '}
      </VStack>
    </Layout>
  )
}
