import { Timestamp } from 'firebase/firestore'

export interface Article {
  id: string
  category: string
  comment: string
  contentURL: string
  createdAt: Timestamp
  tags: Map<string, boolean>
  displayTags: string[]
  updatedAt: Timestamp
}
