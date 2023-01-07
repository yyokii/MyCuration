import { AxiosInstance } from 'axios'
import { Category } from '../types/category'
import { OGP } from '../types/ogp'
import { Repository } from './repository'

export interface ArticleRepository extends Repository {
  create(ogp: OGP, comment: string, category: Category): Promise<void>
}

export class ArticleRepositoryImpl implements ArticleRepository {
  readonly axios: AxiosInstance
  readonly path: string

  constructor(axios: AxiosInstance, path: string) {
    this.axios = axios
    this.path = path
  }

  async create(ogp: OGP, comment: string, category: Category): Promise<void> {
    return await this.axios.post(this.path, {
      contentURL: ogp.url,
      comment: comment,
      category: category ? category.id : null,
      ogTitle: ogp.title,
      ogDescription: ogp.description,
      ogSiteName: ogp.siteName,
    })
  }
}
