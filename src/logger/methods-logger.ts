import { logger } from './logger';

export const methodsLogger = (req, res, next) => {
  const { method, url, body, query } = req;
  const log = JSON.stringify({
      method,
      url,
      body,
      query
  });
  logger.info(log);
  next();
}