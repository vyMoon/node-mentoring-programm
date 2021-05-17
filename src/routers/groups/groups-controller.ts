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

  get(req: Request, res: Response): void {
    // throw new ApplicationError(400, 'error message', 'method name')
    this.groupsService.getAll()
    .then(response => {
      res.status(200).json({
        count: response.length,
        groups: response
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err.message,
      })
    });
  }

  getGroupById(req: RequesWithSelectedGroup, res: Response) {
    if (req.selectedGroup) {
      res.status(200).json({
        group: this.groupsService.mapGroupInfomation(req.selectedGroup),
      })
      return;
    } 
    res.status(404).json({
      error: `there is no group with id ${req.params.id}`
    });
  }

  async getGroupByIdMidleWare(req: RequesWithSelectedGroup, res: Response, next, id: string) {
    const groupId = this.groupsService.praseGroupId(id);

    if(!groupId) {
      res.status(400).json({
        error: `goup id: ${id} isn't correct`
      });
      return;
    }

    const group = await this.groupsService.getGroupById(groupId)
    if (!group) {
      res.status(404).json({
        error: `there is no group with id ${groupId}`
      });
      return;
    }

    req.selectedGroup = group;
    next();
  }

  async deleteGroupById(req: RequesWithSelectedGroup, res: Response, next) {
    // if (!req.selectedGroup) {
    //   res.status(404).json({
    //     error: `there is no group with id ${req.params.id}`
    //   });
    //   return;
    // }
    // await req.selectedGroup.destroy();
    // res.status(200).json({
    //   message: `group id: ${req.params.id} has been deleted`
    // });

    next(new ApplicationError(501, 'mesage', 'method'))
  }

  async updateById(req: RequesWithSelectedGroup, res) {
    const { params, body, selectedGroup } = req;
  
    const isNameFree = await this.groupsService.isNameFree(body.name, params.id);

    if (!isNameFree) {
      res.status(400).json({
        error: `name ${body.name} id taken`
      });
      return;
    }

    const response = await groupsService.changeGroup(
      selectedGroup, body
    );

    res.status(200).json({
      message: 'ok',
      group: response,
    });
  }

  async createGroup(req: Request, res: Response) {
    const {body} = req;
    const isNameFree = await this.groupsService.isNameFree(body.name);
    if (!isNameFree) {
      res.status(409).json({
        error: `name ${body.nema} is taken`
      });
      return;
    }
    const response = await this.groupsService.createGroup(body);
    res.status(200).json({
      message: 'user have been created',
      group: response
    });
  }
}

export const groupsController = new GroupsController(groupsService);
