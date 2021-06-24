import * as jwt from 'jsonwebtoken';
import { ApplicationError } from '../error/application-error';
import { usersService } from '../services/users/users.service';

const secret = 'secret string';

export async function login(req, res, next) {
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

export function authGuard(req, res, next) {
  const token: string | undefined = req.headers['x-access-token'];
  
  try {
    if (!token) {
      throw new ApplicationError(401, 'Unauthorized')
    }
    const isCredetialsCorrect = jwt.verify(token, secret);
    console.log(isCredetialsCorrect);
    next();
  } catch(err) {
    if (err.message === 'jwt expired') {
      next(new ApplicationError(
        403,
        'forbidden'
      ));
    }
    if (err.message === 'invalid signature') {
      next(new ApplicationError(
        401,
        'Unauthorized'
      ));
    }
    next(err);
  }
}