import * as fs from 'fs'
import { v4 } from 'uuid'
import assert from 'assert'
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing'
import { setLogLevel } from 'firebase/firestore'

const projectID = v4()

let testEnv: RulesTestEnvironment

beforeAll(async () => {
  setLogLevel('error') //
  testEnv = await initializeTestEnvironment({
    projectId: projectID,
    hub: { host: 'localhost', port: 4400 }, // https://github.com/firebase/quickstart-testing/issues/225#issuecomment-1030921157
    firestore: {
      rules: fs.readFileSync('firestore.rules', 'utf8'),
    },
  })
})

beforeEach(async () => {
  await testEnv.clearFirestore()
})

afterAll(async () => {
  await testEnv.cleanup()
})

describe('demo test', () => {
  it('Understands basic addition', () => {
    assert.strictEqual(1 + 1, 2)
  })
})

// userNames collection

describe('userNames collection', () => {
  it('read: 未認証でもすべてのユーザーネームを読み取り可能', async () => {
    const uid = v4()
    const context = testEnv.unauthenticatedContext()
    const name = 'demo'
    // データの事前作成をルール無効のコンテキストを利用して実施
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`userNames/${name}`).set({
        uid: uid,
      })
    })

    await assertSucceeds(context.firestore().doc(`userNames/${name}`).get())
  })

  it('create: 認証済みの場合はドキュメントを作成可能', async () => {
    const uid = v4()
    const context = testEnv.authenticatedContext(uid)
    const name = 'demo'

    await assertSucceeds(
      context.firestore().doc(`userNames/${name}`).set({
        uid: uid,
      }),
    )
  })

  it('create: 未認証の場合はドキュメントを作成できない', async () => {
    const uid = v4()
    const context = testEnv.unauthenticatedContext()
    const name = 'demo'

    await assertFails(
      context.firestore().doc(`userNames/${name}`).set({
        uid: uid,
      }),
    )
  })

  it('update: 認証済みでも更新はできない', async () => {
    const uid = v4()
    const context = testEnv.authenticatedContext(uid)
    const name = 'demo'
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`userNames/${name}`).set({
        uid: uid,
      })
    })

    await assertFails(
      context.firestore().doc(`userNames/${name}`).set(
        {
          uid: 'updated uid',
        },
        { merge: true },
      ),
    )
  })

  it('delete: 認証済みでも削除はできない', async () => {
    const uid = v4()
    const context = testEnv.authenticatedContext(uid)
    const name = 'demo'
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`userNames/${name}`).set({
        uid: uid,
      })
    })

    await assertFails(context.firestore().doc(`userNames/${name}`).delete())
  })
})

// users collection

describe('users collection', () => {
  it('read: 未認証でも他の人のデータを読み取り可能', async () => {
    const uid = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`users/${uid}`).set({
        uid: 'user id',
        name: 'user name',
        profileImageURL: 'user profile image url',
        articlesCount: 10,
      })
    })
    const context = testEnv.unauthenticatedContext()

    await assertSucceeds(context.firestore().doc(`users/${uid}`).get())
  })

  it('create: 自分のドキュメントを作成可能', async () => {
    const uid = v4()
    const context = testEnv.authenticatedContext(uid)

    await assertSucceeds(
      context.firestore().doc(`users/${uid}`).set({
        uid: 'user id',
        name: 'user name',
        profileImageURL: 'user profile image url',
        articlesCount: 10,
      }),
    )
  })

  it('create: 未認証の場合、作成できない', async () => {
    const context = testEnv.unauthenticatedContext()

    await assertFails(
      context.firestore().doc(`users/${v4()}`).set({
        uid: 'user id',
        name: 'user name',
        profileImageURL: 'user profile image url',
        articlesCount: 10,
      }),
    )
  })

  it('create: 他の人のドキュメントは作成できない', async () => {
    const context = testEnv.authenticatedContext(v4())
    const uid = v4()

    await assertFails(
      context.firestore().doc(`users/${uid}`).set({
        uid: 'user id',
        name: 'user name',
        profileImageURL: 'user profile image url',
        articlesCount: 10,
      }),
    )
  })

  it('update: 自分のデータを編集できる', async () => {
    const uid = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`users/${uid}`).set({
        uid: 'user id',
        name: 'user name',
        profileImageURL: 'user profile image url',
        articlesCount: 10,
      })
    })
    const context = testEnv.authenticatedContext(uid)

    await assertSucceeds(
      context.firestore().doc(`users/${uid}`).set(
        {
          name: 'updated user name',
        },
        { merge: true },
      ),
    )
  })

  it('update: 他の人のデータは編集できない', async () => {
    const uid = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`users/${uid}`).set({
        uid: 'user id',
        name: 'user name',
        profileImageURL: 'user profile image url',
        articlesCount: 10,
      })
    })
    const context = testEnv.authenticatedContext(v4())

    await assertFails(
      context.firestore().doc(`users/${uid}`).set(
        {
          name: 'updated user name',
        },
        { merge: true },
      ),
    )
  })
})

// users/{uid}/articles sub collection

describe('users/{uid}/articles sub collection', () => {
  it('read: 未認証でも他の人のデータを読み取り可能', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .doc(`users/${uid}/articles/${contentID}`)
        .set({
          comment: 'comment',
          contentURL: 'content url',
          createdAt: 'created at',
          ogDescription: 'og description',
          ogSiteName: 'og site name',
          ogTitle: 'og title',
          tagIDs: ['tag id'],
          updatedAt: 'updated at',
        })
    })
    const context = testEnv.unauthenticatedContext()

    await assertSucceeds(context.firestore().doc(`users/${uid}/articles/${contentID}`).get())
  })

  it('create: 自分のドキュメントを作成可能', async () => {
    const uid = v4()
    const context = testEnv.authenticatedContext(uid)

    await assertSucceeds(
      context
        .firestore()
        .doc(`users/${uid}/articles/${v4()}`)
        .set({
          comment: 'comment',
          contentURL: 'content url',
          createdAt: 'created at',
          ogDescription: 'og description',
          ogSiteName: 'og site name',
          ogTitle: 'og title',
          tagIDs: ['tag id'],
          updatedAt: 'updated at',
        }),
    )
  })

  it('create: 未認証の場合、作成できない', async () => {
    const context = testEnv.unauthenticatedContext()
    const uid = v4()

    await assertFails(
      context
        .firestore()
        .doc(`users/${uid}/articles/${v4()}`)
        .set({
          comment: 'comment',
          contentURL: 'content url',
          createdAt: 'created at',
          ogDescription: 'og description',
          ogSiteName: 'og site name',
          ogTitle: 'og title',
          tagIDs: ['tag id'],
          updatedAt: 'updated at',
        }),
    )
  })

  it('create: 他の人のドキュメントは作成できない', async () => {
    const context = testEnv.authenticatedContext(v4())
    const uid = v4()

    await assertFails(
      context
        .firestore()
        .doc(`users/${uid}/articles/${v4()}`)
        .set({
          comment: 'comment',
          contentURL: 'content url',
          createdAt: 'created at',
          ogDescription: 'og description',
          ogSiteName: 'og site name',
          ogTitle: 'og title',
          tagIDs: ['tag id'],
          updatedAt: 'updated at',
        }),
    )
  })

  it('update: 自分のデータを編集できる', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .doc(`users/${uid}/articles/${contentID}`)
        .set({
          comment: 'comment',
          contentURL: 'content url',
          createdAt: 'created at',
          ogDescription: 'og description',
          ogSiteName: 'og site name',
          ogTitle: 'og title',
          tagIDs: ['tag id'],
          updatedAt: 'updated at',
        })
    })
    const context = testEnv.authenticatedContext(uid)

    await assertSucceeds(
      context.firestore().doc(`users/${uid}/articles/${contentID}`).set(
        {
          comment: 'updated comment',
        },
        { merge: true },
      ),
    )
  })

  it('update: 他の人のデータは編集できない', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .doc(`users/${uid}/articles/${v4()}`)
        .set({
          comment: 'comment',
          contentURL: 'content url',
          createdAt: 'created at',
          ogDescription: 'og description',
          ogSiteName: 'og site name',
          ogTitle: 'og title',
          tagIDs: ['tag id'],
          updatedAt: 'updated at',
        })
    })
    const context = testEnv.authenticatedContext(v4())

    await assertFails(
      context.firestore().doc(`users/${uid}/articles/${contentID}`).set(
        {
          comment: 'updated comment',
        },
        { merge: true },
      ),
    )
  })

  it('delete: 自分のドキュメントを削除可能', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .doc(`users/${uid}/articles/${v4()}`)
        .set({
          comment: 'comment',
          contentURL: 'content url',
          createdAt: 'created at',
          ogDescription: 'og description',
          ogSiteName: 'og site name',
          ogTitle: 'og title',
          tagIDs: ['tag id'],
          updatedAt: 'updated at',
        })
    })
    const context = testEnv.authenticatedContext(uid)

    await assertSucceeds(context.firestore().doc(`users/${uid}/articles/${contentID}`).delete())
  })

  it('delete: 他の人のドキュメントを削除できない', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context
        .firestore()
        .doc(`users/${uid}/articles/${v4()}`)
        .set({
          comment: 'comment',
          contentURL: 'content url',
          createdAt: 'created at',
          ogDescription: 'og description',
          ogSiteName: 'og site name',
          ogTitle: 'og title',
          tagIDs: ['tag id'],
          updatedAt: 'updated at',
        })
    })
    const context = testEnv.authenticatedContext(v4())

    await assertFails(context.firestore().doc(`users/${uid}/articles/${contentID}`).delete())
  })
})

// users/{uid}/tags sub collection

describe('users/{uid}/tags sub collection', () => {
  it('read: 未認証でも他の人のデータを読み取り可能', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`users/${uid}/tags/${contentID}`).set({
        createdAt: 'created at',
        name: 'tag name',
        updatedAt: 'updated at',
      })
    })
    const context = testEnv.unauthenticatedContext()

    await assertSucceeds(context.firestore().doc(`users/${uid}/tags/${contentID}`).get())
  })

  it('create: 自分のドキュメントを作成可能', async () => {
    const uid = v4()
    const context = testEnv.authenticatedContext(uid)

    await assertSucceeds(
      context.firestore().doc(`users/${uid}/tags/${v4()}`).set({
        createdAt: 'created at',
        name: 'tag name',
        updatedAt: 'updated at',
      }),
    )
  })

  it('create: 未認証の場合、作成できない', async () => {
    const context = testEnv.unauthenticatedContext()
    const uid = v4()

    await assertFails(
      context.firestore().doc(`users/${uid}/tags/${v4()}`).set({
        createdAt: 'created at',
        name: 'tag name',
        updatedAt: 'updated at',
      }),
    )
  })

  it('create: 他の人のドキュメントは作成できない', async () => {
    const context = testEnv.authenticatedContext(v4())
    const uid = v4()

    await assertFails(
      context.firestore().doc(`users/${uid}/tags/${v4()}`).set({
        createdAt: 'created at',
        name: 'tag name',
        updatedAt: 'updated at',
      }),
    )
  })

  it('update: 自分のデータを編集できる', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`users/${uid}/tags/${contentID}`).set({
        createdAt: 'created at',
        name: 'tag name',
        updatedAt: 'updated at',
      })
    })
    const context = testEnv.authenticatedContext(uid)

    await assertSucceeds(
      context.firestore().doc(`users/${uid}/tags/${contentID}`).set(
        {
          name: 'updated name',
        },
        { merge: true },
      ),
    )
  })

  it('update: 他の人のデータは編集できない', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`users/${uid}/tags/${v4()}`).set({
        createdAt: 'created at',
        name: 'tag name',
        updatedAt: 'updated at',
      })
    })
    const context = testEnv.authenticatedContext(v4())

    await assertFails(
      context.firestore().doc(`users/${uid}/tags/${contentID}`).set(
        {
          name: 'updated name',
        },
        { merge: true },
      ),
    )
  })

  it('delete: 自分のドキュメントを削除可能', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`users/${uid}/tags/${v4()}`).set({
        createdAt: 'created at',
        name: 'tag name',
        updatedAt: 'updated at',
      })
    })
    const context = testEnv.authenticatedContext(uid)

    await assertSucceeds(context.firestore().doc(`users/${uid}/tags/${contentID}`).delete())
  })

  it('delete: 他の人のドキュメントを削除できない', async () => {
    const uid = v4()
    const contentID = v4()
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc(`users/${uid}/tags/${v4()}`).set({
        createdAt: 'created at',
        name: 'tag name',
        updatedAt: 'updated at',
      })
    })
    const context = testEnv.authenticatedContext(v4())

    await assertFails(context.firestore().doc(`users/${uid}/tags/${contentID}`).delete())
  })
})
