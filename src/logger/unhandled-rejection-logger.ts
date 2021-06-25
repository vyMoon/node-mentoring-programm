import { logger } from './logger';

export const unhandledRejectionLogger = (reason, promise) => {
  const time = new Date;
  const log = JSON.stringify({
    time,
    message: 'unhandledRejection',
    promise,
    reason
  });
  logger.error(log);
}
