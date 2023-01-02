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
  .onCreate((_, context) => {
    const userId = context.params.userId
    const userRef = db.collection('users').doc(userId)
    return userRef.update({ articlesCount: admin.firestore.FieldValue.increment(1) })
  })

export const onDeleteUser = functions.auth.user().onDelete(async (user) => {
  await db.runTransaction(async (transaction) => {
    const userRef = db.collection(`users`).doc(user.uid)
    const userSnapShot = await transaction.get(userRef)
    const userData = userSnapShot.data()
    if (userData == null) {
      return
    }

    transaction.delete(db.collection(`userNames`).doc(userData.name))
    transaction.update(userRef, {
      isDeleted: true,
    })
  })
})
