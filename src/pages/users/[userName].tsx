import { useRouter } from 'next/router'
import { User } from '../../types/User'
import { FormEvent, useEffect, useRef, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  deleteDoc,
} from 'firebase/firestore'
import Layout from '../../components/Layout'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { toast } from 'react-toastify'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Article } from '../../types/Article'
import { firestore } from '../../lib/firebase'
import { UserID } from '../../types/UserID'
import Image from 'next/image'

type Query = {
  userName: string
}

export default function UserShow() {
  const { currentUser } = useCurrentUser()

  // State

  // 本画面で表示する対象ユーザー
  // null: ログインしているユーザー自身の場合nullとなる
  const [user, setUser] = useState<User>(null)
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [isPaginationFinished, setIsPaginationFinished] = useState(false)

  const scrollContainerRef = useRef(null)
  const router = useRouter()
  const queryPath = router.query as Query

  // Effect

  // ユーザー情報と記事の取得を行う
  useEffect(() => {
    if (currentUser === null) {
      return
    }

    if (queryPath.userName === undefined) {
      return
    }

    if (queryPath.userName === currentUser.name) {
      // 自分のページ
      setUser(null)
      loadArticles(currentUser.uid)
    } else {
      // 他のユーザー
      ;(async () => {
        const user = await loadUser()
        loadArticles(user.uid)
      })()
    }

    async function loadUser() {
      // ユーザー名からuidを取得
      const userNameRef = doc(collection(firestore, 'userNames'), queryPath.userName)
      const userNameDoc = await getDoc(userNameRef)

      if (!userNameDoc.exists()) {
        return
      }

      const userID = (userNameDoc.data() as UserID).uid

      // uidからユーザー情報を取得
      const userDocRef = doc(collection(firestore, 'users'), userID)
      const userDoc = await getDoc(userDocRef)

      if (!userDoc.exists()) {
        return
      }

      const user = userDoc.data() as User
      user.uid = userDoc.id

      setUser(user)
      return user
    }
  }, [currentUser, queryPath.userName])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [articles, scrollContainerRef.current, isPaginationFinished])

  async function loadArticles(uid: string, isReload: boolean = false) {
    const snapshot = await getDocs(createArticlesBaseQuery(uid))

    if (snapshot.empty) {
      setIsPaginationFinished(true)
      return
    }

    appendArticles(snapshot, isReload)
  }

  async function loadNextArticles(uid: string) {
    if (articles.length === 0) {
      return
    }

    const lastQuestion = articles[articles.length - 1]
    const snapshot = await getDocs(
      query(createArticlesBaseQuery(uid), startAfter(lastQuestion.createdAt)),
    )

    if (snapshot.empty) {
      return
    }

    appendArticles(snapshot)
  }

  function appendArticles(snapshot: QuerySnapshot<DocumentData>, isReload: boolean = false) {
    const fetchedArticles = snapshot.docs.map((doc) => {
      const article = doc.data() as Article
      article.id = doc.id
      return article
    })

    if (isReload) {
      setArticles(fetchedArticles)
    } else {
      setArticles(articles.concat(fetchedArticles))
    }
  }

  function createArticlesBaseQuery(uid: string) {
    return query(
      collection(firestore, `users/${uid}/articles`),
      orderBy('createdAt', 'desc'),
      limit(20),
    )
  }

  // Actions

  async function onSubmitItem(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const db = getFirestore()

    setIsSending(true)
    await addDoc(collection(db, `users/${currentUser.uid}/articles`), {
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

    loadArticles(currentUser.uid, true)
  }

  function onScroll() {
    if (isPaginationFinished) {
      return
    }

    const container = scrollContainerRef.current
    if (container === null) {
      return
    }

    const rect = container.getBoundingClientRect()
    if (rect.top + rect.height > window.innerHeight) {
      return
    }

    let targetuid: string
    if (user === null) {
      targetuid = currentUser.uid
    } else {
      targetuid = user.uid
    }

    loadNextArticles(targetuid)
  }

  async function deleteArticle(article: Article) {
    if (user !== null) {
      // 他のユーザー情報を保持している場合
      return
    }

    const db = getFirestore()
    await deleteDoc(doc(db, `users/${currentUser.uid}/articles`, article.id))

    loadArticles(currentUser.uid, true)
  }

  return (
    <Layout>
      {currentUser && (
        <div className='text-center'>
          <div className='row justify-content-center mb-3'>
            <div className='col-12 col-md-6'>
              <div>
                {user === null ? (
                  /**
                   * 自分のページ
                   *
                   * 投稿内容閲覧、追加、編集、削除が可能であるページ
                   */
                  <div>
                    <section className='text-center'>
                      <Image
                        src={currentUser.profileImageURL}
                        width={100}
                        height={100}
                        alt='display name'
                      />
                      <h1 className='h4'>{currentUser.name}のページ</h1>
                    </section>
                    <form onSubmit={onSubmitItem}>
                      <textarea
                        className='form-control'
                        placeholder='アイテム'
                        rows={6}
                        value={body}
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
                            追加する
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                ) : (
                  /**
                   * 他のアカウントのページ
                   *
                   * 投稿内容閲覧が可能であるページ
                   */
                  <div>（仮）他の人のページです</div>
                )}
              </div>
              <div className='col-12' ref={scrollContainerRef}>
                {articles.map((article) => (
                  // FIXME: questionへのリンクではなくなる
                  <div key={article.id}>
                    <div className='card my-3' key={article.id}>
                      <div className='m-1 text-end' onClick={(e) => deleteArticle(article)}>
                        <i className='material-icons'>delete</i>
                      </div>
                      <Link href={`/questions/${article.id}`}>
                        <a>
                          <div className='card-body'>
                            <div className='text-truncate'>{article.contentURL}</div>
                          </div>
                          <div className='text-muted text-end'>
                            <small>
                              {dayjs(article.createdAt.toDate()).format('YYYY/MM/DD HH:mm')}
                            </small>
                          </div>
                        </a>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
