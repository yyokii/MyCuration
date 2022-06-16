import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import AutoComplete from '../AutoComplete'
import { Item } from 'chakra-ui-autocomplete'

type Props = {
  isOpen: boolean
  tagItems: Item[]
  onSubmit: (url: string, comment: string, tags: Item[]) => void
  onClose: () => void
}

export function AddArticleModal(props: Props) {
  const initialRef = useRef()
  const [contentURL, setContentURL] = useState('')
  const [comment, setComment] = useState('')
  const [selectedTagItems, setSelectedTagItems] = useState<Item[]>([])

  const isInputError = contentURL === ''

  async function onSubmit() {
    props.onSubmit(contentURL, comment, selectedTagItems)
    setContentURL('')
    setComment('')
    setSelectedTagItems([])
    props.onClose()
  }

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      setSelectedTagItems(selectedItems)
    }
  }

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add article</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl isInvalid={isInputError}>
              <FormLabel htmlFor='url'>URL</FormLabel>
              <Input
                id='url'
                placeholder='URL'
                value={contentURL}
                onChange={(e) => setContentURL(e.target.value)}
                required
              />
              {isInputError && <FormErrorMessage>URLは必須です</FormErrorMessage>}
              <FormLabel htmlFor='comment'>コメント</FormLabel>
              <Input
                id='comment'
                placeholder='記事に対するコメントを入力してください'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </FormControl>
            <AutoComplete
              label='Select tags'
              placeholder='Type a tag'
              items={props.tagItems}
              selectedItems={selectedTagItems}
              handleSelectedItemsChange={(value) => handleSelectedItemsChange(value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onSubmit}>
              Save
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
