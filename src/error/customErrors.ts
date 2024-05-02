import { HttpStatuses } from ".."

abstract class CustomError extends Error {
  abstract statusCode: number
  abstract kind: string

  constructor(message: string) {
    super(message)
  }

  /**
   * Returns a string representation of the error
   * should be used for logging
   * @returns {string}
  */
  public toString(): string {
    return `${this.kind}: ${this.message}${this.stack ? `\n${this.stack}` : ""}`
  }

  /**
   * Returns a lambda response object
   * should be used for returning errors in lambda functions
   * after a "instanceof" check -> if (err instanceof CustomError) ...
   * @returns {{statusCode: number, body: string}}
  */
  public toLambdaResponse(): { statusCode: number, body: string } {
    return {
      statusCode: this.statusCode,
      body: JSON.stringify({ message: this.message })
    }
  }
}

class BadRequestError extends CustomError {
  statusCode = HttpStatuses.badRequest
  kind = "Bad Request Error"
}

class IntegrationError extends CustomError {
  statusCode = HttpStatuses.integrationError
  kind = "Integration Error"
  protected customMessage: string

  constructor(protected integration: string, protected errorMessage?: string) {
    super(errorMessage ?? `Could not integration with ${integration}`)
    this.customMessage = errorMessage ?? `Could not integration with ${integration}`
  }
}

class InternalError extends CustomError {
  statusCode = HttpStatuses.internalError
  kind = "Internal Error"

  constructor(error: unknown) {
    super("An internal error occurred")

    if (typeof error === "string") {
      this.message = error
    }
    else if (typeof error === "object" && "message" in error! && "statusCode" in error!) {
      this.message = error.message as string
      this.statusCode = error.statusCode as HttpStatuses
    }
    else if (typeof error === "object" && "message" in error!) {
      this.message = error.message as string
    }
  }
}

class NotFoundError extends CustomError {
  statusCode = HttpStatuses.notFound
  kind = "Not Found Error"

  constructor(message: string) {
    super(message)
  }
}

class UnauthorizedError extends CustomError {
  statusCode = HttpStatuses.unauthorized
  kind = "Unauthorized Error"

  constructor(message: string) {
    super(message)
  }
}

export {
  BadRequestError,
  CustomError,
  IntegrationError,
  InternalError,
  NotFoundError,
  UnauthorizedError,
}
