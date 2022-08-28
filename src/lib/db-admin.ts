import { User, userConverterForAdmin } from '../types/user'
import * as admin from 'firebase-admin'
import { firestore } from './firebase_admin'
import { Article } from '../types/article'
import { Category } from '../types/category'

export async function createArticle(
  uid: string,
  contentURL: string,
  comment: string,
  categoryID: string,
) {
  const articleRef = firestore.collection(`users`).doc(uid).collection('articles').doc()
  const article = {
    comment: comment,
    contentURL: contentURL,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    category: categoryID,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  try {
    await firestore.runTransaction(async (transaction) => {
      // ユーザー情報を取得
      const userRef = firestore.collection(`users`).withConverter(userConverterForAdmin).doc(uid)
      const userSnapShot = await transaction.get(userRef)

      const user = userSnapShot.data() as User

      // 設定するカテゴリの情報を取得
      // TODO: リファクタ、deleteでも同じことしている
      const categoryRef = firestore.collection(`categories`).doc(categoryID)
      const categorySnapShot = await transaction.get(categoryRef)
      const category = categorySnapShot.data() as Category
      category.id = categorySnapShot.id

      // ユーザーの投稿数、タグの利用回数、記事、の書き込み処理を行う
      transaction.set(articleRef, article)

      transaction.update(categoryRef, {
        count: category.count + 1,
      })

      const currentSelectedCategoryCount = user.categoriesCount.get(categoryID) ?? 0
      user.categoriesCount.set(categoryID, currentSelectedCategoryCount + 1)
      const categoriesCountObj = Object.fromEntries(user.categoriesCount)
      transaction.update(userRef, {
        articlesCount: user.articlesCount + 1,
        categoriesCount: categoriesCountObj,
      })
    })

    return article
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function deleteArticle(uid: string, articleID: string) {
  try {
    await firestore.runTransaction(async (transaction) => {
      const userRef = firestore.collection(`users`).withConverter(userConverterForAdmin).doc(uid)
      const userSnapShot = await transaction.get(userRef)
      const user = userSnapShot.data() as User

      const articleRef = firestore
        .collection(`users`)
        .doc(uid)
        .collection('articles')
        .doc(articleID)
      const articleSnapShot = await transaction.get(articleRef)
      const article = articleSnapShot.data() as Article
      article.id = articleSnapShot.id

      // 設定されているカテゴリの情報を取得
      const categoryRef = firestore.collection(`categories`).doc(article.category)
      const categorySnapShot = await transaction.get(categoryRef)
      const category = categorySnapShot.data() as Category
      category.id = categorySnapShot.id

      // ユーザーの投稿数、タグの利用回数、記事、の書き込み処理を行う

      transaction.delete(
        firestore.collection(`users`).doc(uid).collection(`articles`).doc(article.id),
      )

      transaction.update(categoryRef, {
        count: category.count - 1,
      })

      const currentSelectedCategoryCount = user.categoriesCount.get(article.category)
      user.categoriesCount.set(article.category, currentSelectedCategoryCount - 1)
      const categoriesCountObj = Object.fromEntries(user.categoriesCount)
      transaction.update(userRef, {
        articlesCount: user.articlesCount - 1,
        categoriesCount: categoriesCountObj,
      })
    })
  } catch (error) {
    console.log(error)
    return error
  }
}
