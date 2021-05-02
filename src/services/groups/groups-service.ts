import { Groups } from '../../models/groups/groups.model';
import { Op } from 'sequelize';

class GroupsService {
  private readonly groups;

  constructor(groupsModel) {
    this.groups = groupsModel;
  }

  getAll() {
    return this.groups.findAll({
      attributes: [
        'id', 'name', 'permissions'
      ],
      order: [['id', 'ASC']],
    })
    .then(groups => groups.map(this.mapGroupInfomation))
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
    })
    return groupsArray[0];
  }

  getGroupbyName(name: string) {
    return this.groups.findAll({
      attributes: [
        'id', 'name', 'permissions'
      ],
      limit: 1,
      where: {
        name: name,
      }
    })
  }

  async changeGroup(groupInstance, newGroupInformation) {
    groupInstance.name = newGroupInformation.name;
    groupInstance.permissions = newGroupInformation.permissions;
    const response = await groupInstance.save();
    return this.mapGroupInfomation(response)
  }

  async isNameFree(name: string, id: string) {
    const response = await this.groups.findAll({
      attributes: [
        'id', 'name', 'permissions'
      ],
      limit: 1,
      where: {
        name: name,
        id: {
          [Op.not]: id
        }
      }
    })
    return response.length === 0;
  }

  async createGroup(group) {
    group.id = await this.getNexId();
  
    return this.groups.create(
      group
    );
  }

  async getNexId() {
    const response = await this.groups.findOne({
      attributes: [ 'id' ],
      order: [ [ 'id', 'DESC' ]],
    })

    const id = response
      ? response.getDataValue('id') + 1
      : 1 ;
    return id;
  }

  praseGroupId(id: string): number | false {
    const groupId = parseInt(id);
    if(isNaN(groupId)) {
      return false;
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
