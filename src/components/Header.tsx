import { Box, Flex, HStack, IconButton, useDisclosure, Spacer, Stack } from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box px={4} boxShadow='md'>
        <Flex h='40px' alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Box>Logo</Box>
          </HStack>
        </Flex>
      </Box>
    </>
  )
}
