import express from 'express';
import { groupsController } from './groups-controller';
import { validateSchema } from '../../validation/validation';
import { createGroupSchema } from '../../validation/group/create-schema';

// use router.param insted of all

export const groupsRouter = express.Router();
// groupsRouter.all(
//   '/:id',
//   groupsController.getGroupByIdMidleWare.bind(groupsController)
// );
groupsRouter.param(
  'id',
  groupsController.getGroupByIdMidleWare.bind(groupsController)
);
groupsRouter.get(
  '/',
  groupsController.get.bind(groupsController)
);
groupsRouter.get(
  '/:id',
  groupsController.getGroupById.bind(groupsController)
);
groupsRouter.delete(
  '/:id',
  groupsController.deleteGroupById.bind(groupsController)
);
groupsRouter.put(
  '/:id',
  validateSchema(createGroupSchema),
  groupsController.updateById.bind(groupsController)
);
groupsRouter.post(
  '/',
  validateSchema(createGroupSchema),
  groupsController.createGroup.bind(groupsController)
)