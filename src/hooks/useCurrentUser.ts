import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'
import { userState } from '../states/user'

/**
 * ログイン中のユーザー情報を取得する
 */
export function useCurrentUser() {
  const currentUser = useRecoilValue(userState)
  const isAuthChecking = currentUser === undefined
  const router = useRouter()

  useEffect(() => {
    if (currentUser?.isFinishedRegisterUserInfo === false) {
      if (router.isReady) {
        console.log(currentUser)
      }
    }
  }, [currentUser, router])

  return {
    currentUser,
    isAuthChecking,
  }
}
