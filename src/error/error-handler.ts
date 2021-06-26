import { ApplicationError } from './application-error';
import { logger, getTime } from '../logger/logger';

export const errorHandler = (err, req, res, next) => {
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
