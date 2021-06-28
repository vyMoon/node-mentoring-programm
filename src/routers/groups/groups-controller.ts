import { Request, Response } from 'express';
import { groupsService } from '../../services/groups/groups-service';
import { ApplicationError } from '../../error/application-error';

export interface RequesWithSelectedGroup extends Request {
  selectedGroup: any;
}

export class GroupsController {
  private readonly groupsService;

  constructor(groupsService) {
    this.groupsService = groupsService;
  }

  get = async (req: Request, res: Response, next) => {
    try {
      const groups = await this.groupsService.getAll();
      res.status(200).json({
        count: groups.length,
        groups: groups
      })
    } catch(err) {
      next(err);
    }
  }

  getGroupById = async (req: Request, res: Response, next) => {
    try {
      const { params } = req;
      const groupId = this.groupsService.praseGroupId(params.id);
      const group = await this.groupsService.getGroupById(groupId);
  
      res.status(200).json({
        group: group,
      });
    } catch(err) {
      next(err);
    }
  }

  getGroupByIdMidleWare = async (
    req: RequesWithSelectedGroup,
    res: Response,
    next,
    id: string
  ) => {
    try {
      const groupId = this.groupsService.praseGroupId(id);
      req.selectedGroup = await this.groupsService.getGroupById(groupId);
    } catch(err) {
      next(err);
    }
    next();
  }

  async deleteGroupById(req: Request, res: Response, next) {
    try {
      const { params } = req;

      await this.groupsService.deleteGroupById(params.id);

      res.status(200).json({
        message: `group id: ${params.id} has been deleted`
      });
    } catch(err) {
      next(err);
    }
  }

  updateById = async (req: Request, res: Response, next) => {
    try {
      const { params, body } = req;
      await this.groupsService.isNameFree(body.name, params.id);
      const updatedGroup = await this.groupsService.changeGroup(
        params.id, body
      );
  
      res.status(200).json({
        message: 'ok',
        group: updatedGroup,
      });
    } catch(err) {
      next(err);
    }
  }

  createGroup = async (req: Request, res: Response, next) => {
    const {body} = req;
    try {
      await this.groupsService.isNameFree(body.name);
      const newGroup = await this.groupsService.createGroup(body);

      res.status(200).json({
        message: 'group has been created',
        group: newGroup
      });
    } catch(err) {
      next(err);
    }
  }
}

export const groupsController = new GroupsController(groupsService);
