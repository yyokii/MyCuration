import { Timestamp } from 'firebase/firestore'

export interface Article {
  id: string
  comment: string
  contentURL: string
  createdAt: Timestamp
  tags: string[]
  displayTags: string[]
  updatedAt: Timestamp
}
