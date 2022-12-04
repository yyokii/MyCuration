import { Container, Heading, Stack, Text, Button, Box } from '@chakra-ui/react'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'

export default function Hero() {
  const router = useRouter()

  return (
    <Container maxW={'5xl'}>
      <Stack
        textAlign={'center'}
        align={'center'}
        spacing={{ base: 4, md: 8 }}
        py={{ base: 4, md: 8 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: '3xl', sm: '4xl', md: '6xl' }}
          lineHeight={'110%'}
        >
          Create{' '}
          <Text as={'span'} color={'orange.400'}>
            My Curation
          </Text>
        </Heading>
        <Text color={'gray.500'} maxW={'3xl'}>
          This is a service that allows you to save articles you read with comments and create your
          own curation page.
        </Text>
        <Stack spacing={6} direction={'row'}>
          <Box h='40px'>
            <Button
              rounded={'full'}
              px={6}
              colorScheme={'orange'}
              bg={'orange.400'}
              _hover={{ bg: 'orange.500' }}
              onClick={() => {
                router.push('/signup')
              }}
            >
              Get started
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Container>
  )
}
