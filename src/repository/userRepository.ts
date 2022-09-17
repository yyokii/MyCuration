import { AxiosInstance } from 'axios'
import { Repository } from './repository'

export interface UserRepository extends Repository {
  delete(): Promise<void>
}

export class UserRepositoryImpl implements UserRepository {
  readonly axios: AxiosInstance
  readonly path: string

  constructor(axios: AxiosInstance, path: string) {
    this.axios = axios
    this.path = path
  }

  async delete(): Promise<void> {
    return await this.axios.delete(this.path)
  }
}
