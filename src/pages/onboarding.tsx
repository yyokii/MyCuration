import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react'
import { collection, doc, getDoc, runTransaction } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import NormalButton from '../components/common/NormalButton'
import Layout from '../components/Layout'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { firestore } from '../lib/firebase'
import { userState } from '../states/user'
import { User } from '../types/user'

export default function Onboarding() {
  const router = useRouter()
  const initialRef = useRef()
  const { currentUser } = useCurrentUser()
  const setUser = useSetRecoilState(userState) // TODO: 使ってない
  const [userName, setUserName] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false)

  // Validation
  const isUserNameNotValid = userName.length >= 100
  const isInputError = isUserNameNotValid || isAlreadyRegistered

  useEffect(() => {
    if (currentUser && currentUser.isFinishedRegisterUserInfo) {
      console.log('📝 ✅ currentuser: ', currentUser)
      router.push(`/users/${currentUser.name}`)
    }
    console.log('📝 currentuser: ', currentUser)
  }, [currentUser])

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
      transaction.set(userRef, {
        name: userName,
        profileImageURL: currentUser.profileImageURL,
        articlesCount: 0,
        uid: currentUser.uid,
      })
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
    setIsAlreadyRegistered(false) // TODO: ここでfalse入れる必要あるの？
  }

  return (
    <Layout>
      {currentUser == null ? (
        <div>loading</div>
      ) : (
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
            <NormalButton title='OK' isLoading={isSending} onClick={onSubmitItem} />
          </VStack>
        </Box>
      )}
    </Layout>
  )
}
