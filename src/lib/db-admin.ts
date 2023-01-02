import { firestore } from './firebase_admin'
import dayjs from 'dayjs'

export async function createArticle(
  uid: string,
  contentURL: string,
  title: string,
  comment: string,
  categoryID: string,
): Promise<Object> {
  const currentDate = dayjs().toISOString()
  const article = {
    comment: comment,
    contentURL: contentURL,
    title: title,
    createdAt: currentDate,
    category: categoryID,
    updatedAt: currentDate,
  }

  return await firestore.collection(`users`).doc(uid).collection('articles').add(article)
}
