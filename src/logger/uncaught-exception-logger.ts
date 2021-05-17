import { logger } from './logger';

export const uncaughtExceptionLogger = (err) => {
  const log = JSON.stringify({
      message: 'uncaughtException',
      error: err,
  });
  logger.error(log);
}
