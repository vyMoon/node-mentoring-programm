import { Users } from '../../models/users/users.model';
import { Op } from 'sequelize';

class UserService {
  private readonly usersModel;

  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  createUser(userInformation) {
    return this.usersModel.create(
      userInformation
    )
    .then(response => this.mapperUerInformation(response))
  }
  
  getAllActiveUsers() {
    return  this.usersModel.findAll({
      order: [ [ 'id', 'ASC' ]],
      attributes: [
        'id', 'login', 'password', 'age'
      ],
      where: {
        is_deleted: false,
      }
  })
  .then(res => res.map(this.mapperUerInformation))
  }

  getUserById(id) {
    return this.usersModel.findAll({
      limit: 1,
      attributes: [
        'id', 'login', 'password', 'age'
      ],
      where: {
        is_deleted: false,
        id: id,
      }
    })
    .then(res => res.map(this.mapperUerInformation))
    .then(res => res[0])
  }

  getUserByLogin(login) {
    return this.usersModel.findAll({
      where: {
        login: login,
      },
    })
  }

  getActiveUSersByLoginString(string, limit) {
    return this.usersModel.findAll({
      limit: limit,
      attributes: [ 'id', 'login', 'password', 'age' ],
      where: {
        is_deleted: false,
        login: {
          [Op.like]: `%${string}%`,
        }
      }
    })
    .then(res => res.map(this.mapperUerInformation))
  }

  getNexId() {
    return this.usersModel.findOne({
      attributes: [ 'id', 'login', 'password', 'age' ],
      order: [ [ 'id', 'DESC' ]],
    }).then(response => {
      const id = response.getDataValue('id');
      return id + 1;
    })
  }

  updateUser(id, newUserInformation) {
    return this.usersModel.update(
      {
        login: newUserInformation.login,
        age: newUserInformation.age,
        password: newUserInformation.password
      },
      {
        where: {
          id: id,
      }
    })
  }

  deleteUserByIdSoft(id) {
    return this.usersModel.update(
      {
        is_deleted: true
      },
      {
        where: {
          id: id,
          is_deleted: false,
        }
      }
    )
  }

  private mapperUerInformation(user) {
    return {
      id: user.getDataValue('id'),
      login: user.getDataValue('login'),
      password: user.getDataValue('password'),
      age: user.getDataValue('age')
    }
  }
}

export const usersService = new UserService(Users);
