import { useRouter } from 'next/router'
import { User, userConverter } from '../../types/user'
import { useEffect, useRef, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
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
import NotFound from '../../components/NotFound'
import { GetServerSideProps } from 'next'
import { RepositoryFactory } from '../../repository/repository'
import { ArticleRepository } from '../../repository/articleRepository'
import UserProfile from '../../components/UserProfile'
import AddContentButton from '../../components/AddContentButton'
import AccountSettingPopover from '../../components/AccountSettingPopover'
import { OGP } from '../../types/ogp'
import { Tag as TagData } from '../../types/tag'
import dayjs from 'dayjs'
import { TagBar } from '../../components/TagBar'

type Props = {
  user: User
  tags: TagData[]
}

const emptyProps: Props = {
  user: null,
  tags: [],
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
    const user = await fetchUserWithName(userName)
    if (!user) {
      return {
        props: {
          ...emptyProps,
        },
      }
    }

    const tags = await loadTags(user)

    return {
      props: {
        user: JSON.parse(JSON.stringify(user)),
        tags: JSON.parse(JSON.stringify(tags)),
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

async function loadTags(user: User): Promise<TagData[]> {
  const snapshot = await getDocs(
    query(collection(firestore, `users/${user.uid}/tags`), orderBy('name')),
  )

  return makeDisplayTags(snapshot)
}

const makeDisplayTags = (snapshot: QuerySnapshot<DocumentData>) => {
  const tags = snapshot.docs.map((doc) => {
    const tag = doc.data() as TagData
    tag.id = doc.id
    return tag
  })
  const allTag = TagData.makeAllTag()
  allTag.isSelected = true
  tags.unshift(allTag)
  return tags
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
  const [contents, setContents] = useState<Article[]>([])
  const [filteredContents, setFilteredContents] = useState<Article[]>([])
  const [tags, setTags] = useState<TagData[]>(props.tags)

  const [isSending, setIsSending] = useState(false)
  const [isPaginationFinished, setIsPaginationFinished] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article>(null)
  const [aritcleLimit, setAritcleLimit] = useState<number>(defaultArticleLimit)

  // Effect

  // TODO: listenするものについて、自分のページでなければ無視して良い気がしてきたが。効率は悪いが一旦listenのままで進めている。

  useEffect(() => {
    // タグ情報の更新を監視
    const tagQuery = query(collection(firestore, `users/${user?.uid}/tags`), orderBy('name', 'asc'))

    const unsubscribe = onSnapshot(tagQuery, (querySnapshot) => {
      const fetchedTags = makeDisplayTags(querySnapshot)
      setTags(fetchedTags)
    })
    return unsubscribe
  }, [user?.uid])

  useEffect(() => {
    // コンテンツ情報の更新を監視
    const query = createArticlesBaseQuery(user?.uid, aritcleLimit)
    const unsubscribe = onSnapshot(query, (querySnapshot) => {
      const fetchedArticles = querySnapshot.docs.map((doc) => {
        const data = Article.makeFromSnapshot(doc)
        data.configureTagData(tags)
        return data
      })

      setContents(fetchedArticles)
    })
    return unsubscribe
  }, [aritcleLimit])

  useEffect(() => {
    // コンテンツをフィルタリングして表示
    const selectedTag = tags.find((tag) => tag.isSelected)
    if (selectedTag?.id === 'all') {
      setFilteredContents(contents)
      return
    }
    const filteredContents = contents.filter((article) => {
      return article.tagIDs.includes(selectedTag?.id)
    })
    setFilteredContents(filteredContents)
  }, [contents, tags])

  useEffect(() => {
    if (user == null) {
      return
    }
    const reference = doc(collection(firestore, 'users'), user.uid).withConverter(userConverter)
    const unsubscribe = onSnapshot(reference, (querySnapshot) => {
      const user = querySnapshot.data() as User
      setUser(user)
    })
    return unsubscribe
  }, [contents])

  function createArticlesBaseQuery(uid: string, limitNum: number) {
    return query(
      collection(firestore, `users/${uid}/articles`),
      orderBy('createdAt', 'desc'),
      limit(limitNum),
    ).withConverter(articleConverter)
  }

  // Actions

  async function onSubmitItem(ogp: OGP, comment: string, tags: TagData[]) {
    if (!isCurrentUser) {
      return
    }
    setIsSending(true)

    try {
      const newTags = tags.filter((tag) => tag.id === '')
      if (newTags.length > 0) {
        for (const tag of newTags) {
          const ref: DocumentReference = await addDoc(
            collection(firestore, `users/${currentUser?.uid}/tags`),
            {
              name: tag.name,
              createdAt: dayjs().toISOString(),
              updatedAt: dayjs().toISOString(),
            },
          )
          tag.id = ref.id
        }
      }

      const loadedTags = await loadTags(user)
      setTags(loadedTags)
      await articleRepository.create(ogp, comment, tags)

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
              <Box me={4}>
                <AccountSettingPopover
                  signIn={() => {
                    signOut()
                  }}
                  deleteAccount={async function (): Promise<void> {
                    await deleteAccount()
                  }}
                />
              </Box>
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
          <Box px={8}>
            <Text fontSize={'4xl'} fontWeight={'extrabold'}>
              My Comments
            </Text>
            {/* タグ */}
            <TagBar
              tags={tags}
              onClickTag={(tag: TagData) => {
                const newTags = tags.map((t) => {
                  if (t.id === tag.id) {
                    t.isSelected = true
                    return t
                  } else {
                    t.isSelected = false
                    return t
                  }
                })
                setTags(newTags)
              }}
            />
            {/* コンテンツ一覧 */}
            <VStack spacing={4} align='center' my={8}>
              <Box className='col-12' ref={scrollContainerRef}>
                <SimpleGrid columns={{ sm: 2, md: 3 }} spacing='40px'>
                  {filteredContents.map((article) => (
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
              onSubmit={async (ogp: OGP, comment: string, tags: TagData[]): Promise<void> => {
                await onSubmitItem(ogp, comment, tags)
              }}
              onClose={onCloseAddArticleModal}
              tags={tags.flatMap((tag) => {
                if (tag.isAllTag) {
                  return []
                } else {
                  return tag
                }
              })}
            />
          </Box>
        </Box>
      ) : (
        <Box p={4}>
          <NotFound />
        </Box>
      )}
    </Layout>
  )
}
