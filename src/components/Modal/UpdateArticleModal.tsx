import {
  Box,
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
import { OGP } from '../../types/ogp'
import { isValidUrl } from '../../utils/url'
import LinkCard from '../Article/LinkCard'

type Props = {
  article: Article
  isOpen: boolean
  onUpdate: (ogp: OGP, comment: string) => void
  onClose: () => void
}

export function UpdateArticleModal(props: Props) {
  // State
  const initialRef = useRef()
  const [contentURL, setContentURL] = useState('')
  const [ogp, setOGP] = useState<OGP>(OGP.empty())

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
        setOGP(ogp)
      }
    } else {
      setOGP(OGP.empty())
    }
  }

  async function onUpdateItem() {
    props.onUpdate(ogp, comment)
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
              {ogp.url !== '' && (
                <Box width={'70%'} mt={2}>
                  <LinkCard
                    title={ogp.title}
                    description={ogp.description}
                    siteName={ogp.siteName}
                    url={ogp.url}
                  />
                </Box>
              )}
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
