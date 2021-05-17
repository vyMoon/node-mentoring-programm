import { logger } from './logger';

export const unhandledRejectionLogger = (reason, promise) => {
  const log = JSON.stringify({
      message: 'unhandledRejection',
      promise,
      reason
  });
  logger.error(log);
}
