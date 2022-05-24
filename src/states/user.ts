import { atom } from 'recoil'
import { User } from '../types/User'

/**
 * Userがnull: 未ログインユーザー
 * UserのisFinishedRegisterUserInfoの値がfalse: ユーザー情報登録がまだ完了していない
 * UserのisFinishedRegisterUserInfoの値がtrue: ユーザー情報登録が完了している
 */
export const userState = atom<User>({
  key: 'user',
  default: null,
})
