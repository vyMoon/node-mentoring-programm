import { getMockRes, getMockReq } from '@jest-mock/express'
import { GroupsController } from './groups-controller';
import { groupsService } from '../../services/groups/groups-service';

const mockNewGroup = {
  name: "group 4",
  permissions: [
    "DELETE",
    "WRITE",
    "SHARE"
  ]
}

const mockGroups = [
  {
    id: 1,
    name: 'group 1',
    permissions: ['READ', 'WRITE']
  },
  {
    id: 2,
    name: 'group 2',
    permissions: ['READ']
  },
  {
    id: 3,
    name: 'group 3',
    permissions: ['WRITE']
  }
];

describe('Grops Controller', () => {
  let controller;

  beforeEach(() => {
    controller = new GroupsController(groupsService)
  });

  test("getAll should return groups", async () => {
    const req = getMockReq();
    const { res, next } = getMockRes();

    jest.spyOn(groupsService, 'getAll').mockReturnValueOnce(
      Promise.resolve(mockGroups)
    )
    await controller.get(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        count: mockGroups.length,
        groups: mockGroups
      })
    );
  });

  test('getGroupById should return group', async () => {
    const req = getMockReq({ params: { id: mockGroups[0].id } });
    const { res, next } = getMockRes();
    
    jest.spyOn(groupsService, 'praseGroupId').mockReturnValueOnce(
      mockGroups[0].id
    );
    jest.spyOn(groupsService, 'getGroupById').mockReturnValueOnce(
      Promise.resolve(mockGroups[0])
    );
    
    await controller.getGroupById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        group: mockGroups[0]
      })
    );
  });

  test('deleteGroupById should delete group', async () => {
    const req = getMockReq({ params: { id: mockGroups[0].id } });
    const { res, next } = getMockRes();

    jest.spyOn(groupsService, 'deleteGroupById').mockReturnValueOnce(
      Promise.resolve(true)
    );
    
    await controller.deleteGroupById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `group id: ${mockGroups[0].id} has been deleted`
      })
    );
  });

  test('createGroup should create new group', async () => {
    const req = getMockReq({ body: mockNewGroup });
    const { res, next } = getMockRes();

    jest.spyOn(groupsService, 'isNameFree').mockReturnValueOnce(
      Promise.resolve(true)
    );
    jest.spyOn(groupsService, 'createGroup').mockReturnValueOnce(
      Promise.resolve(mockNewGroup)
    );

    await controller.createGroup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'group has been created',
        group: mockNewGroup
      })
    );
  });

  test('updateById should save new group information', async () => {
    const req = getMockReq({
      body: mockNewGroup,
      params: { id: '4'}
    });
    const { res, next } = getMockRes();

    const returnedGroup = {...mockNewGroup, id: '4'}

    jest.spyOn(groupsService, 'isNameFree').mockReturnValueOnce(
      Promise.resolve(true)
    );
    jest.spyOn(groupsService, 'changeGroup').mockReturnValueOnce(
      Promise.resolve(returnedGroup)
    );

    await controller.updateById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'ok',
        group: returnedGroup
      })
    );
  });
});