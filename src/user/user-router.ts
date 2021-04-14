import express from 'express';
import { user } from './user';
import { validateSchema } from '../validation/validation';
import { putSchema } from './validation';
import { createSchema } from './validation';

export const userRouter = express.Router();

userRouter.get('/', user.get.bind(user));
userRouter.get('/:id', user.getUser.bind(user));
userRouter.post('/', validateSchema(createSchema), user.post.bind(user));
userRouter.put('/', validateSchema(putSchema), user.put.bind(user));
userRouter.delete('/:id', user.delete.bind(user));
userRouter.delete('/', user.badReques.bind(user));
