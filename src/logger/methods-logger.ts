import { logger, getTime } from './logger';

export const methodsLogger = (req, res, next) => {
  const { method, url, body, query } = req;
  const time = getTime();
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