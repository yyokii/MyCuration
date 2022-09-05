import { useRecoilValue } from 'recoil'
import { userState } from '../states/user'

/**
 * ログイン中のユーザー情報を取得する
 */
export function useCurrentUser() {
  const currentUser = useRecoilValue(userState)
  const isNotSignedIn = currentUser == null

  return {
    currentUser,
    isNotSignedIn,
  }
}
