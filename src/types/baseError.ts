export abstract class CustomBaseError extends Error {
  private error: Error | undefined
  message: string
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
