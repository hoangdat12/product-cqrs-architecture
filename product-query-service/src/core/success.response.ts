import { Response } from 'express';

class SuccessResponse {
  private message: string;
  private statusCode: number;
  private metadata: {};
  constructor(message = 'Ok', metadata = {}, statusCode = 200) {
    this.message = message;
    this.statusCode = statusCode;
    this.metadata = metadata;
  }

  send(res: Response, header = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  private options: {};
  constructor(metadata = {}, message = 'Ok', options = {}) {
    super(message, metadata);
    this.options = options;
  }
}

class CREATED extends SuccessResponse {
  private options: {};
  constructor(metadata = {}, message = 'Created', options = {}) {
    super(message, metadata, 201);
    this.options = options;
  }
}

export { OK, CREATED };
