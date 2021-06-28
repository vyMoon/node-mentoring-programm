import { Groups } from '../../models/groups/groups.model';
import { Op } from 'sequelize';
import { ApplicationError } from '../../error/application-error';

export class GroupsService {
  private readonly groups;

  constructor(groupsModel) {
    this.groups = groupsModel;
  }

  async getAll() {
    const groups = await this.groups.findAll({
      attributes: [
        'id', 'name', 'permissions'
      ],
      order: [['id', 'ASC']],
    });

    return groups.map(this.mapGroupInfomation);
  }

  async getGroupById(id) {
    const groupsArray = await this.groups.findAll({
      attrigutes: [
        'id', 'name', 'permissions'
      ],
      limit: 1,
      where: {
        id: id,
      }
    });

    if (groupsArray.length === 0) {
      throw new ApplicationError(404, `there is no group with id ${id}`);
    }
    return this.mapGroupInfomation(groupsArray[0]);
  }

  async changeGroup(groupId, newGroupInformation) {
    console.log(groupId)
    const id = this.praseGroupId(groupId);
    const groupsArray = await this.groups.findAll({
      attrigutes: [
        'id', 'name', 'permissions'
      ],
      limit: 1,
      where: {
        id: id,
      }
    });
    if (groupsArray.length === 0) {
      throw new ApplicationError(
        404, `there is no group with id ${groupId}`
      )
    }
    const selectedGroup = groupsArray[0];
    selectedGroup.name = newGroupInformation.name;
    selectedGroup.permissions = newGroupInformation.permissions;
    const savedGroup = await selectedGroup.save();
    return this.mapGroupInfomation(savedGroup);
  }

  async isNameFree(name: string, id?: string) {
    const whereOptions: any = {};
    whereOptions.name = name;
    if (id) {
      whereOptions.id = {
        [Op.not]: id
      }
    }
    const response = await this.groups.findAll({
      attributes: [
        'id', 'name', 'permissions'
      ],
      limit: 1,
      where: whereOptions,
    });
    if (response.length !== 0) {
      throw new ApplicationError(409, `name: '${name}' is taken`);
    }
    return response.length === 0;
  }

  async createGroup(group) {
    group.id = await this.getNexId();
  
    return this.groups.create(
      group
    );
  }

  async getNexId(): Promise<number> {
    const response = await this.groups.findOne({
      attributes: [ 'id' ],
      order: [ [ 'id', 'DESC' ]],
    })

    const id = response
      ? response.getDataValue('id') + 1
      : 1 ;
    return id;
  }

  async deleteGroupById(groupId: string): Promise<boolean> {
    const id = this.praseGroupId(groupId);
    const groupsArray = await this.groups.findAll({
      attrigutes: [
        'id', 'name', 'permissions'
      ],
      limit: 1,
      where: {
        id: id,
      }
    });

    if (groupsArray.length === 0) {
      throw new ApplicationError(404, `there is no group with id ${id}`);
    }

    await groupsArray[0].destroy();

    return true;
  }

  praseGroupId(id: string): number | false {
    const groupId = parseInt(id);
    if(isNaN(groupId)) {
      throw new ApplicationError(400, `id: ${id}, is not correct`);
    }
    return groupId;
  }

  mapGroupInfomation(rawItemData) {
    return {
      id: rawItemData.getDataValue('id'),
      name: rawItemData.getDataValue('name'),
      permissions: rawItemData.getDataValue('permissions'),
    }
  }
}

export const groupsService = new GroupsService(Groups);
