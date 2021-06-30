import { logger, getTime } from './logger';

export const uncaughtExceptionLogger = (err: Error): void => {
  const time = getTime;
  const log = JSON.stringify({
      time,
      message: 'uncaughtException',
      error: err,
  });
  logger.error(log);
}
