import { useRouter } from 'next/router'
import { User, userConverter } from '../../types/user'
import { Category } from '../../types/category'
import { useEffect, useRef, useState } from 'react'
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  updateDoc,
} from 'firebase/firestore'
import Layout from '../../components/Layout'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { toast } from 'react-toastify'
import { Article, articleConverter } from '../../types/article'
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
import CategoriesRatioList, { CategoriesRatio } from '../../components/CategoriesRatio'
import NotFound from '../../components/NotFound'
import { GetServerSideProps } from 'next'
import { RepositoryFactory } from '../../repository/repository'
import { ArticleRepository } from '../../repository/articleRepository'
import { UserRepository } from '../../repository/userRepository'
import NormalButton from '../../components/common/NormalButton'
import { signOut } from '../../lib/firebase-auth'

type Props = {
  user: User
  categories: Category[]
  categoriesRatio: CategoriesRatio[]
}

const emptyProps: Props = {
  user: null,
  categories: [],
  categoriesRatio: [],
}

const defaultArticleLimit = 100

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { userName } = context.query

  if (typeof userName !== 'string') {
    return {
      props: {
        ...emptyProps,
      },
    }
  }

  try {
    const categories = await loadCategories()

    // Fetch user data
    const user = await fetchUserWithName(userName)
    if (!user) {
      return {
        props: {
          ...emptyProps,
        },
      }
    }

    // Calculate categories ratio
    const categoriesRatio = calcCategoriesRatio(user?.categoriesCount, user?.articlesCount)

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        categories: categories,
        categoriesRatio: categoriesRatio,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      props: {
        ...emptyProps,
      },
    }
  }
}

async function loadCategories(): Promise<Category[]> {
  const snapshot = await getDocs(query(collection(firestore, `categories`), orderBy('name')))

  const fetchedCategories = snapshot.docs.map((doc) => {
    const category = doc.data() as Category
    category.id = doc.id
    return category
  })
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

type Query = {
  userName: string
}

export default function UserShow(props: Props) {
  const { currentUser } = useCurrentUser()

  const scrollContainerRef = useRef(null)
  const router = useRouter()
  const queryPath = router.query as Query
  const isCurrentUser = currentUser?.name === queryPath.userName

  // Repository
  const articleRepository: ArticleRepository = RepositoryFactory.get('article')
  const userRepository: UserRepository = RepositoryFactory.get('user')

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

  const [user, setUser] = useState<User>(props.user) // 本画面で表示する対象ユーザー
  const [articles, setArticles] = useState<Article[]>([])
  const [categories] = useState<Category[]>(props.categories)
  const [categoriesRatio, setCategoriesRatio] = useState<CategoriesRatio[]>(props.categoriesRatio)

  const [isSending, setIsSending] = useState(false)
  const [isPaginationFinished, setIsPaginationFinished] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article>(null)
  const [aritcleLimit, setAritcleLimit] = useState<number>(defaultArticleLimit)

  // Effect

  useEffect(() => {
    const query = createArticlesBaseQuery(user?.uid, aritcleLimit)
    const unsubscribe = onSnapshot(query, (querySnapshot) => {
      const fetchedArticles = querySnapshot.docs.map((doc) => {
        return configureArticle(doc, categories)
      })

      setArticles(fetchedArticles)
    })
    return unsubscribe
  }, [aritcleLimit])

  useEffect(() => {
    if (user == null) {
      return
    }
    const reference = doc(collection(firestore, 'users'), user.uid).withConverter(userConverter)
    const unsubscribe = onSnapshot(reference, (querySnapshot) => {
      const user = querySnapshot.data() as User
      const categoriesRatio = calcCategoriesRatio(user?.categoriesCount, user?.articlesCount)
      setCategoriesRatio(categoriesRatio)
      setUser(user)
    })
    return unsubscribe
  }, [articles])

  function createArticlesBaseQuery(uid: string, limitNum: number) {
    return query(
      collection(firestore, `users/${uid}/articles`),
      orderBy('createdAt', 'desc'),
      limit(limitNum),
    ).withConverter(articleConverter)
  }

  function configureArticle(snapshot: QueryDocumentSnapshot, categories: Category[]): Article {
    const article = snapshot.data() as Article
    article.id = snapshot.id
    article.configureCategoryData(categories)
    return article
  }

  // Actions

  async function onSubmitItem(url: string, comment: string, category: Category) {
    setIsSending(true)

    try {
      await articleRepository.create(url, comment, category)

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
    } catch (error) {
      console.log(error)
    }
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
      return
    }

    try {
      await articleRepository.delete(article.id)
    } catch (error) {
      console.log(error)
    }
  }

  async function onClickSignOut() {
    try {
      await signOut()
    } catch (error) {
      console.log(error)
    }
  }

  async function onClickDeleteAccount() {
    try {
      await userRepository.delete()
      router.push('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Layout>
      {user ? (
        <Box>
          {/* プロフィール情報 */}
          <VStack spacing={4} align='center'>
            <section className='text-center'>
              <Image
                borderRadius='full'
                src={user.profileImageURL}
                width={100}
                height={100}
                alt='user icon'
              />
            </section>
            <h1 className='h4'>{user.name}のページ</h1>
            <Text>(記事数) {user.articlesCount}</Text>
            <CategoriesRatioList categoriesRatio={categoriesRatio} />
            {isCurrentUser && (
              <VStack spacing={4} align='center'>
                <NormalButton title='Add' isSending={isSending} onClick={onOpenAddArticleModal} />
                <NormalButton title='Sign out' isSending={isSending} onClick={onClickSignOut} />
                <NormalButton
                  title='Delete account'
                  isSending={isSending}
                  onClick={onClickDeleteAccount}
                />
              </VStack>
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
              title={'Delete this article？'}
              message={`URL: ${selectedArticle.contentURL}`}
              isOpen={isOpenConfirmDeleteModal}
              onPositiveAction={async () => {
                await onClickDelete(selectedArticle)
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
            }}
          />
          <AddArticleModal
            isOpen={isOpenAddArticleModal}
            categories={props.categories}
            onSubmit={async (url: string, comment: string, category: Category): Promise<void> => {
              await onSubmitItem(url, comment, category)
            }}
            onClose={onCloseAddArticleModal}
          />
        </Box>
      ) : (
        <Box p={4}>
          <NotFound />
        </Box>
      )}
    </Layout>
  )
}
