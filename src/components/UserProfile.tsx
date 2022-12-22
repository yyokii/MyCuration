import { Box, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react'

type Props = {
  name: string
  imageURL: string
  articleCounts: number
}

export default function UserProfile(props: Props) {
  return (
    <Box textAlign={'center'}>
      <HStack spacing={5}>
        <Image borderRadius='full' src={props.imageURL} width={100} height={100} alt='user icon' />

        <VStack align={'start'}>
          <Heading fontSize={'2xl'} fontFamily={'body'}>
            {props.name}
          </Heading>
          <Text color={'red.400'} fontWeight={'semibold'}>
            {props.articleCounts} articles
          </Text>
        </VStack>
      </HStack>
    </Box>
  )
}
