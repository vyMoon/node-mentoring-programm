import { logger, getTime } from './logger';

export const uncaughtExceptionLogger = (err) => {
  const time = getTime;
  const log = JSON.stringify({
      time,
      message: 'uncaughtException',
      error: err,
  });
  logger.error(log);
}
