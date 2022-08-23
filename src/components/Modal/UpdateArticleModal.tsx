import {
  Button,
  FormControl,
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
import { useEffect, useRef, useState } from 'react'
import { Article } from '../../types/article'

type Props = {
  article: Article
  isOpen: boolean
  onUpdate: (url: string, comment: string) => void
  onClose: () => void
}

export function UpdateArticleModal(props: Props) {
  const initialRef = useRef()
  const [contentURL, setContentURL] = useState('')
  const [comment, setComment] = useState('')

  useEffect(() => {
    if (props.article !== null && props.article !== undefined) {
      setContentURL(props.article.contentURL)
      setComment(props.article.comment)
    }
  }, [props])

  async function onUpdateItem() {
    props.onUpdate(contentURL, comment)
    setContentURL('')
    setComment('')
    props.onClose()
  }

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Article</ModalHeader>
          <ModalCloseButton />
          {props.article && (
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Content URL</FormLabel>
                <Input
                  ref={initialRef}
                  placeholder='Content URL'
                  value={contentURL}
                  onChange={(e) => setContentURL(e.target.value)}
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Comment</FormLabel>
                <Input
                  placeholder='Comment'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FormControl>
            </ModalBody>
          )}
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onUpdateItem}>
              Save
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
