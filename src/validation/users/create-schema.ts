import * as Joi from 'joi';
import { passReg } from './password-regexp'; 

export const createSchema = Joi.object({
  login: Joi.string().required(),
  password: Joi.string().required().pattern(passReg).message('password should contain number and letters'),
  age: Joi.number().min(3).max(130)
});
