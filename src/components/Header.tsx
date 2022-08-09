import { ReactNode } from 'react'
import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Spacer,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'
import { signOut } from '../lib/firebase-auth'

interface MenuContent {
  title: string
  action: () => void
}

export default function Header() {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const menuContents: MenuContent[] = [
    {
      title: 'Sign out',
      action: async () => {
        await signOut()
      },
    },
  ]

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Box>Logo</Box>
            <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
              {menuContents.map((menu) => (
                <Box key={menu.title} onClick={menu.action}>
                  {menu.title}
                </Box>
              ))}
            </HStack>
          </HStack>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>

        {isOpen ? (
          <Flex>
            <Spacer />
            <Box pb={4} display={{ md: 'none' }}>
              <Stack as={'nav'} spacing={4}>
                {menuContents.map((menu) => (
                  <Box key={menu.title} onClick={menu.action}>
                    {menu.title}
                  </Box>
                ))}
              </Stack>
            </Box>
          </Flex>
        ) : null}
      </Box>
    </>
  )
}
