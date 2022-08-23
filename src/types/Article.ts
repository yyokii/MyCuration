import { Timestamp } from 'firebase/firestore'

export interface Article {
  id: string
  comment: string
  contentURL: string
  createdAt: Timestamp
  category: string
  displayCategory: string // This is used for display purpose.
  updatedAt: Timestamp
}
