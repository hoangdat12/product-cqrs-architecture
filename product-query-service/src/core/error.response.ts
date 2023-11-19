class ErrorResponse extends Error {
  status: any;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

class Conflict extends ErrorResponse {
  constructor(message = 'Conflict', status = 409) {
    super(message, status);
  }
}

class BadRequest extends ErrorResponse {
  constructor(message = 'Bad Request', status = 400) {
    super(message, status);
  }
}

class Forbidden extends ErrorResponse {
  constructor(message = 'Forbidden', status = 403) {
    super(message, status);
  }
}

class InternalServerError extends ErrorResponse {
  constructor(message = 'Internal Server Error', status = 500) {
    super(message, status);
  }
}

class NotFound extends ErrorResponse {
  constructor(message = 'Not Found', status = 400) {
    super(message, status);
  }
}

export { Conflict, BadRequest, Forbidden, InternalServerError, NotFound };
