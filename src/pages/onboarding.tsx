import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { collection, doc, getDoc, runTransaction } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import NormalButton from '../components/common/NormalButton'
import Layout from '../components/Layout'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { firestore } from '../lib/firebase'
import { auth } from '../lib/firebase_admin'
import { User } from '../types/user'
import nookies from 'nookies'
import { GetServerSideProps } from 'next'
import { fetchUser } from '../lib/db-admin'

type Props = {
  uid: string
}

// 登録済みのユーザーの場合はユーザーぺージへリダイレクトする
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = nookies.get(ctx)

  const token = await auth.verifyIdToken(cookies.token)
  const user = await fetchUser(token.uid)

  if (user.isFinishedRegisterUserInfo) {
    return {
      redirect: {
        permanent: false,
        destination: `/users/${user.name}`,
      },
    }
  } else {
    return {
      props: {
        uid: token.uid,
      },
    }
  }
}

export default function Onboarding() {
  const router = useRouter()
  const initialRef = useRef()
  const { currentUser } = useCurrentUser()
  const [userName, setUserName] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false)

  // Validation
  const isUserNameNotValid = userName.length >= 100
  const isInputError = isUserNameNotValid || isAlreadyRegistered

  async function onSubmitItem() {
    const userNamesCollection = collection(firestore, 'userNames')

    // ユーザーIDの重複チェック
    const userNameDocRef = doc(firestore, 'userNames', userName)
    const useNameSnapshot = await getDoc(userNameDocRef)
    if (useNameSnapshot.exists()) {
      setIsAlreadyRegistered(true)
      return
    }

    const userRef = doc(collection(firestore, 'users'), currentUser.uid)
    const userNamesRef = doc(userNamesCollection, userName)

    const user: User = new User(currentUser.uid, true, userName, currentUser.profileImageURL, 0)

    setIsSending(true)
    await runTransaction(firestore, async (transaction) => {
      // Set user data
      transaction.set(userRef, user)
      transaction.set(userNamesRef, {
        uid: currentUser.uid,
      })
    }).catch((error) => {
      console.log(error)
    })
    setIsSending(false)

    router.push('/')
  }

  function onChangeUserName(name: string) {
    setUserName(name)
    setIsAlreadyRegistered(false) // 重複表示がある場合にそれをリセット
  }

  return (
    <Layout>
      <Box>
        <VStack mx={4} my={16} spacing={8}>
          <Text fontSize='3xl'>User name</Text>
          <FormControl maxWidth={'400px'} isInvalid={isInputError}>
            <FormLabel htmlFor='url'>Plese input your user name.</FormLabel>
            <Input
              ref={initialRef}
              id='user name'
              placeholder='user name'
              value={userName}
              onChange={(e) => onChangeUserName(e.target.value)}
              required
            />
            {isUserNameNotValid && (
              <FormErrorMessage>User name is less than 100 characters.</FormErrorMessage>
            )}
            {isAlreadyRegistered && (
              <FormErrorMessage>This name is already registered.</FormErrorMessage>
            )}
          </FormControl>
          <NormalButton title='OK' isLoading={isSending} onClick={onSubmitItem}>
            OK
          </NormalButton>
        </VStack>
      </Box>
    </Layout>
  )
}
