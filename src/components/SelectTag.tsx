import {
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Tag,
  TagLabel,
  VStack,
} from '@chakra-ui/react'
import { useState } from 'react'
import { Tag as TagData } from '../types/tag'
import NormalButton from './common/NormalButton'

type Props = {
  tags: TagData[]
  handleSelectedTagChange: (tags: TagData[]) => void
}

export function SelectTag(props: Props) {
  const [newTag, setNewTag] = useState<string>('')
  const [tags, setTags] = useState<TagData[]>(props.tags)

  const isTagNameError = newTag.length > 10

  const onClickTag = (tag: TagData) => {
    const copied = [...tags]
    const index = copied.findIndex((t) => t.id === tag.id)
    copied[index].isSelected = !copied[index].isSelected
    setTags(copied)

    updateSelectedTags(copied)
  }

  const onClickAdd = (name: string) => {
    if (isTagNameError || tags.find((tag) => tag.name === name)) {
      setNewTag('')
      return
    }
    const copied = [...tags]
    const newTagData = TagData.makeNewTagWithName(name, true)
    copied.push(newTagData)
    setTags(copied)
    setNewTag('')

    updateSelectedTags(copied)
  }

  const updateSelectedTags = (tags: TagData[]) => {
    const selectedTags = tags.filter((t) => t.isSelected)
    props.handleSelectedTagChange(selectedTags)
  }

  return (
    <VStack>
      <HStack spacing={4}>
        {tags.map((tag) => (
          <Tag
            size='md'
            key={tag.name}
            borderRadius='full'
            variant='solid'
            colorScheme={tag.isSelected ? 'green' : 'gray'}
            onClick={() => {
              onClickTag(tag)
            }}
          >
            <TagLabel>{tag.name}</TagLabel>
          </Tag>
        ))}
      </HStack>
      <FormControl isInvalid={isTagNameError}>
        <HStack>
          <Input
            id='tag'
            placeholder='new tag'
            value={newTag}
            onChange={(e) => {
              setNewTag(e.target.value)
            }}
          />
          <NormalButton
            title={'Add'}
            disabled={isTagNameError}
            onClick={() => {
              onClickAdd(newTag)
            }}
          >
            Add
          </NormalButton>
        </HStack>
        {isTagNameError && <FormErrorMessage>Invalid tag name</FormErrorMessage>}
      </FormControl>
    </VStack>
  )
}
