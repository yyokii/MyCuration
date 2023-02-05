import { firestore } from './firebase_admin'
import dayjs from 'dayjs'
import { User, userConverterForAdmin } from '../types/user'

export async function fetchUser(uid: string): Promise<User> {
  const userDocRef = firestore.collection('users').doc(uid).withConverter(userConverterForAdmin)
  const userDoc = await userDocRef.get()

  if (!userDoc.exists) {
    return
  }

  const user = userDoc.data() as User
  return user
}

export async function createArticle(
  uid: string,
  contentURL: string,
  comment: string,
  tagIDs: string[],
  ogTitle: string,
  ogDescription: string,
  ogSiteName: string,
): Promise<Object> {
  const currentDate = dayjs().toISOString()
  const article = {
    comment: comment,
    contentURL: contentURL,
    createdAt: currentDate,
    tagIDs: tagIDs,
    ogTitle: ogTitle,
    ogDescription: ogDescription,
    ogSiteName: ogSiteName,
    updatedAt: currentDate,
  }

  return await firestore.collection(`users`).doc(uid).collection('articles').add(article)
}
