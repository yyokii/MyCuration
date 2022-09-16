import axios, { AxiosInstance } from 'axios'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { ArticleRepository } from './articleRepository'
import { UserRepository } from './userRepository'
import { auth } from '../lib/firebase'

const baseAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
})
baseAxios.interceptors.request.use(async (request) => {
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

const repositories: repositoryObject = {
  article: new ArticleRepository(baseAxios, '/api/article'),
  users: new UserRepository(baseAxios, '/api/users'),
}

export const RepositoryFactory = {
  get: (name: string) => repositories[name],
}
