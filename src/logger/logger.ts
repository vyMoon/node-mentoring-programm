import winston from 'winston';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
  ],
});

export function getTime(): string {
  const now = new Date;
  return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()} 
    ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}:${now.getMilliseconds()}}`
}