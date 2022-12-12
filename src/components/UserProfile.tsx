import { Box, Center, Heading, HStack, Image, Text, VStack } from '@chakra-ui/react'

type Props = {
  name: string
  imageURL: string
  articleCounts: number
}

export default function UserProfile(props: Props) {
  return (
    <Center>
      <Box maxW={'320px'} w={'full'} bg={'white'} rounded={'lg'} p={6} textAlign={'center'}>
        <HStack spacing={5}>
          <Image
            borderRadius='full'
            src={props.imageURL}
            width={100}
            height={100}
            alt='user icon'
          />

          <VStack align={'start'}>
            <Heading fontSize={'2xl'} fontFamily={'body'}>
              {props.name}
            </Heading>
            <Text fontWeight={600} color={'gray.500'}>
              {props.articleCounts} articles
            </Text>
          </VStack>
        </HStack>
      </Box>
    </Center>
  )
}
