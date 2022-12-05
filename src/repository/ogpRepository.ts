import { AxiosInstance } from 'axios'
import { OGP } from '../types/ogp'
import { Repository } from './repository'

export interface OGPRepository extends Repository {
  get(url: string): Promise<OGP>
}

export class OGPRepositoryImpl implements OGPRepository {
  readonly axios: AxiosInstance
  readonly path: string

  constructor(axios: AxiosInstance, path: string) {
    this.axios = axios
    this.path = path
  }

  async get(url: string): Promise<OGP | null> {
    const data = await this.axios
      .get(this.path, {
        params: { url: url },
      })
      .catch(() => {
        return null
      })

    if (!data) return null

    const ogp = data.data[url]
    return new OGP(url, ogp['og:title'], ogp['og:description'], ogp['og:image'])
  }
}
