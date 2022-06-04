import { Box, HStack, VStack } from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Article } from '../../types/Article'

type Props = {
  article: Article
  isCurrentUser: boolean
  onClickDelete: (article: Article) => void
}

export default function Item(props: Props) {
  return (
    <div key={props.article.id}>
      <div className='card my-3'>
        {props.isCurrentUser && (
          <div>
            <div className='m-1 text-end' onClick={() => props.onClickDelete(props.article)}>
              <i className='material-icons'>delete</i>
            </div>
          </div>
        )}
        <div>
          <VStack>
            <div className='text-truncate'>{props.article.contentURL}</div>
            <HStack>
              {props.article.displayTags.map((tag) => (
                <Box key={tag}>{tag}</Box>
              ))}
            </HStack>
          </VStack>
          <div className='text-muted text-end'>
            <small>{dayjs(props.article.createdAt.toDate()).format('YYYY/MM/DD HH:mm')}</small>
          </div>
        </div>
      </div>
    </div>
  )
}
