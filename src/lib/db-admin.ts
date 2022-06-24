import { Item } from 'chakra-ui-autocomplete'
import { User } from '../types/User'
import { Tag } from '../types/Tag'
import * as admin from 'firebase-admin'
import { firestore } from './firebase_admin'
import { Article } from '../types/Article'

export async function createArticle(
  uid: string,
  contentURL: string,
  comment: string,
  selectedTags: Item[],
) {
  const articleRef = firestore.collection(`users`).doc(uid).collection('articles').doc()
  const articleTags = selectedTags.map((item) => item.value)
  const article = {
    comment: comment,
    contentURL: contentURL,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    tags: articleTags,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  try {
    await firestore.runTransaction(async (transaction) => {
      // ユーザー情報を取得
      const userRef = firestore.collection(`users`).doc(uid)
      const userSnapShot = await transaction.get(userRef)
      const user = userSnapShot.data() as User

      // 設定するタグの情報を取得
      var tags: Tag[] = []
      await Promise.all(
        articleTags.map(async (tagID) => {
          const tagRef = firestore.collection(`tags`).doc(tagID)
          const tagSnapShot = await transaction.get(tagRef)
          const tag = tagSnapShot.data() as Tag
          tag.id = tagSnapShot.id
          tags.push(tag)
        }),
      )

      // ユーザーの投稿数、タグの利用回数、記事、の書き込み処理を行う

      await Promise.all(
        tags.map(async (tag) => {
          const tagRef = firestore.collection(`tags`).doc(tag.id)
          transaction.update(tagRef, {
            count: tag.count + 1,
          })
        }),
      )

      transaction.update(userRef, {
        articlesCount: user.articlesCount + 1,
      })

      transaction.set(articleRef, article)
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
      const userRef = firestore.collection(`users`).doc(uid)
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

      // 設定されているタグの情報を取得
      var tags: Tag[] = []
      await Promise.all(
        article.tags.map(async (tagID) => {
          const tagRef = firestore.collection(`tags`).doc(tagID)
          const tagSnapShot = await transaction.get(tagRef)
          const tag = tagSnapShot.data() as Tag
          tag.id = tagSnapShot.id
          tags.push(tag)
        }),
      )

      // ユーザーの投稿数、タグの利用回数、記事、の書き込み処理を行う

      transaction.delete(
        firestore.collection(`users`).doc(uid).collection(`articles`).doc(article.id),
      )

      transaction.update(userRef, {
        articlesCount: user.articlesCount - 1,
      })

      await Promise.all(
        tags.map(async (tag) => {
          const tagRef = firestore.collection(`tags`).doc(tag.id)
          transaction.update(tagRef, {
            count: tag.count - 1,
          })
        }),
      )
    })
  } catch (error) {
    console.log(error)
    return error
  }
}
