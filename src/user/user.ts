import { Request, Response } from 'express';
import { store } from '../store/store';
import { AutoSuggest } from './types/autosuggest.interface';
import { usersService } from '../services/users/users.service';


class User {
  private readonly storeService;
  private readonly userService;

  constructor(storeServoce, userService) {
    this.storeService = storeServoce;
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

  private getAutoSuggestUsers(req: Request, res: Response): void {
        const query = (req.query as unknown) as AutoSuggest;

        if (!query.limit) {
            query.limit = '5';
        }

        if (isNaN(Number(query.limit)) || !query.login) {
            res.status(400).json({ error: 'Bad request' });
            return;
        }

        const users = this.storeService.getActiveUsersBylogin(query.login);
        if (users.length < Number(query.limit)) {
            res.status(200).json({
                message: 'ok',
                count: users.length,
                users
            });
        } else {
            res.status(200).json({
                message: 'ok',
                count: users.length,
                users: users.slice(0, Number(query.limit))
            });
        }
  }

  private getAllActiveUsers(req: Request, res: Response): void {
    this.userService.getAllActiveUsers()
      .then(response => {
        res.status(200).json({
          count: response.length,
          users: response
        })
      }).catch(err => {
        res.status(401).json({
          error: err.message
        })
      })
  }

  getUser(req: Request, res: Response): void {
        const { id: userId } = req.params;
        const user = this.storeService.getUser(userId);
        if (user) {
            res.status(200).json({ response: 'ok', user });
        } else {
            res.status(404).json(
                { error: `there is no user with id: ${userId}` }
            );
        }
  }

  post(req: Request, res: Response): void {
        const user = this.storeService.saveUser(req.body);
        if (user) {
            res.status(200).json({
                message: 'ok',
                newUserData: user
            });
        } else {
            res.status(400).json(
                { error: `login: ${req.body.login} is taken` }
            );
        }
  }

  put(req: Request, res: Response): void {
        const user = this.storeService.updateUser(req.body);
        
        if (user) {
            res.status(200).json({
                message: `user id ${user.id} updated!`,
                newUserData: user
            });
            return;
        }
        res.status(400).json(
            { error: 'there is no such a user' }
        );
        
  }

  delete(req: Request, res: Response): void {
        const { id: userId } = req.params;
        const user = this.storeService.deleteUser(userId);
        if (user && user.isDeleted) {
            res.status(200).json(
                { message: `user id ${userId} has been deleted` }
            );
        } else {
            res.status(400).json(
                { error: `there is no user with id: ${userId}` }
            );
        }
  }

  badReques(req: Request, res: Response): void {
    res.status(400).json(
      { error: 'bad request' }
    );
  }
}

export const user = new User(store, usersService);
