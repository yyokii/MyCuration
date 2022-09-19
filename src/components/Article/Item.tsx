import Image from 'next/image'
import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Flex,
  VStack,
  IconButton,
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
    <Center py={basePadding}>
      <Box
        maxW={'400px'}
        w={'250px'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={basePadding}
        overflow={'hidden'}
      >
        <Box h={'120px'} bg={'gray.100'} mt={-basePadding} mx={-basePadding} pos={'relative'}>
          {/*  */}
          <Image
            src={
              'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
            layout={'fill'}
            alt={'Article OGP'}
          />
        </Box>
        <Stack spacing={2}>
          {props.isCurrentUser && (
            <Flex justifyContent='end' alignContent='center' mx={-basePadding}>
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
          {props.article.category !== '' && (
            <Text color={'green.500'} fontWeight={800} fontSize={'sm'} letterSpacing={1.1}>
              {props.article.category}
            </Text>
          )}
          <VStack align={'start'} spacing={0}>
            <Text color={'gray.500'}>
              {dayjs(props.article.createdAt, 'YYYY-MM-DDThh:mm:ss').format('YYYY/MM/DD HH:mm')}
            </Text>
            <Heading
              color={useColorModeValue('gray.700', 'white')}
              fontSize={'2xl'}
              fontFamily={'body'}
              pt={0}
            >
              {props.article.contentURL}
            </Heading>
          </VStack>
          <Text color={'gray.500'} noOfLines={2}>
            {props.article.comment}
          </Text>
        </Stack>
      </Box>
    </Center>
  )
}
