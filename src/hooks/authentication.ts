import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { User } from '../models/User'
import { atom, useRecoilState } from 'recoil'
import { useEffect } from 'react'
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore'

// null: 未ログイン状態
const userState = atom<User>({
  key: 'user',
  default: null,
})

export function useAuthentication() {
  const [user, setUser] = useRecoilState(userState)

  // https://stackoverflow.com/questions/48846289/why-is-my-react-component-is-rendering-twice
  useEffect(() => {
    if (user !== null) {
      console.log('User is signed in')
      return
    }

    const auth = getAuth()

    onAuthStateChanged(auth, function (firebaseUser) {
      if (firebaseUser) {
        console.log('Set user')

        const loginUser: User = {
          uid: firebaseUser.uid,
          isAnonymous: firebaseUser.isAnonymous,
          name: '',
        }
        setUser(loginUser)
        createUserIfNotFound(loginUser)
      } else {
        console.log('User is signed out')
        setUser(null)
      }
    })
  }, [])

  return user
}

async function createUserIfNotFound(user: User) {
  const db = getFirestore()
  const usersCollection = collection(db, 'users')
  const userRef = doc(usersCollection, user.uid)
  const document = await getDoc(userRef)
  if (document.exists()) {
    return
  }

  await setDoc(userRef, {
    name: new Date().getTime(),
  })
}
