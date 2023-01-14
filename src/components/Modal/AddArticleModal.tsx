import {
  Box,
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
  Textarea,
  VStack,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { OGP } from '../../types/ogp'
import { isValidUrl } from '../../utils/url'
import { OGPRepository } from '../../repository/ogpRepository'
import { RepositoryFactory } from '../../repository/repository'
import { SelectTag } from '../SelectTag'
import { Tag } from '../../types/tag'
import LinkCard from '../Article/LinkCard'

type Props = {
  isOpen: boolean
  tags: Tag[]
  onSubmit: (ogp: OGP, comment: string, tags: Tag[]) => void
  onClose: () => void
}

export function AddArticleModal(props: Props) {
  // State
  const initialRef = useRef()
  const [ogp, setOGP] = useState<OGP>(OGP.empty())
  const [comment, setComment] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const maxSelectableTagCount = 3

  const ogpRepository: OGPRepository = RepositoryFactory.get('ogp')

  // Validation
  const isContentURLError = ogp.url === '' || ogp.url.length > 2000
  const canSubmit = !isContentURLError && selectedTags.length <= 3

  const resetContent = () => {
    setOGP(OGP.empty())
    setComment('')
    setSelectedTags([])
  }

  const close = () => {
    resetContent()
    props.onClose()
  }

  async function onChangeInputURL(input: string) {
    if (isValidUrl(input)) {
      const ogp = await ogpRepository.get(input)
      if (ogp) {
        setOGP(ogp)
      }
    } else {
      setOGP(OGP.empty())
    }
  }

  async function onSubmit() {
    props.onSubmit(ogp, comment, selectedTags)
    close()
  }

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={props.isOpen} onClose={close}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Content</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack>
              <FormControl>
                <FormControl isInvalid={isContentURLError}>
                  {/* Input URL */}
                  <FormLabel htmlFor='url'>URL</FormLabel>
                  <Input
                    ref={initialRef}
                    id='url'
                    placeholder='URL'
                    onChange={(e) => onChangeInputURL(e.target.value)}
                    required
                  />
                  {isContentURLError && (
                    <FormErrorMessage>URL length is 0 to 2000</FormErrorMessage>
                  )}
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

                {/* Input Comment */}
                <FormLabel htmlFor='comment' mt={4}>
                  My Comment
                </FormLabel>
                <Textarea
                  id='comment'
                  placeholder='Your comment'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />

                {/* Input Tag */}
                <FormLabel mt={4}>Tag (Max {maxSelectableTagCount} tags can be selected)</FormLabel>
                <SelectTag
                  tags={props.tags}
                  handleSelectedTagChange={(tags) => {
                    setSelectedTags(tags)
                  }}
                  maxSelectableCount={maxSelectableTagCount}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' disabled={!canSubmit} mr={3} onClick={onSubmit}>
              OK
            </Button>
            <Button onClick={close}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
