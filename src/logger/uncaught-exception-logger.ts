import { logger } from './logger';

export const uncaughtExceptionLogger = (err) => {
  const time = new Date;
  const log = JSON.stringify({
      time,
      message: 'uncaughtException',
      error: err,
  });
  logger.error(log);
}
