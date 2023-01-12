import { AxiosInstance } from 'axios'
import { OGP } from '../types/ogp'
import { Tag } from '../types/tag'
import { Repository } from './repository'

export interface ArticleRepository extends Repository {
  create(ogp: OGP, comment: string, tags: Tag[]): Promise<void>
}

export class ArticleRepositoryImpl implements ArticleRepository {
  readonly axios: AxiosInstance
  readonly path: string

  constructor(axios: AxiosInstance, path: string) {
    this.axios = axios
    this.path = path
  }

  async create(ogp: OGP, comment: string, tags: Tag[]): Promise<void> {
    return await this.axios.post(this.path, {
      contentURL: ogp.url,
      comment: comment,
      tagIDs: tags.map((tag) => tag.id),
      ogTitle: ogp.title,
      ogDescription: ogp.description,
      ogSiteName: ogp.siteName,
    })
  }
}
