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
import { updateDoc, doc } from 'firebase/firestore'
import { FormEvent, useEffect, useRef, useState } from 'react'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { firestore } from '../../lib/firebase'
import { Article } from '../../types/Article'

type Props = {
  article: Article
  isOpen: boolean
  onClose: () => void
}

export function UpdateArticleModal(props: Props) {
  const initialRef = useRef()
  const { currentUser } = useCurrentUser()
  const [contentURL, setContentURL] = useState('')
  const [comment, setComment] = useState('')

  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    if (props.article !== null) {
      setContentURL(props.article.contentURL)
      setComment(props.article.comment)
    }
  }, [props])

  async function onUpdateItem() {
    setIsSending(true)
    const docRef = doc(firestore, `users/${currentUser.uid}/articles`, props.article.id)
    await updateDoc(docRef, {
      contentURL: contentURL,
      comment: comment,
    })
    setIsSending(false)
    props.onClose()
  }

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
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
            <Button colorScheme='blue' mr={3} onClick={() => onUpdateItem()}>
              Save
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
