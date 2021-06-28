import express from 'express';
import { groupsController } from './groups-controller';
import { validateSchema } from '../../validation/validation';
import { createGroupSchema } from '../../validation/groups/create-schema';

export const groupsRouter = express.Router();

// groupsRouter.param(
//   'id',
//   groupsController.getGroupByIdMidleWare.bind(groupsController)
// );
groupsRouter.get('/', groupsController.get);
groupsRouter.get('/:id', groupsController.getGroupById);
groupsRouter.delete('/:id', groupsController.deleteGroupById);
groupsRouter.put('/:id', validateSchema(createGroupSchema),groupsController.updateById);
groupsRouter.post('/', validateSchema(createGroupSchema), groupsController.createGroup);
