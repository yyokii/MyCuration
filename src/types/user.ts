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

  constructor(
    uid: string = '',
    isFinishedRegisterUserInfo: boolean = false,
    name: string = '',
    profileImageURL: string = '',
    articlesCount: number = 0,
  ) {
    this.uid = uid
    this.isFinishedRegisterUserInfo = isFinishedRegisterUserInfo
    this.name = name
    this.profileImageURL = profileImageURL
    this.articlesCount = articlesCount
  }
}

const userConverter = {
  toFirestore(user: WithFieldValue<User>): DocumentData {
    return {
      name: user.name,
      profileImageURL: user.profileImageURL,
      isFinishedRegisterUserInfo: user.isFinishedRegisterUserInfo,
      articlesCount: user.articlesCount,
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
    )
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
    return user
  },
}

export { User, userConverter, userConverterForAdmin }
