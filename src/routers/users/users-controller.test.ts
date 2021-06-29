import { getMockRes, getMockReq } from '@jest-mock/express'
import { UsersController } from './users-controller';
import { usersService } from '../../services/users/users.service';

const mockNewUser = {
    login: 'login 1',
    password: 'pass 1',
    age: 12,
}

const mockUsers = [
  {
    id: '1',
    login: 'login 1',
    password: 'pass 1',
    age: 12,
  },
  {
    id: '2',
    login: 'login 2',
    password: 'pass 2',
    age: 12,
  },
  {
    id: '3',
    login: 'login 3',
    password: 'pass 3',
    age: 12,
  },
  {
    id: '4',
    login: 'login 4',
    password: 'pass 4',
    age: 12,
  },
  {
    id: '5',
    login: 'login 5',
    password: 'pass 5',
    age: 12,
  },
  {
    id: '6',
    login: 'login 6',
    password: 'pass 6',
    age: 12,
  }
];

describe('Users Controller', () => {
  let controller;

  beforeEach(() => {
    controller = new UsersController(usersService)
  });

  test("get should return all users if there is no querry.login", async () => {
    const req = getMockReq();
    const { res, next } = getMockRes();

    jest.spyOn(usersService, 'getAllActiveUsers').mockReturnValueOnce(
      Promise.resolve(mockUsers)
    );
    await controller.get(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        count: mockUsers.length,
        users: mockUsers
      })
    );
  });

  test('get should run next with an error if query limit is nt a number', async () => {
    const req = getMockReq({query: {login: 'log', limit: 'not a number'}});
    const { res, next } = getMockRes();

    await controller.get(req, res, next);

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining(new Error)
    );
  });

  test('post should create new user', async () => {
    const nextUserInformation = {...mockNewUser, id: 2, is_deleted: false};
    const req = getMockReq({body: mockNewUser});
    const { res, next } = getMockRes();

    jest.spyOn(usersService, 'isLoginFree').mockReturnValueOnce(
      Promise.resolve(true)
    );
    jest.spyOn(usersService, 'isLoginFree').mockReturnValueOnce(
      Promise.resolve(true)
    );
    jest.spyOn(usersService, 'getNextUSerInformation').mockReturnValueOnce(
      Promise.resolve({...mockNewUser, id: '2', is_deleted: false})
    );
    jest.spyOn(usersService, 'createUser').mockReturnValueOnce(
      Promise.resolve(nextUserInformation)
    );

    await controller.post(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'user created',
        user: nextUserInformation
      })
    );
  });

  test('getUser should return user information', async () => {
    const req = getMockReq({params: {id: 1}});
    const { res, next } = getMockRes();

    jest.spyOn(usersService, 'getUserById').mockReturnValueOnce(
      Promise.resolve(mockUsers[0])
    );

    await controller.getUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        user: mockUsers[0]
      })
    );
  });

  test('delete should delete user', async () => {
    const req = getMockReq({params: {id: 1}});
    const { res, next } = getMockRes();

    jest.spyOn(usersService, 'deleteUser').mockReturnValueOnce(
      Promise.resolve(mockUsers[0])
    );

    await controller.delete(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'user has been deleted',
        user: mockUsers[0]
      })
    );
  });

  test('put should update user', async () => {
    const req = getMockReq({
      params: {id: 1},
      body: mockNewUser,
    });
    const { res, next } = getMockRes();

    jest.spyOn(usersService, 'canUserBeUpdated').mockReturnValueOnce(
      Promise.resolve(true)
    );
    jest.spyOn(usersService, 'updateUser').mockReturnValueOnce(
      Promise.resolve(mockUsers[0])
    );

    await controller.put(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: `user id: ${mockUsers[0].id} has been successfully updated`,
        user: mockUsers[0]
      })
    );
  });
});