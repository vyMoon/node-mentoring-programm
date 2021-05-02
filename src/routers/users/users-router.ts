import express from 'express';
import { usersController } from './users-controller';
import { validateSchema } from '../../validation/validation';
import { putSchema } from '../../validation/users';
import { createSchema } from '../../validation/users';

export const userRouter = express.Router();

userRouter.param(
  'id',
  usersController.getUserById.bind(usersController)
);
userRouter.get(
  '/',
  usersController.get.bind(usersController)
);
userRouter.get(
  '/:id',
  usersController.getUser.bind(usersController)
);
userRouter.post(
  '/',
  validateSchema(createSchema),
  usersController.post.bind(usersController)
);
userRouter.put(
  '/:id',
  validateSchema(putSchema),
  usersController.put.bind(usersController)
);
userRouter.delete(
  '/:id',
  usersController.delete.bind(usersController)
);
