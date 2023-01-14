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
  maxSelectableCount: number
  handleSelectedTagChange: (tags: TagData[]) => void
}

export function SelectTag(props: Props) {
  const [newTag, setNewTag] = useState<string>('')
  const [tags, setTags] = useState<TagData[]>(props.tags)

  const isTagNameError = newTag.length > 10 || newTag.length === 0

  const onClickTag = (tag: TagData) => {
    if (!tag.isSelected && tags.filter((t) => t.isSelected).length >= props.maxSelectableCount) {
      return
    }
    const copied = [...tags]
    const index = copied.findIndex((t) => t.name === tag.name)
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
    <VStack align={'start'}>
      <HStack spacing={4} w={'full'} height={'40px'} overflow={'auto'}>
        {tags.map((tag) => (
          <Tag
            size='md'
            key={tag.name}
            flexShrink='0'
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
      <FormControl>
        <HStack>
          <Input
            w={'200px'}
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
