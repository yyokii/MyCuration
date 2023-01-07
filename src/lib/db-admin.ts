import { firestore } from './firebase_admin'
import dayjs from 'dayjs'

export async function createArticle(
  uid: string,
  contentURL: string,
  comment: string,
  categoryID: string,
  ogTitle: string,
  ogDescription: string,
  ogSiteName: string,
): Promise<Object> {
  const currentDate = dayjs().toISOString()
  const article = {
    comment: comment,
    contentURL: contentURL,
    createdAt: currentDate,
    category: categoryID,
    ogTitle: ogTitle,
    ogDescription: ogDescription,
    ogSiteName: ogSiteName,
    updatedAt: currentDate,
  }

  return await firestore.collection(`users`).doc(uid).collection('articles').add(article)
}
