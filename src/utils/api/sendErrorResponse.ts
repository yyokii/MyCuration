import { NextApiResponse } from 'next'

export function sendErrorResponse(response: NextApiResponse, message: string): void {
  response.status(400).send(message)
}
