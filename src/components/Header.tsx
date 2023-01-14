import { Box, Flex } from '@chakra-ui/react'

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
      <Box mx={2}>My Curation</Box>
    </Flex>
  )
}
