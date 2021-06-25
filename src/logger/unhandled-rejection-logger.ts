import { logger } from './logger';

export const unhandledRejectionLogger = (reason, promise) => {
  const time = new Date;
  const log = JSON.stringify({
      message: 'unhandledRejection',
      time,
      promise,
      reason
  });
  logger.error(log);
}
