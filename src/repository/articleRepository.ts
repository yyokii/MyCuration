import { AxiosInstance } from 'axios'
import { Category } from '../types/category'
import { Repository } from './repository'

export interface ArticleRepository extends Repository {
  create(url: string, comment: string, category: Category): Promise<void>
  delete(artilcleId: string): Promise<void>
}

export class ArticleRepositoryImpl implements ArticleRepository {
  readonly axios: AxiosInstance
  readonly path: string

  constructor(axios: AxiosInstance, path: string) {
    this.axios = axios
    this.path = path
  }

  async create(url: string, comment: string, category: Category): Promise<void> {
    return await this.axios.post(this.path, {
      contentURL: url,
      comment: comment,
      category: category ? category.id : null,
    })
  }

  async delete(artilcleId: string): Promise<void> {
    return await this.axios.delete(`${this.path}/${artilcleId}`)
  }

  get(data: object) {
    return this.axios.get(this.path, {
      params: { ...data },
    })
  }
}
