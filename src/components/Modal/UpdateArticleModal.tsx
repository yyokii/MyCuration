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
import { OGPRepository } from '../../repository/ogpRepository'
import { RepositoryFactory } from '../../repository/repository'
import { Article } from '../../types/article'
import { isValidUrl } from '../../utils/url'

type Props = {
  article: Article
  isOpen: boolean
  onUpdate: (url: string, title: string, comment: string) => void
  onClose: () => void
}

export function UpdateArticleModal(props: Props) {
  // State
  const initialRef = useRef()
  const [contentURL, setContentURL] = useState('')
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')

  const ogpRepository: OGPRepository = RepositoryFactory.get('ogp')

  useEffect(() => {
    if (props.article !== null && props.article !== undefined) {
      setContentURL(props.article.contentURL)
      setComment(props.article.comment)
    }
  }, [props])

  async function onChangeInputURL(input: string) {
    setContentURL(input)
    if (isValidUrl(input)) {
      const ogp = await ogpRepository.get(input)
      if (ogp) {
        setTitle(ogp.title)
      }
    }
  }

  async function onUpdateItem() {
    props.onUpdate(contentURL, title, comment)
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
                  onChange={(e) => onChangeInputURL(e.target.value)}
                />
              </FormControl>

              <FormLabel htmlFor='url'>Title</FormLabel>
              <Input id='title' value={title} onChange={(e) => setTitle(e.target.value)} required />

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
