import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from '@chakra-ui/react'
import { useRef } from 'react'

type Props = {
  title: string
  message: string
  isOpen: boolean
  onPositiveAction: () => void
  onClose: () => void
}

export function SimpleModal(props: Props) {
  const initialRef = useRef()

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{props.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text>{props.message}</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme='blue'
              mr={3}
              onClick={function () {
                props.onPositiveAction()
                props.onClose()
              }}
            >
              OK
            </Button>
            <Button ref={initialRef} onClick={props.onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
