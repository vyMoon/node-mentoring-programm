import { logger, getTime } from './logger';

export const unhandledRejectionLogger = (reason: unknown, promise: unknown): void => {
  const time = getTime();
  const log = JSON.stringify({
    time,
    message: 'unhandledRejection',
    promise,
    reason
  });
  logger.error(log);
}
