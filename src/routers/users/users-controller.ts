import { Request, Response, NextFunction } from 'express';
import { AutoSuggest } from '../../types/users/autosuggest.interface';
import { usersService, UserService } from '../../services/users/users.service';
import { ApplicationError } from '../../error/application-error';

export class UsersController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { query } = req;
    if (query.login) {
      this.getAutoSuggestUsers(req, res, next);
    } else {
      this.getAllActiveUsers(req, res, next);
    }
  }

  private async getAutoSuggestUsers(req: Request, res: Response, next: NextFunction) {
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

      console.log(users,'<<<<<<<<<<<<<<<<<<<<<<')
      res.status(200).json({
        count,
        users
      });
    } catch(err) {
      next(err);
    }
  }

  private async getAllActiveUsers(req: Request, res: Response, next: NextFunction) {
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

  getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      const user = await this.userService.getUserById(id);

      res.status(200).json({
        user
      });
    } catch(err) {
      next(err);
    }
  }

  post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { body } = req;
      await this.userService.isLoginFree(body.login);

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

  put = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { body } = req;
      await this.userService.canUserBeUpdated(
        body.login,
        id
      );
      const updatedUser = await this.userService.updateUser(id, body);

      res.status(200).json({
        message: `user id: ${updatedUser.id} has been successfully updated`,
        user: updatedUser
      });
      
    } catch(err) {
      next(err);
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const deletedUser = await this.userService.deleteUser(id);

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
