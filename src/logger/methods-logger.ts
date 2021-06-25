import { logger } from './logger';

export const methodsLogger = (req, res, next) => {
  const { method, url, body, query } = req;
  const time = new Date;
  const log = JSON.stringify({
    time,
    method,
    url,
    body,
    query
  });
  logger.info(log);
  next();
}