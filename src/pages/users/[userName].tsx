import { useRouter } from 'next/router'
import { User, userConverter } from '../../types/user'
import { Category } from '../../types/category'
import { useEffect, useRef, useState } from 'react'
import {
  collection,
  deleteDoc,
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
import { auth, firestore } from '../../lib/firebase'
import { fetchUserWithName } from '../../lib/db'
import Item from '../../components/Article/Item'
import { Box, Center, SimpleGrid, useDisclosure, Text, VStack } from '@chakra-ui/react'
import { UpdateArticleModal } from '../../components/Modal/UpdateArticleModal'
import { AddArticleModal } from '../../components/Modal/AddArticleModal'
import { SimpleModal } from '../../components/Modal/SimpleModal'
import { CategoriesRatio } from '../../components/CategoriesRatio'
import NotFound from '../../components/NotFound'
import { GetServerSideProps } from 'next'
import { RepositoryFactory } from '../../repository/repository'
import { ArticleRepository } from '../../repository/articleRepository'
import UserProfile from '../../components/UserProfile'
import AddContentButton from '../../components/AddContentButton'
import AccountSettingPopover from '../../components/AccountSettingPopover'
import { OGP } from '../../types/ogp'

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

  async function onSubmitItem(ogp: OGP, comment: string, category: Category) {
    setIsSending(true)

    try {
      await articleRepository.create(ogp, comment, category)

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

  async function onUpdateItem(url: string, title: string, comment: string) {
    setIsSending(true)
    const docRef = doc(firestore, `users/${currentUser.uid}/articles`, selectedArticle.id)
    await updateDoc(docRef, {
      contentURL: url,
      title: title,
      comment: comment,
    })
    setIsSending(false)
    setSelectedArticle(null)
  }

  async function onClickDelete(article: Article) {
    if (!isCurrentUser) {
      return
    }
    await deleteDoc(doc(firestore, `users/${currentUser.uid}/articles`, article.id))
  }

  async function signOut() {
    if (!isCurrentUser) {
      return
    }

    try {
      await signOut()
    } catch (error) {
      console.log(error)
    }
  }

  async function deleteAccount() {
    if (!isCurrentUser) {
      return
    }

    try {
      await auth.currentUser.delete()
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
          <VStack
            align={'end'}
            bgGradient='linear(to-r, #F9E1FD, #FAF0DD)'
            py={2}
            pt={isCurrentUser ? 0 : 10}
            pb={10}
          >
            {isCurrentUser && (
              <AccountSettingPopover
                signIn={() => {
                  signOut()
                }}
                deleteAccount={async function (): Promise<void> {
                  await deleteAccount()
                }}
              />
            )}
            <Center w='100%'>
              <UserProfile
                name={user.name}
                imageURL={user.profileImageURL}
                articleCounts={user.articlesCount}
              />
            </Center>
          </VStack>
          {isCurrentUser && (
            <Center mt={-5}>
              <AddContentButton isLoading={isSending} onClick={onOpenAddArticleModal} />
            </Center>
          )}
          <Text fontSize={'4xl'} fontWeight={'extrabold'} m={6}>
            Comments
          </Text>
          {/* 記事一覧 */}
          <VStack spacing={4} align='center' my={8}>
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
            onUpdate={async (url: string, title: string, comment: string): Promise<void> => {
              await onUpdateItem(url, title, comment)
            }}
          />
          <AddArticleModal
            isOpen={isOpenAddArticleModal}
            categories={props.categories}
            onSubmit={async (ogp: OGP, comment: string, category: Category): Promise<void> => {
              await onSubmitItem(ogp, comment, category)
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
