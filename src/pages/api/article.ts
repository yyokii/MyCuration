import { NextApiRequest, NextApiResponse } from 'next'
import {
  sendInternalServerErrorResponse,
  sendNotImplementedErrorResponse,
} from '../../utils/api/sendErrorResponse'
import { createArticle } from '../../lib/db-admin'
import { authenticate } from '../../utils/api/authenticate'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const body = JSON.parse(JSON.stringify(req.body))
      const article = await createArticle(
        req.query.uid as string,
        body.contentURL,
        body.comment,
        body.tagIDs,
        body.ogTitle,
        body.ogDescription,
        body.ogSiteName,
      )
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
