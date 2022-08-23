import { atom } from 'recoil'
import { User } from '../types/user'

/**
 * Userがnull: 未ログインユーザー
 */
export const userState = atom<User>({
  key: 'user',
  default: null,
})
