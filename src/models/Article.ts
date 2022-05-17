import { Timestamp } from 'firebase/firestore'

export interface Article {
  id: string
  category: String
  comment: String
  contentURL: String
  createdAt: Timestamp
  updatedAt: Timestamp
}
