import { AxiosInstance } from 'axios'
import { Category } from '../types/category'
import { Repository } from './repository'

export interface ArticleRepository extends Repository {
  create(url: string, title: string, comment: string, category: Category): Promise<void>
}

export class ArticleRepositoryImpl implements ArticleRepository {
  readonly axios: AxiosInstance
  readonly path: string

  constructor(axios: AxiosInstance, path: string) {
    this.axios = axios
    this.path = path
  }

  async create(url: string, title: string, comment: string, category: Category): Promise<void> {
    return await this.axios.post(this.path, {
      contentURL: url,
      title: title,
      comment: comment,
      category: category ? category.id : null,
    })
  }
}
