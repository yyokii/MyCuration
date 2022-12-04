import { AxiosInstance } from 'axios'
import { Repository } from './repository'

class OGP {
  readonly url: string
  readonly title: string
  readonly description: string
  readonly image: string

  constructor(url: string, title: string, description: string, image: string) {
    this.url = url
    this.title = title
    this.description = description
    this.image = image
  }
}

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

  async get(url: string): Promise<OGP> {
    const data = await this.axios.get(this.path, {
      params: { url: url },
    })
    const ogp = data.data[url]
    return new OGP(url, ogp['og:title'], ogp['og:description'], ogp['og:image'])
  }
}
