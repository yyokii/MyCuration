/**
 * User
 *
 * isFinishedRegisterUserInfo == false: ユーザー情報登録がまだ完了していない
 * isFinishedRegisterUserInfo == true: ユーザー情報登録が完了している
 */
export interface User {
  uid: string
  identifierToken: string
  isFinishedRegisterUserInfo: boolean
  name: string
  profileImageURL: string
  articlesCount: number
  categoriesCount: Map<string, number>
}
