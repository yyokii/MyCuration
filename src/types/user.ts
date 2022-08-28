/**
 * User
 */
export class User {
  uid: string
  identifierToken: string
  isFinishedRegisterUserInfo: boolean // true: ユーザー情報登録が完了している, false: ユーザー情報登録がまだ完了していない
  name: string
  profileImageURL: string
  articlesCount: number
  categoriesCount: Map<string, number>

  constructor(
    uid: string = '',
    identifierToken: string = '',
    isFinishedRegisterUserInfo: boolean = false,
    name: string = '',
    profileImageURL: string = '',
    articlesCount: number = 0,
    categoriesCount: Map<string, number> = new Map(),
  ) {
    this.uid = uid
    this.identifierToken = identifierToken
    this.isFinishedRegisterUserInfo = isFinishedRegisterUserInfo
    this.name = name
    this.profileImageURL = profileImageURL
    this.articlesCount = articlesCount
    this.categoriesCount = categoriesCount
  }

  convertObjectToCategoriesCountMap(object: any) {
    const categoriesCountMap: Map<string, number> = new Map(Object.entries(object))
    this.categoriesCount = categoriesCountMap
  }
}
