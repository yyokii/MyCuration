import { collection, doc, getDoc, runTransaction } from 'firebase/firestore'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { firestore } from '../lib/firebase'

export default function Onboarding() {
  const router = useRouter()
  const { currentUser } = useCurrentUser()

  const [userName, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {}, [])

  async function onSubmitItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const db = firestore
    const userNamesCollection = collection(db, 'userNames')

    // ユーザーIDの重複チェック
    const userNameDocRef = doc(db, `userNames`, userName)
    const useNameSnapshot = await getDoc(userNameDocRef)
    if (useNameSnapshot.exists()) {
      console.log('名前が重複しています')
      return
    }

    const userRef = doc(collection(db, 'users'), currentUser.uid)
    const userNamesRef = doc(userNamesCollection, userName)

    setIsSending(true)
    await runTransaction(db, async (transaction) => {
      transaction.set(userRef, currentUser)
      transaction.set(userNamesRef, {
        uid: currentUser.uid,
      })
    }).catch((error) => {
      console.log(error)
    })
    setIsSending(false)

    router.push('/')
  }

  return (
    <Layout>
      <div className='text-center'>
        <div className='row justify-content-center'>
          <div className='row col-12 col-md-6'>
            <h1>ユーザー情報入力画面</h1>

            <form onSubmit={onSubmitItem}>
              <textarea
                className='form-control'
                placeholder='ユーザーID'
                rows={6}
                value={userName}
                onChange={(e) => setBody(e.target.value)}
                required
              ></textarea>
              <div className='m-3'>
                {isSending ? (
                  <div className='spinner-border text-secondary' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                ) : (
                  <button type='submit' className='btn btn-primary'>
                    設定する
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
