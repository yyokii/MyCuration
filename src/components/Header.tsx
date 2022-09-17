import {
  Box,
  Flex,
  HStack,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Spacer,
  Stack,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon, AddIcon } from '@chakra-ui/icons'

type Props = {
  menuContents: MenuContent[]
}

export interface MenuContent {
  title: string
  action: () => void
}

export default function Header(props: Props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <HStack spacing={8} alignItems={'center'}>
            <Box>Logo</Box>
          </HStack>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>

        {isOpen ? (
          <Flex>
            <Spacer />
            <Box pb={4}>
              <Stack as={'nav'} spacing={4}>
                {props.menuContents.map((menu) => (
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
