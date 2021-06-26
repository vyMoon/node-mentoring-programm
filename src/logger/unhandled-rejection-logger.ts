import { logger, getTime } from './logger';

export const unhandledRejectionLogger = (reason, promise) => {
  const time = getTime();
  const log = JSON.stringify({
    time,
    message: 'unhandledRejection',
    promise,
    reason
  });
  logger.error(log);
}
