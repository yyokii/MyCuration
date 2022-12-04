import axios, { AxiosInstance } from 'axios'
import { ArticleRepositoryImpl } from './articleRepository'
import { UserRepositoryImpl } from './userRepository'
import { auth } from '../lib/firebase'
import { OGPRepositoryImpl } from './ogpRepository'

const baseAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

const baseAxiosWithAuthInterceptor = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

baseAxiosWithAuthInterceptor.interceptors.request.use(async (request) => {
  const user = auth.currentUser
  const token = await user.getIdToken()

  request.headers.Authorization = `Bearer ${token}`
  return request
})

export interface Repository {
  readonly axios: AxiosInstance
  readonly path: string
}

/**
 * Dictionary of repositories
 */
interface repositoryObject {
  [name: string]: any
}

// Repository cotainer

const repositories: repositoryObject = {
  article: new ArticleRepositoryImpl(baseAxiosWithAuthInterceptor, '/api/article'),
  ogp: new OGPRepositoryImpl(baseAxios, '/api/ogpdata'),
  user: new UserRepositoryImpl(baseAxiosWithAuthInterceptor, '/api/user'),
}

export const RepositoryFactory = {
  get: (name: string) => repositories[name],
}
