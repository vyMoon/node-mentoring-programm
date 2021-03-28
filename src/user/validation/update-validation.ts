import * as Joi from 'joi';
import { passReg } from './password-regexp';

export const putSchema = Joi.object({
  id: Joi.number().required(),
  login: Joi.string().required(),
  password: Joi.string().required().pattern(passReg).message('password should contain number and letters'),
  age: Joi.number().min(3).max(130).required(),
  isDeleted: Joi.boolean().required()
});
