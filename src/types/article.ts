import { WithFieldValue, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { Category } from './category'

class Article {
  id: string
  comment: string
  contentURL: string
  createdAt: string
  category: string
  categoryData: Category // This is used for display purpose.
  ogTitle: string
  ogDescription: string
  ogSiteName: string
  updatedAt: string

  constructor(
    id: string,
    comment: string,
    contentURL: string,
    createdAt: string,
    category: string,
    categoryData: Category,
    ogTitle: string,
    ogDescription: string,
    ogSiteName: string,
    updatedAt: string,
  ) {
    this.id = id
    this.comment = comment
    this.contentURL = contentURL
    this.createdAt = createdAt
    this.category = category
    this.categoryData = categoryData
    this.ogTitle = ogTitle
    this.ogDescription = ogDescription
    this.ogSiteName = ogSiteName
    this.updatedAt = updatedAt
  }

  configureCategoryData(categories: Category[]) {
    const categoryData: Category = categories.find((category) => category.id === this.category)
    this.categoryData = categoryData
  }
}

const articleConverter = {
  toFirestore(article: WithFieldValue<Article>): DocumentData {
    return {
      comment: article.comment,
      contentURL: article.contentURL,
      createdAt: article.createdAt,
      category: article.category,
      ogTitle: article.ogTitle,
      ogDescription: article.ogDescription,
      ogSiteName: article.ogSiteName,
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
      null,
      data.ogTitle,
      data.ogDescription,
      data.ogSiteName,
      data.updatedAt,
    )
    return article
  },
}

export { Article, articleConverter }
