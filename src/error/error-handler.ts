import { ApplicationError } from './application-error';
import { logger } from '../logger/logger';

export const errorHandler = (err, req, res, next) => {
  if (err.constructor === ApplicationError) {
      res.status(err.statusCode).json({
          error: err.errorMessage
      });
      return;
  }
  logger.error(`${err.message}, stack: ${err.stack}`)
  res.status(500).json({
      error: 'Internal Server Error'
  })
}
