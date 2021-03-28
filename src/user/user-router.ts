import express from 'express';
import { User } from './user';

const user = new User();

export const userRouter = express.Router();

userRouter.get('/', user.get.bind(user));
userRouter.get('/:id', user.getUser.bind(user));
userRouter.post('/', user.post.bind(user));
userRouter.put('/', user.put.bind(user));
userRouter.delete('/:id', user.delete.bind(user));
userRouter.delete('/', user.badReques.bind(user));
