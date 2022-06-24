import { NextApiRequest, NextApiResponse } from 'next'
import {
  sendInternalServerErrorResponse,
  sendNotImplementedErrorResponse,
} from '../../../../utils/api/sendErrorResponse'
import { deleteArticle } from '../../../../lib/db-admin'
import { authenticate } from '../../../../utils/api/authenticate'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'DELETE') {
    try {
      const article = await deleteArticle(req.query.uid as string, req.query.id as string)
      return res.status(200).json(article)
    } catch (error) {
      console.log(error)
      return sendInternalServerErrorResponse(res, error.message)
    }
  } else {
    sendNotImplementedErrorResponse(res, 'This method is not allowed.')
  }
}

export default authenticate(handler)
