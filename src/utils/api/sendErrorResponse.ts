import { NextApiResponse } from 'next'

export function sendBadRequestErrorResponse(response: NextApiResponse, message: string): void {
  response.status(400).send(`Bad Request.` + ` ` + message)
}

export function sendUnauthorizedErrorResponse(response: NextApiResponse, message: string): void {
  response.status(401).send(`Unauthorized.` + ` ` + message)
}

export function sendNotFoundErrorResponse(response: NextApiResponse, message: string): void {
  response.status(404).send(`Not Found.` + ` ` + message)
}

export function sendInternalServerErrorResponse(response: NextApiResponse, message: string): void {
  response.status(500).send(`Internal Server Error.` + ` ` + message)
}

export function sendNotImplementedErrorResponse(response: NextApiResponse, message: string): void {
  response.status(500).send(`Not Implemented.` + ` ` + message)
}
