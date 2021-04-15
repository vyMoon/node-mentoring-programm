import { Users } from '../../models/users/users.model';
import { Op } from 'sequelize';
// import { response } from 'express';

class UserService {
  private readonly usersModel;

  constructor(usersModel) {
    this.usersModel = usersModel;
  }

  createUser(userInformation) {
    return this.usersModel.create(
      userInformation
    )
    .then(response => this.getUserData(response))
  }
  
  getAllActiveUsers() {
    return  this.usersModel.findAll({
      attributes: [
        'id', 'login', 'password', 'age'
      ],
      where: {
        is_deleted: false,
      }
  })
  .then(res => res.map(this.getUserData))
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
    .then(res => res.map(this.getUserData))
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
    .then(res => res.map(this.getUserData))
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

  private getUserData(user) {
    return {
      id: user.getDataValue('id'),
      login: user.getDataValue('login'),
      password: user.getDataValue('password'),
      age: user.getDataValue('age')
    }
  }
}

export const usersService = new UserService(Users);
