import { NextFunction, Response } from 'express';

export const catchError = (
  err: any,
  _: any,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  const statusCode = err.status || 500;
  return res.status(statusCode).json({
    status: 'Error',
    code: statusCode,
    message: err.message || 'Internal Server Error!',
  });
};
