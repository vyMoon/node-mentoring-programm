import { Request, Response } from 'express';
import { groupsService } from '../../services/groups/groups-service';
import { ApplicationError } from '../../error/application-error';

interface RequesWithSelectedGroup extends Request {
  selectedGroup: any;
}

class GroupsController {
  private readonly groupsService;

  constructor(groupsService) {
    this.groupsService = groupsService;
  }

  async get(req: Request, res: Response, next) {
    throw new Error('error')
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

  getGroupById(req: RequesWithSelectedGroup, res: Response, next) {
    try {
      if(!req.selectedGroup) {
        throw new ApplicationError(
          404,
          `there is no group with id ${req.params.id}`
        );
      }
      res.status(200).json({
        group: this.groupsService.mapGroupInfomation(req.selectedGroup),
      });
    } catch(err) {
      next(err);
    }
  }

  async getGroupByIdMidleWare(
    req: RequesWithSelectedGroup,
    res: Response,
    next,
    id: string
  ) {
    try {
      const groupId = this.groupsService.praseGroupId(id);
      req.selectedGroup = await this.groupsService.getGroupById(groupId);
    } catch(err) {
      next(err);
    }
    next();
  }

  async deleteGroupById(req: RequesWithSelectedGroup, res: Response, next) {
    try {
      if (!req.selectedGroup) {
        throw new ApplicationError(
          404,
          `there is no group with id ${req.params.id}`
        );
      }
      await req.selectedGroup.destroy();
      res.status(200).json({
        message: `group id: ${req.params.id} has been deleted`
      });
    } catch(err) {
      next(err);
    }
  }

  async updateById(req: RequesWithSelectedGroup, res: Response, next) {
    const { params, body, selectedGroup } = req;

    try {
      await this.groupsService.isNameFree(body.name, params.id);

      const updatedGroup = await groupsService.changeGroup(
        selectedGroup, body
      );
  
      res.status(200).json({
        message: 'ok',
        group: updatedGroup,
      });

    } catch(err) {
      next(err);
    }
  }

  async createGroup(req: Request, res: Response, next) {
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
