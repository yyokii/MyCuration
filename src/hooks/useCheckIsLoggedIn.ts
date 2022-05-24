import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useCurrentUser } from './useCurrentUser'

export function useCheckIsLoggedIn() {
  const { currentUser, isAuthChecking } = useCurrentUser()
  const router = useRouter()

  useEffect(() => {
    if (isAuthChecking) return
    if (currentUser?.isFinishedRegisterUserInfo === false) {
      if (router.isReady) {
        router.push('/onboarding')
      }
    }
  }, [isAuthChecking, currentUser, router])
}
