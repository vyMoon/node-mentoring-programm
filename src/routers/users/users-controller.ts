import { Request, Response } from 'express';
import { AutoSuggest } from '../../types/users/autosuggest.interface';
import { usersService } from '../../services/users/users.service';

interface RequestWithSelectedUser extends Request {
  selectedUser?: any;
}

class UsersController {
  private readonly userService;

  constructor(userService) {
    this.userService = userService;
  }

  get(req: Request, res: Response): void {
    const { query } = req;
    if (query.login) {
      this.getAutoSuggestUsers(req, res);
    } else {
      this.getAllActiveUsers(req, res);
    }
  }

  private async getAutoSuggestUsers(req: Request, res: Response) {
    const query = (req.query as unknown) as AutoSuggest;

    if (!query.limit) {
      query.limit = '5';
    }

    if (isNaN(Number(query.limit)) || !query.login) {
      res.status(400).json({ error: 'Bad request' });
      return;
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
  }

  private async getAllActiveUsers(req: Request, res: Response) {
    const users = await this.userService.getAllActiveUsers();
    if (!users) {
      res.status(500).json({
        error: 'something went wrong'
      })
    }
    res.status(200).json({
      count: users.length,
      users: users
    })
  }

  async getUserById(req: RequestWithSelectedUser, res: Response, next, id: string) {
    const userId = this.userService.praseGroupId(id);

    if(!userId) {
      res.status(400).json({
        error: `id: ${id} isn't correct`
      });
      return;
    }

    const user = await this.userService.getUserById(userId);
    req.selectedUser = user;
    next();
  }

  getUser(req: RequestWithSelectedUser, res: Response): void {
    const { id } = req.params;
    const { selectedUser } = req;

    if (!selectedUser) {
      res.status(404).json(
        { error: `there is no user with id: ${id}` }
      );
      return;
    }
    res.status(200).json({
      user: usersService.mapperUerInformation(selectedUser)
    });
  }

  async post(req: Request, res: Response) {
    const { body } = req;
    const isLoginFree = await this.userService.isLoginFree(body.login);

    if (!isLoginFree) {
      res.status(409).json({
        error: `user with login: ${body.login} exists` 
      });
      return;
    }

    const nextUser = await this.userService.getNextUSerInformation(body);
    const savedInformation = await this.userService.createUser(nextUser);

    res.status(200).json({
      message: 'user created',
      user: savedInformation
    });
  }

  async put(req: RequestWithSelectedUser, res: Response) {
    const { id } = req.params;
    const { body } = req;
    const { selectedUser } = req;

    const isLoginFree = await this.userService.canUserBeUpdated(
      body.login,
      id
    )

    if (!isLoginFree) {
      res.status(409).json({
        error: `login ${body.login} is not free`
      })
    }

    const updatedUser = await this.userService.updateUser(selectedUser, body)

    if (!updatedUser) {
      res.status(500).json({
        error: 'something went wrong'
      })
    }
    res.status(200).json({
      message: `user id: ${updatedUser.id} has been successfully updated`,
      user: updatedUser
    });
  }

  async delete(req: RequestWithSelectedUser, res: Response) {
    const { selectedUser } = req;
    const { id } = req.params;

    if (!selectedUser) {
      res.status(404).json(
        { error: `there is no user with id: ${id}` }
      );
      return;
    }

    const deletedUser = await this.userService.deleteUser(selectedUser);
    res.status(200).json({
      message: 'user has been deleted',
      user: deletedUser
    });
  }

  badReques(req: Request, res: Response, message?: string): void {
    const error = `bad request. ${message}`
    res.status(400).json(
      { error }
    );
  }
}

export const usersController = new UsersController(usersService);
