import { Box, Heading, Text, Flex, VStack, IconButton } from '@chakra-ui/react'
import { ExternalLinkIcon } from '@chakra-ui/icons'

type Props = {
  title: string
  description: string
  siteName: string
  url: string
}

export default function LinkCard(props: Props) {
  return (
    <Box
      w='full'
      bg={'white'}
      border='1px'
      borderColor='gray.400'
      rounded={'md'}
      overflow={'hidden'}
      pb={2}
    >
      <Flex me={1} justifyContent='end' alignContent='center'>
        <IconButton
          _focus={{ boxShadow: 'none' }}
          size='xs'
          variant='ghost'
          colorScheme='gray.700'
          aria-label='Link'
          icon={<ExternalLinkIcon />}
          onClick={() => window.open(props.url, '_blank').focus()}
        />
      </Flex>
      <VStack spacing={1} mx={2} align={'start'}>
        <Heading color={'gray.700'} fontSize={'sm'} fontFamily={'body'} pt={0}>
          {props.title}
        </Heading>
        <Text color={'gray.700'} fontSize={'xs'} noOfLines={2} lineHeight={'130%'}>
          {props.description}
        </Text>
        <Text color={'gray.500'} w='100%' fontSize={'xs'} align={'right'}>
          {props.siteName}
        </Text>
      </VStack>
    </Box>
  )
}
