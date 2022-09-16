import { AxiosInstance } from 'axios'
import { Repository } from './repository'

export class UserRepository implements Repository {
  readonly axios: AxiosInstance
  readonly path: string

  constructor(axios: AxiosInstance, path: string) {
    this.axios = axios
    this.path = path
  }

  get(data: object) {
    return this.axios.get(this.path, {
      params: { ...data },
    })
  }
}
