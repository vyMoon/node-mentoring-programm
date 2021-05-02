import { Users } from '../../models/users/users.model';
import { Op, Sequelize } from 'sequelize';

class UserService {
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

  praseGroupId(id: string): number | false {
    const userId = parseInt(id);
    if(isNaN(userId)) {
      return false;
    }
    return userId;
  }

  async getUserById(id) {
    const usersArray = await this.usersModel.findAll({
      limit: 1,
      attributes: [
        'id', 'login', 'password', 'age'
      ],
      where: {
        is_deleted: false,
        id: id,
      }
    })
    return usersArray[0];
  }

  getUserByLogin(login) {
    return this.usersModel.findAll({
      where: {
        login: login,
      },
    })
  }

  async isLoginFree(login: string) {
    const users = await this.getUserByLogin(login);
    return users.length === 0; 
  }

  async canUserBeUpdated(login, id) {
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

  async getActiveUSersByLoginString(string, limit) {
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

  async getAutoSuggestCount(string) {
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

  async getNexId() {
    const lastUser = await this.usersModel.findOne({
      attributes: [ 'id', 'login', 'password', 'age' ],
      order: [ [ 'id', 'DESC' ]],
    });

    return lastUser.getDataValue('id') + 1;
  }

  async getNextUSerInformation(user) {
    user.is_deleted = false;
    user.id = await this.getNexId();
    return user;
  }

  async updateUser(userInstance, newInformation) {
    userInstance.login = newInformation.login;
    userInstance.age = newInformation.age;
    userInstance.password = newInformation.password;
    const response = await userInstance.save();

    return this.mapperUerInformation(response)
  }

  async deleteUser(userInstance) {
    userInstance.is_deleted = true;
    const user = await userInstance.save();
    return this.mapperUerInformation(user);
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
