import { NextApiRequest, NextApiResponse } from 'next'
import {
  sendInternalServerErrorResponse,
  sendNotImplementedErrorResponse,
  sendUnauthorizedErrorResponse,
} from '../../utils/api/sendErrorResponse'
import { createArticle, deleteCurrentUser } from '../../lib/db-admin'
import { authenticate } from '../../utils/api/authenticate'
import { FirebaseError } from '@firebase/util'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    try {
      await deleteCurrentUser(req.query.uid as string)
      return res.status(200).json({})
    } catch (error) {
      console.log(error)

      if (error instanceof FirebaseError) {
        console.error(error.code)
        sendUnauthorizedErrorResponse(res, error.code)
        return
      }

      return sendInternalServerErrorResponse(res, error.message)
    }
  } else {
    sendNotImplementedErrorResponse(res, 'This method is not allowed.')
  }
}

export default authenticate(handler)
