import { useRouter } from 'next/router'
import { User } from '../../models/User'
import { FormEvent, useEffect, useState } from 'react'
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getFirestore,
    serverTimestamp,
} from 'firebase/firestore'
import Layout from '../../components/Layout'
import { useAuthentication } from '../../hooks/authentication'
import { toast } from 'react-toastify';
import Link from 'next/link'

type Query = {
    uid: string
}

export default function UserShow() {
    const currentUser = useAuthentication()

    // State
    const [user, setUser] = useState<User>(null)
    const [body, setBody] = useState('')
    const [isSending, setIsSending] = useState(false)

    const router = useRouter()
    const query = router.query as Query

    useEffect(() => {
        if (query.uid === undefined) {
            return
        }

        loadUser()

        async function loadUser() {
            const db = getFirestore()
            const ref = doc(collection(db, 'users'), query.uid)
            const userDoc = await getDoc(ref)

            if (!userDoc.exists()) {
                return
            }

            const gotUser = userDoc.data() as User
            gotUser.uid = userDoc.id
            setUser(gotUser)
        }
    }, [query.uid])

    async function onSubmitItem(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const db = getFirestore()

        setIsSending(true)
        await addDoc(collection(db, `users/${currentUser.uid}/items`) , {
            category: '',
            comment: '',
            contentURL: body,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        })
        setIsSending(false)
        setBody('')
        toast.success('追加しました。', {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        })
    }

    return (
        <Layout>
            {user && currentUser && (
                <div className="text-center">
                    <h1 className="h4">{user.name}さんのページ</h1>
                    <div className="row justify-content-center mb-3">
                        <div className="col-12 col-md-6">
                            <div>
                                {user.uid === currentUser.uid ? (
                                    /**
                                     * 自分のページ
                                     * 
                                     * 投稿内容閲覧、追加、編集、削除が可能であるページ
                                     */
                                    <form onSubmit={onSubmitItem}>
                                        <textarea
                                            className="form-control"
                                            placeholder="アイテム"
                                            rows={6}
                                            value={body}
                                            onChange={(e) => setBody(e.target.value)}
                                            required
                                        ></textarea>
                                        <div className="m-3">
                                            {isSending ? (
                                                <div className="spinner-border text-secondary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : (
                                                <button type="submit" className="btn btn-primary">
                                                    追加する
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                ) : (
                                    /**
                                     * 他のアカウントのページ
                                     * 
                                     * 投稿内容閲覧が可能であるページ
                                     */
                                    <div>（仮）他の人のページです</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}
