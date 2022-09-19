import { DocumentData, QueryDocumentSnapshot, WithFieldValue } from '@firebase/firestore'

/**
 * User
 */
class User {
  uid: string
  isFinishedRegisterUserInfo: boolean // true: ユーザー情報登録が完了している, false: ユーザー情報登録がまだ完了していない
  name: string
  profileImageURL: string
  articlesCount: number
  categoriesCount: Map<string, number>

  constructor(
    uid: string = '',
    isFinishedRegisterUserInfo: boolean = false,
    name: string = '',
    profileImageURL: string = '',
    articlesCount: number = 0,
    categoriesCount: Map<string, number> = new Map(),
  ) {
    this.uid = uid
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

const userConverter = {
  toFirestore(user: WithFieldValue<User>): DocumentData {
    return {
      name: user.name,
      profileImageURL: user.profileImageURL,
      isFinishedRegisterUserInfo: user.isFinishedRegisterUserInfo,
      articlesCount: user.articlesCount,
      categoriesCount: user.categoriesCount,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): User {
    const data = snapshot.data()
    const user = new User(
      snapshot.id,
      data.isFinishedRegisterUserInfo,
      data.name,
      data.profileImageURL,
      data.articlesCount,
      data.categoriesCount,
    )
    user.convertObjectToCategoriesCountMap(data.categoriesCount)
    return user
  },
}

const userConverterForAdmin = {
  toFirestore(user: User): FirebaseFirestore.DocumentData {
    const categoriesCountObj = Object.fromEntries(user.categoriesCount)
    return {
      name: user.name,
      profileImageURL: user.profileImageURL,
      isFinishedRegisterUserInfo: user.isFinishedRegisterUserInfo,
      articlesCount: user.articlesCount,
      categoriesCount: categoriesCountObj,
    }
  },
  fromFirestore(snapshot: FirebaseFirestore.QueryDocumentSnapshot): User {
    const data = snapshot.data()
    const user = new User(
      snapshot.id,
      data.isFinishedRegisterUserInfo,
      data.name,
      data.profileImageURL,
      data.articlesCount,
      data.categoriesCount,
    )
    user.convertObjectToCategoriesCountMap(data.categoriesCount)
    return user
  },
}

export { User, userConverter, userConverterForAdmin }
