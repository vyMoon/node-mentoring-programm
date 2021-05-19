import { Request, Response } from 'express';
import { AutoSuggest } from '../../types/users/autosuggest.interface';
import { usersService } from '../../services/users/users.service';
import { ApplicationError } from '../../error/application-error';

interface RequestWithSelectedUser extends Request {
  selectedUser?: any;
}

class UsersController {
  private readonly userService;

  constructor(userService) {
    this.userService = userService;
  }

  get(req: Request, res: Response, next): void {
    const { query } = req;
    if (query.login) {
      this.getAutoSuggestUsers(req, res, next);
    } else {
      this.getAllActiveUsers(req, res, next);
    }
  }

  private async getAutoSuggestUsers(req: Request, res: Response, next) {
    const query = (req.query as unknown) as AutoSuggest;
    if (!query.limit) {
      query.limit = '5';
    }

    try {
      if (isNaN(Number(query.limit))) {
        throw new ApplicationError(400, `limit parametr is not a number`);
      }
      
      const users = await this.userService.getActiveUSersByLoginString(
        query.login,
        query.limit
      );
      const count = await this.userService.getAutoSuggestCount(query.login);
  
      res.status(200).json({
        count,
        users
      });
    } catch(err) {
      next(err);
    }
  }

  private async getAllActiveUsers(req: Request, res: Response, next) {
    try {
      const users = await this.userService.getAllActiveUsers();
      res.status(200).json({
        count: users.length,
        users: users
      });
    } catch(err) {
      next(err);
    }
  }

  async getUserById(req: RequestWithSelectedUser, res: Response, next, id: string) {
    try {
      const userId = this.userService.praseUserId(id);
      const user = await this.userService.getUserById(userId);
      req.selectedUser = user;
    } catch(err) {
      next(err);
    }
    next();
  }

  getUser(req: RequestWithSelectedUser, res: Response, next): void {
    const { id } = req.params;
    const { selectedUser } = req;

    try {
      if (!selectedUser) {
        throw new ApplicationError(404, `there is no user with id: ${id}`);
      }
      res.status(200).json({
        user: usersService.mapperUerInformation(selectedUser)
      });
    } catch(err) {
      next(err);
    }
  }

  async post(req: Request, res: Response, next) {
    const { body } = req;

    try {
      const isLoginFree = await this.userService.isLoginFree(body.login);

      const nextUser = await this.userService.getNextUSerInformation(body);
      const savedInformation = await this.userService.createUser(nextUser);

      res.status(200).json({
        message: 'user created',
        user: savedInformation
      });
    } catch(err) {
      next(err);
    }
    
  }

  async put(req: RequestWithSelectedUser, res: Response, next) {
    const { id } = req.params;
    const { body } = req;
    const { selectedUser } = req;

    try {
      const isLoginFree = await this.userService.canUserBeUpdated(
        body.login,
        id
      );
      const updatedUser = await this.userService.updateUser(selectedUser, body);
      res.status(200).json({
        message: `user id: ${updatedUser.id} has been successfully updated`,
        user: updatedUser
      });
      
    } catch(err) {
      next(err);
    }
  }

  async delete(req: RequestWithSelectedUser, res: Response, next) {
    const { selectedUser } = req;
    const { id } = req.params;

    try {
      if (!selectedUser) {
        throw new ApplicationError(404, `there is no user with id: ${id}`);
      }
  
      const deletedUser = await this.userService.deleteUser(selectedUser);
      res.status(200).json({
        message: 'user has been deleted',
        user: deletedUser
      });

    } catch(err) {
      next(err);
    }
  }
}

export const usersController = new UsersController(usersService);
