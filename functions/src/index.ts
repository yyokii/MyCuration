import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp()
const db = admin.firestore()

export const onDeleteArticle = functions.firestore
  .document('users/{userId}/articles/{articleId}')
  .onDelete((_, context) => {
    const userId = context.params.userId
    const userRef = db.collection('users').doc(userId)
    return userRef.update({ articlesCount: admin.firestore.FieldValue.increment(-1) })
  })

export const onCreateArticle = functions.firestore
  .document('users/{userId}/articles/{articleId}')
  .onDelete((_, context) => {
    const userId = context.params.userId
    const userRef = db.collection('users').doc(userId)
    return userRef.update({ articlesCount: admin.firestore.FieldValue.increment(1) })
  })
