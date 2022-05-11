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

type Query = {
    uid: string
}

export default function UserShow() {
    const [user, setUser] = useState<User>(null)
    const { user: currentUser } = useAuthentication()
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

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        const db = getFirestore()

        setIsSending(true)
        await addDoc(collection(db, 'questions'), {
            senderUid: currentUser.uid,
            receiverUid: user.uid,
            body,
            isReplied: false,
            createdAt: serverTimestamp(),
        })
        setIsSending(false)
        setBody('')
        toast.success('送信しました。', {
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
            {user && (
                <div className="text-center">
                    <h1 className="h4">{user.name}さんのページ</h1>

                    <div className="row justify-content-center mb-3">
                        <div className="col-12 col-md-6">
                            <form onSubmit={onSubmit}>
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
                                            送信する
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}