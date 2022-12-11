import {
  Box,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Flex,
  VStack,
  IconButton,
  Divider,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Article } from '../../types/article'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'

type Props = {
  article: Article
  isCurrentUser: boolean
  onClickDelete: (article: Article) => void
  onClickUpdae: () => void
}

export default function Item(props: Props) {
  const basePadding = 6
  return (
    <Box
      w={'250px'}
      bg={useColorModeValue('white', 'gray.900')}
      boxShadow={'2xl'}
      rounded={'md'}
      // p={basePadding}
      overflow={'hidden'}
      pb={2}
    >
      {props.isCurrentUser && (
        <Flex justifyContent='end' alignContent='center'>
          <IconButton
            size='md'
            variant='ghost'
            colorScheme='teal'
            aria-label='Edit'
            onClick={() => props.onClickUpdae()}
            icon={<EditIcon />}
          />
          <IconButton
            size='md'
            variant='ghost'
            colorScheme='teal'
            aria-label='Edit'
            onClick={() => props.onClickDelete(props.article)}
            icon={<DeleteIcon />}
          />
        </Flex>
      )}
      <Stack spacing={2} mx={4}>
        <VStack align={'start'} spacing={0}>
          {props.article.categoryData != null && (
            <Text color={'green.500'} fontWeight={800} fontSize={'sm'} letterSpacing={1.1}>
              {props.article.categoryData.name}
            </Text>
          )}
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}
            pt={0}
          >
            {props.article.title}
          </Heading>
          <Text color={'gray.500'} noOfLines={2} fontSize={'xs'} lineHeight={'120%'}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard
          </Text>
        </VStack>
        <Divider />
        <Text color={'gray.700'} noOfLines={5} lineHeight={'130%'}>
          {/* {props.article.comment} */}
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the industry's standard dummy text ever since the 1500s, when an unknown printer took
          a galley of type and scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting
        </Text>
        <Text color={'gray.500'} w='100%' fontSize={'xs'} align={'right'}>
          {dayjs(props.article.createdAt, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD HH:mm')}
        </Text>
      </Stack>
    </Box>
  )
}
