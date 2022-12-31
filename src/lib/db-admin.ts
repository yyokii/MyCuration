import { User, userConverterForAdmin } from '../types/user'
import { firestore, auth } from './firebase_admin'
import dayjs from 'dayjs'
import { DBError } from '../types/baseError'

export async function createArticle(
  uid: string,
  contentURL: string,
  title: string,
  comment: string,
  categoryID: string,
): Promise<Object> {
  const articleRef = firestore.collection(`users`).doc(uid).collection('articles').doc()
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

//TODO: functionsに移行していいはず
/**
 * Delete user data
 *
 * Delete user from firebase authentification, userNames collection, and update users collection.
 *
 * @param uid: User ID
 * @returns
 */
export async function deleteCurrentUser(uid: string): Promise<void> {
  try {
    await auth.deleteUser(uid)

    await firestore.runTransaction(async (transaction) => {
      const userRef = firestore.collection(`users`).withConverter(userConverterForAdmin).doc(uid)
      const userSnapShot = await transaction.get(userRef)
      const user = userSnapShot.data() as User

      transaction.delete(firestore.collection(`userNames`).doc(user.name))

      transaction.update(userRef, {
        isDeleted: true,
      })
    })
  } catch (error) {
    throw new DBError(error)
  }
}
