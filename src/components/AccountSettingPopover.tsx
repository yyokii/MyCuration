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
  signIn: () => void
  deleteAccount: () => void
}

export default function AccountSettingPopover(props: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          me={1}
          size='sm'
          variant='ghost'
          colorScheme='gray.700'
          aria-label='Settings'
          icon={<SettingsIcon />}
        />
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>Account setting</PopoverHeader>
        <PopoverBody>
          <VStack>
            <Button
              variant='ghost'
              w='200px'
              onClick={() => {
                props.signIn()
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
