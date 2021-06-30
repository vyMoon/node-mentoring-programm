import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { ApplicationError } from '../error/application-error';
import { usersService } from '../services/users/users.service';

const secret = 'secret string';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { body } = req;

  try {
    if (
      !body.login 
      || !body.pass 
      || typeof body.login !== 'string' 
      || typeof body.pass !== 'string'
    ) {
      throw new ApplicationError(
        400,
        'Bad credentials',
      )
    }
    const userId = await usersService.getUserIdByCreadentials(
      body.login,
      body.pass,
    );

    const accessToke = jwt.sign({user: userId}, secret, {expiresIn: 100});

    res.status(200).json({
      access_token: accessToke,
    });

  } catch(err) {
    next(err);
  }
}

export function authGuard(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers['x-access-token'] as string;
  
  try {
    if (!token) {
      throw new ApplicationError(
        403,
        'forbidden'
      );
    }
    jwt.verify(token, secret);
    next();
  } catch(err) {
    if (err.message === 'jwt expired') {
      next(new ApplicationError(
        401,
        'Unauthorized'
      ));
      return;
    }
    if (err.message === 'invalid signature' || err.message === 'invalid token') {
      next(new ApplicationError(
        403,
        'forbidden'
      ));
      return;
    }
    next(err);
  }
}