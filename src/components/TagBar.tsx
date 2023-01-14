import { HStack, Tag, TagLabel } from '@chakra-ui/react'
import { Tag as TagData } from '../types/tag'

type Props = {
  tags: TagData[]
  onClickTag: (tag: TagData) => void
}

export function TagBar(props: Props) {
  return (
    <HStack spacing={4} w={'full'} height={'40px'} overflow={'auto'}>
      {props.tags.map((tag) => (
        <Tag
          size='lg'
          key={tag.name}
          flexShrink='0'
          borderRadius='full'
          variant='solid'
          colorScheme={tag.isSelected ? 'green' : 'gray'}
          onClick={() => {
            props.onClickTag(tag)
          }}
        >
          <TagLabel>{tag.name}</TagLabel>
        </Tag>
      ))}
    </HStack>
  )
}
