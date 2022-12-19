import { Button, ButtonProps } from '@chakra-ui/react'

export default function AddContentButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      px={4}
      fontSize={'sm'}
      rounded={'full'}
      color={'red.400'}
      boxShadow='lg'
      p='6'
      bg='white'
      _hover={{
        bg: 'gray.100',
      }}
      _focus={{
        bg: 'gray.100',
      }}
    >
      Add Content
    </Button>
  )
}
