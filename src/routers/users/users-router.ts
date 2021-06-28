import express from 'express';
import { usersController } from './users-controller';
import { validateSchema } from '../../validation/validation';
import { putSchema } from '../../validation/users';
import { createSchema } from '../../validation/users';

export const userRouter = express.Router();

userRouter.param('id', usersController.getUserById);
userRouter.get('/', usersController.get);
userRouter.get('/:id', usersController.getUser);
userRouter.delete('/:id', usersController.delete);
userRouter.post('/', validateSchema(createSchema), usersController.post);
userRouter.put('/:id', validateSchema(putSchema), usersController.put);
