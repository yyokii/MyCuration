/**
 * Base error class
 *
 * https://future-architect.github.io/typescript-guide/exception.html
 * https://ja.javascript.info/custom-errors
 */
export abstract class CustomBaseError extends Error {
  private error: Error | undefined

  // Message of Error interface
  message: string

  // Messsage displayed to the user
  localizedMessage: string

  constructor(e?: Error) {
    super()
    this.error = e
    this.message = e?.message ?? ''
    this.localizedMessage = e?.message ?? 'An error occurred.'

    this.describeMessage()
  }

  private describeMessage() {
    const errorType = this.constructor.name
    const errorMessage = this.message

    console.error('ErrorType: ' + errorType)
    console.error('ErrorMessage: ' + errorMessage)
  }
}

export class DBError extends CustomBaseError {
  constructor(e?: Error) {
    super(e)
    this.localizedMessage =
      'Sorry, an error occurred while processing your request. Please try again later.'
  }
}

export class OtherError extends CustomBaseError {
  constructor(e?: Error) {
    super(e)
    this.localizedMessage =
      'Sorry, an error occurred while processing your request. Please try again later.'
  }
}
