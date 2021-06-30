import { Request, Response } from 'express';
import { ApplicationError } from './application-error';
import { logger, getTime } from '../logger/logger';

export const errorHandler = (
    err: Error | ApplicationError,
    req: Request,
    res: Response
): void => {
  if (err.constructor === ApplicationError) {
      res.status(err.statusCode).json({
          error: err.errorMessage
      });
      return;
  }
  logger.error(`${getTime()} ${err.message}, stack: ${err.stack}`)
  res.status(500).json({
      error: 'Internal Server Error'
  })
}
