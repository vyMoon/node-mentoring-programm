import { logger } from './logger';

export const uncaughtExceptionLogger = (err) => {
  const time = new Date;
  const log = JSON.stringify({
      message: 'uncaughtException',
      time,
      error: err,
  });
  logger.error(log);
}
