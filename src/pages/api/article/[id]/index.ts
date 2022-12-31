import { NextApiRequest, NextApiResponse } from 'next'
import {
  sendInternalServerErrorResponse,
  sendNotImplementedErrorResponse,
} from '../../../../utils/api/sendErrorResponse'
import { authenticate } from '../../../../utils/api/authenticate'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // TODO: 更新処理の追加
  sendNotImplementedErrorResponse(res, 'This method is not allowed.')
}

export default authenticate(handler)
