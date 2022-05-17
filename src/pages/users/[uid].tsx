import { useRouter } from 'next/router'
import { User } from '../../../models/User'
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
import Layout from '../../../components/Layout'
import { useAuthentication } from '../../hooks/authentication'
import { toast } from 'react-toastify'
import Link from 'next/link'
import dayjs from 'dayjs'
import { Article } from '../../../models/Article'

type Query = {
  uid: string
}

export default function UserShow() {
  const currentUser = useAuthentication()

  // State
  const [user, setUser] = useState<User>(null)
  const [body, setBody] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [isPaginationFinished, setIsPaginationFinished] = useState(false)

  const scrollContainerRef = useRef(null)
  const router = useRouter()
  const queryPath = router.query as Query

  // Effect

  useEffect(() => {
    if (queryPath.uid === undefined) {
      return
    }

    loadUser()
    loadArticles()

    async function loadUser() {
      const db = getFirestore()
      const ref = doc(collection(db, 'users'), queryPath.uid)
      const userDoc = await getDoc(ref)

      if (!userDoc.exists()) {
        return
      }

      const gotUser = userDoc.data() as User
      gotUser.uid = userDoc.id
      setUser(gotUser)
    }
  }, [queryPath.uid])

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [articles, scrollContainerRef.current, isPaginationFinished])

  async function loadArticles(isReload: boolean = false) {
    const snapshot = await getDocs(createArticlesBaseQuery())

    if (snapshot.empty) {
      setIsPaginationFinished(true)
      return
    }

    appendArticles(snapshot, isReload)
  }

  async function loadNextArticles() {
    if (articles.length === 0) {
      return
    }

    const lastQuestion = articles[articles.length - 1]
    const snapshot = await getDocs(
      query(createArticlesBaseQuery(), startAfter(lastQuestion.createdAt)),
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

  function createArticlesBaseQuery() {
    const db = getFirestore()
    return query(
      collection(db, `users/${queryPath.uid}/articles`),
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

    loadArticles(true)
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

    loadNextArticles()
  }

  async function deleteArticle(article: Article) {
    const db = getFirestore()
    await deleteDoc(doc(db, `users/${currentUser.uid}/articles`, article.id))

    loadArticles(true)
  }

  return (
    <Layout>
      {user && currentUser && (
        <div className='text-center'>
          <h1 className='h4'>{user.name}さんのページ</h1>
          <div className='row justify-content-center mb-3'>
            <div className='col-12 col-md-6'>
              <div>
                {user.uid === currentUser.uid ? (
                  /**
                   * 自分のページ
                   *
                   * 投稿内容閲覧、追加、編集、削除が可能であるページ
                   */
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
