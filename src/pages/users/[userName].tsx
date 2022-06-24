import { useRouter } from 'next/router'
import { User } from '../../types/User'
import { useEffect, useRef, useState } from 'react'
import {
  collection,
  doc,
  getDoc,
  DocumentData,
  getDocs,
  limit,
  orderBy,
  query,
  QuerySnapshot,
  startAfter,
  runTransaction,
  updateDoc,
} from 'firebase/firestore'
import Layout from '../../components/Layout'
import { useCurrentUser } from '../../hooks/useCurrentUser'
import { toast } from 'react-toastify'
import { Article } from '../../types/Article'
import { firestore } from '../../lib/firebase'
import { UserID } from '../../types/UserID'
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
import { Tag } from '../../types/Tag'
import { Item as ItemObject } from 'chakra-ui-autocomplete'
import { AddArticleModal } from '../../components/Modal/AddArticleModal'
import { SimpleModal } from '../../components/Modal/SimpleModal'
import { useSetRecoilState } from 'recoil'
import { userState } from '../../states/user'
import { fetchUser } from '../../lib/firebase-auth'
import axios from 'axios'

type Query = {
  userName: string
}

export default function UserShow() {
  const { currentUser } = useCurrentUser()
  const setSigninUser = useSetRecoilState(userState)

  const scrollContainerRef = useRef(null)
  const router = useRouter()
  const queryPath = router.query as Query

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

  const [user, setUser] = useState<User>(null) // 本画面で表示する対象ユーザー。 null: ログインしているユーザー自身の場合nullとなる。

  const [isSending, setIsSending] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [tagItems, setTagItems] = useState<ItemObject[]>([]) // タグ入力欄のオートコンプリート用のデータ

  const [isPaginationFinished, setIsPaginationFinished] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<Article>(null)

  // Effect

  // ユーザー情報と記事の取得を行う
  useEffect(() => {
    if (currentUser === null) {
      return
    }

    if (queryPath.userName === undefined) {
      return
    }

    ;(async () => {
      const tags = await loadTags()
      if (queryPath.userName === currentUser.name) {
        // 自分のページ
        setUser(null)
        loadArticles(currentUser.uid, tags, true)
      } else {
        // 他のユーザー
        const user = await loadUser()
        if (user === undefined || user === null) {
          // TODO: 対象ユーザーが存在しない場合のページ表示
          console.log('ユーザーが存在しません')
        } else {
          loadArticles(user.uid, tags, true)
        }
      }
    })()

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

  async function loadArticles(uid: string, tags: Tag[], isReload: boolean = false) {
    const snapshot = await getDocs(createArticlesBaseQuery(uid))

    if (snapshot.empty) {
      setIsPaginationFinished(true)
      return
    }

    appendArticles(snapshot, tags, isReload)
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

    appendArticles(snapshot, tags)
  }

  function appendArticles(
    snapshot: QuerySnapshot<DocumentData>,
    tags: Tag[],
    isReload: boolean = false,
  ) {
    const fetchedArticles = snapshot.docs.map((doc) => {
      const article = doc.data() as Article
      article.id = doc.id

      // tagの設定
      article.displayTags = []
      if (article.tags.length > 0) {
        article.tags.forEach((tagID) => {
          const displayName = tags.find((tag) => tag.id === tagID).name
          article.displayTags.push(displayName)
        })
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

  async function loadTags(): Promise<Tag[]> {
    const snapshot = await getDocs(query(collection(firestore, `tags`), orderBy('name')))

    const fetchedTags = snapshot.docs.map((doc) => {
      const tag = doc.data() as Tag
      tag.id = doc.id
      return tag
    })
    setTags(fetchedTags)

    // タグ入力欄のオートコンプリート用のデータを作成
    const tagItems = fetchedTags.map((tag) => {
      return {
        value: tag.id,
        label: tag.name,
      }
    })
    setTagItems(tagItems)

    return fetchedTags
  }

  async function updateSigninUser() {
    let user = await fetchUser(currentUser.uid)
    setSigninUser(user)
  }

  // Actions

  async function onSubmitItem(url: string, comment: string, selectedTags: ItemObject[]) {
    setIsSending(true)

    try {
      await axios.post(
        '/api/article',
        {
          contentURL: url,
          comment: comment,
          tags: selectedTags,
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
    setSelectedArticle(undefined)
    console.log('finish onUpdateItem')
  }

  // api化する
  async function onClickDelete(article: Article) {
    if (user !== null) {
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

    let targetuid: string
    if (user === null) {
      targetuid = currentUser.uid
    } else {
      targetuid = user.uid
    }

    loadNextArticles(targetuid)
  }

  return (
    <Layout>
      {currentUser && (
        <Box>
          <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='center'>
            <div>
              <section className='text-center'>
                <Image
                  borderRadius='full'
                  src={user === null ? currentUser.profileImageURL : user.profileImageURL}
                  width={100}
                  height={100}
                  alt='user icon'
                />
                <h1 className='h4'>{user === null ? currentUser.name : user.name}のページ</h1>
                <Text>
                  (記事数) {user === null ? currentUser.articlesCount : user.articlesCount}
                </Text>
              </section>
              {user === null && (
                <Button colorScheme='teal' onClick={onOpenAddArticleModal}>
                  Add Article
                </Button>
              )}
            </div>
          </VStack>
          {/* 記事一覧 */}
          <VStack divider={<StackDivider borderColor='gray.200' />} spacing={4} align='center'>
            <Box className='col-12' ref={scrollContainerRef}>
              <SimpleGrid columns={{ sm: 2, md: 3 }} spacing='40px'>
                {articles.map((article) => (
                  <div key={article.id}>
                    <Item
                      article={article}
                      isCurrentUser={user === null}
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
                loadArticles(currentUser.uid, tags, true)
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
              loadArticles(currentUser.uid, tags, true)
            }}
          />
          <AddArticleModal
            isOpen={isOpenAddArticleModal}
            tagItems={tagItems}
            onSubmit={async (
              url: string,
              comment: string,
              selectedTags: ItemObject[],
            ): Promise<void> => {
              await onSubmitItem(url, comment, selectedTags)
              loadArticles(currentUser.uid, tags, true)
              updateSigninUser()
            }}
            onClose={onCloseAddArticleModal}
          />
        </Box>
      )}
    </Layout>
  )
}
