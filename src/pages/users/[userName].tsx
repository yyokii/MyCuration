import { useRouter } from 'next/router'
import { User } from '../../types/user'
import { Category } from '../../types/category'
import { useEffect, useRef, useState } from 'react'
import {
  collection,
  doc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  updateDoc,
} from 'firebase/firestore'
import Layout from '../../components/Layout'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { toast } from 'react-toastify'
import { Article } from '../../types/article'
import { firestore } from '../../lib/firebase'
import { fetchUserWithName } from '../../lib/db'
import Item from '../../components/Article/Item'
import {
  Box,
  Button,
  Image,
  SimpleGrid,
  StackDivider,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { UpdateArticleModal } from '../../components/Modal/UpdateArticleModal'
import { AddArticleModal } from '../../components/Modal/AddArticleModal'
import { SimpleModal } from '../../components/Modal/SimpleModal'
import { useSetRecoilState } from 'recoil'
import { userState } from '../../states/user'
import { fetchUser } from '../../lib/firebase-auth'
import axios from 'axios'
import CategoriesRatioList, { CategoriesRatio } from '../../components/CategoriesRatio'

type Query = {
  userName: string
}

export default function UserShow() {
  const { currentUser } = useCurrentUser()
  const setSigninUser = useSetRecoilState(userState)

  const scrollContainerRef = useRef(null)
  const router = useRouter()
  const queryPath = router.query as Query
  const isCurrentUser = currentUser?.name === queryPath.userName

  // モーダルの表示管理
  const {
    isOpen: isOpenUpdateArticleModal,
    onOpen: onOpenUpdateArticleModal,
    onClose: onCloseUpdateArticleModal,
  } = useDisclosure()
  const {
    isOpen: isOpenAddArticleModal,
    onOpen: onOpenAddArticleModal,
    onClose: onCloseAddArticleModal,
  } = useDisclosure()
  const {
    isOpen: isOpenConfirmDeleteModal,
    onOpen: onOpenConfirmDeleteModal,
    onClose: onCloseConfirmDeleteModal,
  } = useDisclosure()

  // State

  const [user, setUser] = useState<User>(null) // 本画面で表示する対象ユーザー

  const [isSending, setIsSending] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesRatio, setCategoriesRatio] = useState<CategoriesRatio[]>([])

  const [isPaginationFinished, setIsPaginationFinished] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article>(null)

  // Effect

  /**
   * ログイン中のユーザー、URLのパスがが変割った際にユーザー情報と記事の取得を行う
   * */
  useEffect(() => {
    if (currentUser === null) {
      return
    }

    if (queryPath.userName === undefined) {
      return
    }

    ;(async () => {
      const categories = await loadCategories()
      let displayUser = null
      if (queryPath.userName === currentUser.name) {
        // 自分のページ
        displayUser = currentUser
      } else {
        // 他のユーザー
        const user = await fetchUserWithName(queryPath.userName)
        if (user === undefined || user === null) {
          // TODO: 対象ユーザーが存在しない場合のページ表示
          console.log('ユーザーが存在しません')
        } else {
          displayUser = user
        }
      }
      setUser(displayUser)
      loadArticles(displayUser.uid, categories, true)
    })()
  }, [currentUser, queryPath.userName])

  useEffect(() => {
    setCategoriesRatio(calcCategoriesRatio(user?.categoriesCount, articles.length))
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [articles, scrollContainerRef.current, isPaginationFinished])

  async function loadArticles(uid: string, categories: Category[], isReload: boolean = false) {
    const snapshot = await getDocs(createArticlesBaseQuery(uid))

    if (snapshot.empty) {
      setIsPaginationFinished(true)
      return
    }

    appendArticles(snapshot, categories, isReload)
  }

  async function loadNextArticles(uid: string) {
    if (articles.length === 0) {
      return
    }

    const lastArticle = articles[articles.length - 1]
    const snapshot = await getDocs(
      query(createArticlesBaseQuery(uid), startAfter(lastArticle.createdAt)),
    )

    if (snapshot.empty) {
      return
    }

    appendArticles(snapshot, categories)
  }

  function appendArticles(
    snapshot: QuerySnapshot<DocumentData>,
    categories: Category[],
    isReload: boolean = false,
  ) {
    const fetchedArticles = snapshot.docs.map((doc) => {
      const article = doc.data() as Article
      article.id = doc.id

      // Categoryの設定
      if (article.category !== undefined && article.category !== null) {
        const displayName = categories.find((category) => category.id === article.category).name
        article.displayCategory = displayName
      } else {
        article.displayCategory = ''
      }

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

  async function loadCategories(): Promise<Category[]> {
    const snapshot = await getDocs(query(collection(firestore, `categories`), orderBy('name')))

    const fetchedCategories = snapshot.docs.map((doc) => {
      const category = doc.data() as Category
      category.id = doc.id
      return category
    })
    setCategories(fetchedCategories)

    return fetchedCategories
  }

  function calcCategoriesRatio(
    categoriesCount: Map<string, number>,
    articlesCount: number,
  ): CategoriesRatio[] {
    if (categoriesCount === undefined || categoriesCount === null) {
      return []
    }

    let categories: CategoriesRatio[] = []

    for (const [key, value] of categoriesCount) {
      if (value === 0) {
        continue
      }
      const ratio = Math.round((value / articlesCount) * 100)
      categories.push({
        name: key,
        ratio: ratio,
      })
    }

    return categories
  }

  /**
   * ユーザー情報を更新する
   *
   * データの更新や削除があった場合に利用することで最新のユーザー情報を利用できる
   */
  async function updateSigninUser() {
    let user = await fetchUser(currentUser.uid)
    user.identifierToken = currentUser.identifierToken
    setSigninUser(user)
  }

  // Actions

  async function onSubmitItem(url: string, comment: string, category: Category) {
    setIsSending(true)

    try {
      await axios.post(
        '/api/article',
        {
          contentURL: url,
          comment: comment,
          category: category ? category.id : null,
        },
        {
          headers: {
            'Content-Type': 'text/plain',
            Authorization: `Bearer ${currentUser.identifierToken}`,
          },
        },
      )
    } catch (error) {
      console.log(error)
    }

    setIsSending(false)
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

  async function onUpdateItem(url: string, comment: string) {
    setIsSending(true)
    const docRef = doc(firestore, `users/${currentUser.uid}/articles`, selectedArticle.id)
    await updateDoc(docRef, {
      contentURL: url,
      comment: comment,
    })
    setIsSending(false)
    setSelectedArticle(null)
  }

  async function onClickDelete(article: Article) {
    if (!isCurrentUser) {
      // 他のユーザー情報を保持している場合
      return
    }

    try {
      await axios.delete(`/api/article/${article.id}`, {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Bearer ${currentUser.identifierToken}`,
        },
      })
    } catch (error) {
      console.log(error)
    }
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

    loadNextArticles(user.uid)
  }

  return (
    <Layout>
      {currentUser && (
        <Box>
          {/* プロフィール情報 */}
          <VStack spacing={4} align='center'>
            <section className='text-center'>
              <Image
                borderRadius='full'
                src={user?.profileImageURL}
                width={100}
                height={100}
                alt='user icon'
              />
            </section>
            <h1 className='h4'>{user?.name}のページ</h1>
            <Text>(記事数) {user?.articlesCount}</Text>
            <CategoriesRatioList categoriesRatio={categoriesRatio} />
            {isCurrentUser && (
              <Button colorScheme='teal' onClick={onOpenAddArticleModal}>
                Add Article
              </Button>
            )}
          </VStack>
          {/* 記事一覧 */}
          <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='center'>
            <Box className='col-12' ref={scrollContainerRef}>
              <SimpleGrid columns={{ sm: 2, md: 3 }} spacing='40px'>
                {articles.map((article) => (
                  <div key={article.id}>
                    <Item
                      article={article}
                      isCurrentUser={isCurrentUser}
                      onClickDelete={(article) => {
                        setSelectedArticle(article)
                        onOpenConfirmDeleteModal()
                      }}
                      onClickUpdae={() => {
                        setSelectedArticle(article)
                        onOpenUpdateArticleModal()
                      }}
                    ></Item>
                  </div>
                ))}
              </SimpleGrid>
            </Box>
          </VStack>
          {selectedArticle !== null && (
            <SimpleModal
              title={'この記事を削除しますか？'}
              message={`URL: ${selectedArticle.contentURL}`}
              isOpen={isOpenConfirmDeleteModal}
              onPositiveAction={async () => {
                await onClickDelete(selectedArticle)
                loadArticles(currentUser.uid, categories, true)
                updateSigninUser()
              }}
              onClose={onCloseConfirmDeleteModal}
            />
          )}
          <UpdateArticleModal
            article={selectedArticle}
            isOpen={isOpenUpdateArticleModal}
            onClose={onCloseUpdateArticleModal}
            onUpdate={async (url: string, comment: string): Promise<void> => {
              await onUpdateItem(url, comment)
              loadArticles(currentUser.uid, categories, true)
            }}
          />
          <AddArticleModal
            isOpen={isOpenAddArticleModal}
            categories={categories}
            onSubmit={async (url: string, comment: string, category: Category): Promise<void> => {
              await onSubmitItem(url, comment, category)
              loadArticles(currentUser.uid, categories, true)
              updateSigninUser()
            }}
            onClose={onCloseAddArticleModal}
          />
        </Box>
      )}
    </Layout>
  )
}
