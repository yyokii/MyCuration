import Image from 'next/image'
import {
  Box,
  Center,
  Heading,
  Text,
  HStack,
  Stack,
  useColorModeValue,
  Circle,
  Flex,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { Article } from '../../types/Article'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'

type Props = {
  article: Article
  isCurrentUser: boolean
  onClickDelete: (article: Article) => void
  onClickUpdae: () => void
}

export default function Item(props: Props) {
  return (
    <Center py={6}>
      <Box
        maxW={'445px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
      >
        <Box h={'210px'} bg={'gray.100'} mt={-6} mx={-6} mb={6} pos={'relative'}>
          <Image
            src={
              'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
            }
            layout={'fill'}
            alt={'Article OGP'}
          />
        </Box>
        <Stack>
          {props.isCurrentUser && (
            <Flex justifyContent='end' alignContent='center'>
              <Circle
                mr={2}
                size='24px'
                bg='tomato'
                color='white'
                onClick={() => props.onClickUpdae()}
              >
                <EditIcon />
              </Circle>
              <Circle
                size='24px'
                bg='tomato'
                color='white'
                onClick={() => props.onClickDelete(props.article)}
              >
                <DeleteIcon />
              </Circle>
            </Flex>
          )}
          <HStack>
            {props.article.displayTags.length > 0 &&
              props.article.displayTags.map((tag) => (
                <Text
                  color={'green.500'}
                  fontWeight={800}
                  fontSize={'sm'}
                  letterSpacing={1.1}
                  key={tag}
                >
                  {tag}
                </Text>
              ))}
          </HStack>
          <Heading
            color={useColorModeValue('gray.700', 'white')}
            fontSize={'2xl'}
            fontFamily={'body'}
          >
            {props.article.contentURL}
          </Heading>
          <Text color={'gray.500'}>{props.article.comment}</Text>
        </Stack>
        <Stack direction={'column'} spacing={0} fontSize={'sm'}>
          <Text color={'gray.500'}>
            {dayjs(props.article.createdAt.toDate()).format('YYYY/MM/DD HH:mm')}
          </Text>
        </Stack>
      </Box>
    </Center>
  )
}
