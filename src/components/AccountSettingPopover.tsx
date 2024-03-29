import { SettingsIcon } from '@chakra-ui/icons'
import {
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  VStack,
} from '@chakra-ui/react'

type Props = {
  signOut: () => void
  deleteAccount: () => void
}

export default function AccountSettingPopover(props: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          _focus={{ boxShadow: 'none' }}
          size='md'
          variant='ghost'
          colorScheme='gray.700'
          aria-label='Settings'
          icon={<SettingsIcon />}
        />
      </PopoverTrigger>
      <PopoverContent _focus={{ boxShadow: 'none' }}>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Account setting</PopoverHeader>
        <PopoverBody>
          <VStack>
            <Button
              variant='ghost'
              w='200px'
              onClick={() => {
                props.signOut()
              }}
            >
              Sign out
            </Button>
            <Button
              variant='ghost'
              w='200px'
              onClick={() => {
                props.deleteAccount()
              }}
            >
              Delete account
            </Button>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
