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
  VStack,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { CategorySelect } from '../Category/CategorySelect'
import { Category } from '../../types/category'
import { OGP } from '../../types/ogp'
import { isValidUrl } from '../../utils/url'
import { OGPRepository } from '../../repository/ogpRepository'
import { RepositoryFactory } from '../../repository/repository'

type Props = {
  isOpen: boolean
  categories: Category[]
  onSubmit: (ogp: OGP, comment: string, category: Category) => void
  onClose: () => void
}

export function AddArticleModal(props: Props) {
  // State
  const initialRef = useRef()
  const [ogp, setOGP] = useState<OGP>(OGP.empty())
  const [comment, setComment] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category>(null)

  const ogpRepository: OGPRepository = RepositoryFactory.get('ogp')

  // Flag
  const isContentURLError = ogp.url === '' || ogp.url.length > 2000
  const canSubmit = !isContentURLError && selectedCategory !== null

  async function onChangeInputURL(input: string) {
    if (isValidUrl(input)) {
      const ogp = await ogpRepository.get(input)
      if (ogp) {
        setOGP(ogp)
      }
    }
  }

  async function onSubmit() {
    props.onSubmit(ogp, comment, selectedCategory)
    setOGP(OGP.empty())
    setComment('')
    setSelectedCategory(null)
    props.onClose()
  }

  function handleSelectedcategoryChange(categoryId: string) {
    const selectedCategory = props.categories.find((c) => c.id === categoryId)
    setSelectedCategory(selectedCategory)
  }

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={props.isOpen} onClose={props.onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add article</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack>
              <FormControl>
                <FormControl isInvalid={isContentURLError}>
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

                <FormLabel htmlFor='url'>Title</FormLabel>
                <Input id='title' value={ogp.title} required />

                <FormLabel mt={4}>Category</FormLabel>
                <CategorySelect
                  categories={props.categories}
                  onChange={handleSelectedcategoryChange}
                />

                <FormLabel htmlFor='comment' mt={4}>
                  Comment
                </FormLabel>
                <Input
                  id='comment'
                  placeholder='Your comment'
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' disabled={!canSubmit} mr={3} onClick={onSubmit}>
              Save
            </Button>
            <Button onClick={props.onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
