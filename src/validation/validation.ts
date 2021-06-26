import { Request, Response, NextFunction, RequestHandler  } from 'express';
import { ApplicationError } from '../error/application-error';

export function validateSchema(schema): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const{ error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false
    });
    if (error && error.isJoi) {
      res.status(400).json({
        error: 'Bad Request',
        message: errorResponse(error.details)
      });
      return;
    }
    next();
  }
}

function errorResponse(errors): {[key: string]: string} {
  return errors.reduce((response, error) => {
    response[error.path[0]] = error.message;
    return response;
  }, {} )
}
