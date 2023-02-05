import { Box, Text, Stack, Flex, VStack, IconButton, Divider, HStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Article } from '../../types/article'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import LinkCard from './LinkCard'

type Props = {
  article: Article
  isCurrentUser: boolean
  onClickDelete: (article: Article) => void
  onClickUpdae: () => void
}

export default function Item(props: Props) {
  const basePadding = 6
  return (
    <Box w='100%' bg={'white'} boxShadow={'md'} rounded={'md'} overflow={'hidden'} pb={2}>
      {props.isCurrentUser && (
        <Flex mt={1} me={1} justifyContent='end' alignContent='center'>
          <IconButton
            size='sm'
            variant='ghost'
            colorScheme='gray.700'
            aria-label='Edit'
            onClick={() => props.onClickUpdae()}
            icon={<EditIcon />}
          />
          <IconButton
            size='sm'
            variant='ghost'
            colorScheme='gray.700'
            aria-label='Edit'
            onClick={() => props.onClickDelete(props.article)}
            icon={<DeleteIcon />}
          />
        </Flex>
      )}
      <Stack spacing={2} mx={4}>
        <VStack align={'start'} spacing={1}>
          <HStack>
            {props.article.tags.map((tag) => (
              <Text
                key={tag.id}
                color={'blue.300'}
                fontWeight={800}
                fontSize={'sm'}
                letterSpacing={1.1}
              >
                {tag.name}
              </Text>
            ))}
          </HStack>
          <Text h='100px' color={'gray.700'} noOfLines={5} lineHeight={'130%'}>
            {props.article.comment}
          </Text>
          <Text color={'gray.500'} w='100%' fontSize={'xs'} align={'right'}>
            {dayjs(props.article.createdAt, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD HH:mm')}
          </Text>
        </VStack>
        <Divider />
        <LinkCard
          title={props.article.ogTitle}
          description={props.article.ogDescription}
          siteName={props.article.ogSiteName}
          url={props.article.contentURL}
        />
      </Stack>
    </Box>
  )
}
