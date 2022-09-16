import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier'
import { NextApiRequest, NextApiResponse } from 'next'
import { auth } from '../../lib/firebase_admin'
import { sendUnauthorizedErrorResponse } from './sendErrorResponse'

/**
 *
 * Extracts user token from request header, verifies it and set it to request data.
 * https://www.dingran.me/next-js-authentication/
 *
 * @param handler
 * @returns
 */
export function authenticate(
  handler: (req: NextApiRequest, res: NextApiResponse) => {},
): (req: NextApiRequest, res: NextApiResponse) => {} {
  return async (req, res) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return sendUnauthorizedErrorResponse(res, 'No authorization header.')
    }

    const token = authHeader.split(' ')[1]
    let decodedToken: DecodedIdToken
    try {
      decodedToken = await auth.verifyIdToken(token)
      if (!decodedToken || !decodedToken.uid)
        return sendUnauthorizedErrorResponse(res, 'Invalid token.')
      req.query.uid = decodedToken.uid
    } catch (error) {
      console.log(error.errorInfo)
      const errorCode = error.errorInfo.code
      error.status = 401
      if (errorCode === 'auth/internal-error') {
        error.status = 500
      }
      //TODO handlle firebase admin errors in more detail. https://firebase.google.com/docs/auth/admin/errors?hl=ja
      return res.status(error.status).json({ error: errorCode })
    }

    return handler(req, res)
  }
}
