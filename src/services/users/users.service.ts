import { Users } from '../../models/users/users.model';
import { Op, Sequelize } from 'sequelize';
import { ApplicationError } from '../../error/application-error';
import { UserForFrontEnd } from '../../types/users/user-for-frontend.interface';

export class UserService {
  private readonly usersModel;

  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  async createUser(userInformation) {
    const response = await this.usersModel.create(
      userInformation
    )
    return this.mapperUerInformation(response);
  }

  async getAllActiveUsers() {
    const users = await this.usersModel.findAll({
      order: [ [ 'id', 'ASC' ]],
      attributes: [
        'id', 'login', 'password', 'age'
      ],
      where: {
        is_deleted: false,
      }
    });
    return users.map(user => this.mapperUerInformation(user));
  }

  praseUserId(id: string): number {
    const userId = parseInt(id);
    if(isNaN(userId)) {
      throw new ApplicationError(400, `id: ${id} isn't correct`);
    }
    return userId;
  }

  async getUserById(userId: string) {
    const id = this.praseUserId(userId);
    const usersArray = await this.usersModel.findAll({
      limit: 1,
      attributes: [
        'id', 'login', 'password', 'age'
      ],
      where: {
        is_deleted: false,
        id: id,
      }
    });

    if (usersArray.length === 0) {
      throw new ApplicationError(
        404,
        `there is no user with id: ${id}`
      );
    }

    return this.mapperUerInformation(usersArray[0]);
  }

  getUserByLogin(login) {
    return this.usersModel.findAll({
      where: {
        login: login,
      },
    })
  }

  async isLoginFree(login: string): Promise<boolean> {
    const users = await this.getUserByLogin(login);
    if (users.length !==0) {
      throw new ApplicationError(409, `login: ${login} is taken`);
    }
    return users.length === 0; 
  }

  async canUserBeUpdated(login, id): Promise<boolean> {
    const response = await this.usersModel.findAll({
      attributes: [ 'id', 'login', 'password', 'age' ],
      limit: 1,
      where: {
        login: login,
        id: {
          [Op.not]: id
        }
      }
    })
    return response.length === 0;
  }

  async getActiveUSersByLoginString(string, limit): Promise<UserForFrontEnd[]> {
    const users = await this.usersModel.findAll({
      limit: limit,
      attributes: [ 'id', 'login', 'password', 'age' ],
      where: {
        is_deleted: false,
        login: {
          [Op.like]: `%${string}%`,
        }
      }
    });
    return users.map(this.mapperUerInformation);
  }

  async getAutoSuggestCount(string): Promise<number> {
    const fieldName = 'total_autosuggest';
    const response = await this.usersModel.findAll({
      attributes: [
        [Sequelize.fn('COUNT', Sequelize.col('login')), fieldName]
      ],
      where: {
        is_deleted: false,
        login: {
          [Op.like]: `%${string}%`,
        }
      }
    });
    return response[0].getDataValue(fieldName)
  }

  async getNexId(): Promise<number> {
    const lastUser = await this.usersModel.findOne({
      attributes: [ 'id', 'login', 'password', 'age' ],
      order: [ [ 'id', 'DESC' ]],
    });

    return lastUser.getDataValue('id') + 1;
  }

  async getNextUSerInformation(user): Promise<UserForFrontEnd> {
    user.is_deleted = false;
    user.id = await this.getNexId();
    return user;
  }

  async updateUser(userId, newInformation): Promise<UserForFrontEnd> {
    const id = this.praseUserId(userId);
    const usersArray = await this.usersModel.findAll({
      limit: 1,
      attributes: [
        'id', 'login', 'password', 'age'
      ],
      where: {
        is_deleted: false,
        id: id,
      }
    });

    if (usersArray.length === 0) {
      throw new ApplicationError(
        404,
        `there is no user with id: ${id}`
      );
    }

    const userInstance = usersArray[0];

    userInstance.login = newInformation.login;
    userInstance.age = newInformation.age;
    userInstance.password = newInformation.password;
    const updatedUSerInformation = await userInstance.save();
    if (!updatedUSerInformation) {
      throw new Error('user can not be updated')
    }
    return this.mapperUerInformation(updatedUSerInformation)
  }

  async deleteUser(userId: string): Promise<UserForFrontEnd> {
    const id = this.praseUserId(userId);
    const usersArray = await this.usersModel.findAll({
      limit: 1,
      attributes: [
        'id', 'login', 'password', 'age'
      ],
      where: {
        is_deleted: false,
        id: id,
      }
    });

    if (usersArray.length === 0) {
      throw new ApplicationError(
        404,
        `there is no user with id: ${id}`
      );
    }

    const userInstance = usersArray[0];
    userInstance.is_deleted = true;
    const user = await userInstance.save();
    if (!user) {
      throw new Error('user can not be deleted');
    }

    return this.mapperUerInformation(user);
  }

  async getUserIdByCreadentials(login: string, password: string): Promise<number> {
    const userId = await this.usersModel.findOne({
      attributes: [ 'id'],
      where: {
        login,
        password,
      }
    });

    if (!userId) {
      throw new ApplicationError(
        403,
        'credential are not correct'
      );
    }

    return userId.getDataValue('id');
  }

  mapperUerInformation(user) {
    return {
      id: user.getDataValue('id'),
      login: user.getDataValue('login'),
      password: user.getDataValue('password'),
      age: user.getDataValue('age')
    }
  }
}

export const usersService = new UserService(Users);
