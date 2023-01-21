import { Box, Flex } from '@chakra-ui/react'
import Image from 'next/image'

export default function Header() {
  return (
    <Flex
      padding={2}
      h='40px'
      backgroundColor='white'
      w='100%'
      alignItems={'center'}
      borderBottom={1}
      borderStyle={'solid'}
      borderColor={'gray.300'}
    >
      <Image
        src='/images/icon.png'
        width={32}
        height={32}
        alt='My curation'
        onClick={() => {
          window.location.href = '/'
        }}
      />
    </Flex>
  )
}
