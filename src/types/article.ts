import { WithFieldValue, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { Category } from './category'

class Article {
  id: string
  comment: string
  contentURL: string
  createdAt: string
  category: string
  displayCategory: string // This is used for display purpose.
  updatedAt: string

  constructor(
    id: string,
    comment: string,
    contentURL: string,
    createdAt: string,
    category: string,
    displayCategory: string,
    updatedAt: string,
  ) {
    this.id = id
    this.comment = comment
    this.contentURL = contentURL
    this.createdAt = createdAt
    this.category = category
    this.displayCategory = displayCategory
    this.updatedAt = updatedAt
  }

  configureDisplayCategory(categories: Category[]) {
    const displayName = categories.find((category) => category.id === this.category).name
    this.displayCategory = displayName
  }
}

const articleConverter = {
  toFirestore(article: WithFieldValue<Article>): DocumentData {
    return {
      comment: article.comment,
      contentURL: article.contentURL,
      createdAt: article.createdAt,
      category: article.category,
      updatedAt: article.updatedAt,
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Article {
    const data = snapshot.data()
    const article = new Article(
      snapshot.id,
      data.comment,
      data.contentURL,
      data.createdAt,
      data.category,
      '',
      data.updatedAt,
    )
    return article
  },
}

export { Article, articleConverter }
