import { WithFieldValue, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore'
import { Tag } from './tag'

class Article {
  id: string
  comment: string
  contentURL: string
  createdAt: string
  tagIDs: string[]
  tags: Tag[]
  ogTitle: string
  ogDescription: string
  ogSiteName: string
  updatedAt: string

  constructor(
    id: string,
    comment: string,
    contentURL: string,
    createdAt: string,
    tagIDs: string[],
    ogTitle: string,
    ogDescription: string,
    ogSiteName: string,
    updatedAt: string,
  ) {
    this.id = id
    this.comment = comment
    this.contentURL = contentURL
    this.createdAt = createdAt
    this.tagIDs = tagIDs
    this.ogTitle = ogTitle
    this.ogDescription = ogDescription
    this.ogSiteName = ogSiteName
    this.updatedAt = updatedAt
  }

  static makeFromSnapshot(snapshot: QueryDocumentSnapshot): Article {
    const data = snapshot.data() as Article
    data.id = snapshot.id
    return data
  }

  configureTagData(tags: Tag[]) {
    return (this.tags = tags.filter((tag) => this.tagIDs.includes(tag.id)))
  }
}

const articleConverter = {
  toFirestore(article: WithFieldValue<Article>): DocumentData {
    return {
      comment: article.comment,
      contentURL: article.contentURL,
      createdAt: article.createdAt,
      tagIDs: article.tagIDs,
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
      data.tagIDs,
      data.ogTitle,
      data.ogDescription,
      data.ogSiteName,
      data.updatedAt,
    )
    return article
  },
}

export { Article, articleConverter }
