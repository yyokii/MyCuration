import { getAuth, onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { User } from '../models/User'
import { atom, useRecoilState } from 'recoil'
import { useEffect } from 'react'

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

        console.log('Start useEffect')

        signInAnonymously(auth).catch(function (error) {
            // Handle Errors here.
            console.error(error)
            // ...
        })

        onAuthStateChanged(auth, function (firebaseUser) {
            if (firebaseUser) {
                console.log('Set user')

                setUser({
                    uid: firebaseUser.uid,
                    isAnonymous: firebaseUser.isAnonymous,
                })
            } else {
                // User is signed out.
                setUser(null)
            }
        })
    }, [])

    return { user }
}