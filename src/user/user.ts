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
    console.log(query)
    
    this.userService.getActiveUSersByLoginString(
      query.login,
      query.limit
    )
    .then(response => {
      res.status(200).json({
        count: response.length > query.limit ? query.limit : response.length,
        users: response
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err.message
      })
    });
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
    const { id } = req.params;
    const userId = parseInt(id);
    if(isNaN(userId)) {
      this.badReques(req, res);
      return;
    }
    this.userService.getUserById(userId)
      .then(user => {
        if (user) {
          res.status(200).json({ user });
        } else {
          res.status(404).json(
            { error: `there is no user with id: ${userId}` }
          );
        }
      })
      .catch(err => console.log(err));
  }

  post(req: Request, res: Response): void {
    this.userService.getUserByLogin(
      req.body.login
    ).then(response => {
      if(response.length !== 0 ) {
        res.status(400).json({
          error: `user with login: ${req.body.login} exists` 
        })
      } else {
        this.userService.getNexId().then(id => {
          const newUser = req.body;
          newUser.id = id;
          newUser.is_deleted = false;
          this.userService.createUser(newUser)
          .then(response => {
            res.status(200).json({
              message: 'user created',
              user: response
            })
          })
        })
      }
    }).catch(err => {
      res.status(500).json(
        { error: err.mesage }
      );
    });
  }

  put(req: Request, res: Response): void {
    const { id } = req.params;
    const userId = parseInt(id);
    if(isNaN(userId)) {
      const message = `id: '${id}' doesn't look like id`
      this.badReques(req, res, message);
      return;
    }

    this.userService.getUserById(userId)
    .then(user => {
      if(!user) {
        res.status(404).json(
          { error: `there is no user with id: ${userId}` }
        );
      } else {
        this.userService.updateUser(userId, req.body)
        .then(() => {
          res.status(200).json({
            message: `user id: ${userId} has been successfully updated`,
            user: {
              id: userId,
              ...req.body
            }
          })
        })
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err.mesage
      })
    })
  }

  delete(req: Request, res: Response): void {
    const { id } = req.params;
    const userId = parseInt(id);
    if(isNaN(userId)) {
      const message = `id: '${id}' doesn't look like id`
      this.badReques(req, res, message);
      return;
    }

    this.userService.deleteUserByIdSoft(userId)
      .then(response => {
        if (response[0]) {
          res.status(200).json({
            message: `user id: ${userId} has been deleted successfully`
          })
        } else {
          res.status(404).json({
            error: `user id: ${userId} not found`
          })
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err.message
        })
      });
  }

  badReques(req: Request, res: Response, message?: string): void {
    const error = `bad request. ${message}`
    res.status(400).json(
      { error }
    );
  }
}

export const user = new User(store, usersService);
