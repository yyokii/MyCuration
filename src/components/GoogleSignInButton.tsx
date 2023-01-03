import { FcGoogle } from 'react-icons/fc'
import { Button, ButtonProps, Center, Text } from '@chakra-ui/react'

export default function GoogleSignInButton(props: ButtonProps) {
  return (
    <Button {...props} w={'full'} maxW={'md'} variant={'outline'} leftIcon={<FcGoogle />}>
      <Center>
        <Text>Sign in with Google</Text>
      </Center>
    </Button>
  )
}
