import { getStore } from '../store/store';

export class User {
  storeService = getStore();

  get(req, res) {
      const { query } = req;
      if (query.login) {
          this.getAutoSuggestUsers(req, res);
      } else {
          this.getAllActiveUsers(req, res);
      }
  }

  getAutoSuggestUsers(req, res) {
      const { query } = req;
      if (!query.limit) {
          query.limit = 5;
      }
      const users = this.storeService.getActiveUsersBylogin(query.login);
      if (users.length < query.limit) {
          res.status(200).json({
              message: 'ok',
              lenght: users.length,
              users
          });
      } else {
          res.status(200).json({
              message: 'ok',
              available: users.length,
              lenght: query.limit,
              users: users.slice(0, query.limit)
          });
      }
  }

  getAllActiveUsers(req, res) {
      const response = this.storeService.getAllActive();
      res.status(200).json({
          message: 'ok',
          count: `${response.length}`,
          users: response
      });
  }

  getUser(req, res) {
      const { id: userId } = req.params;
      const user = this.storeService.getUser(userId);
      if (user) {
          res.status(200).json({ response: 'ok', user });
      } else {
          res.status(400).json(
              { error: `there is no user with id: ${userId}` }
          );
      }
  }

  post(req, res) {
      const user = this.storeService.saveUser(req.body);
      if (user) {
          res.status(200).json({
              message: 'ok',
              newUserData: user
          });
      } else {
          res.status(500).json(
              { error: 'somthing went wrong' }
          );
      }
  }

  put(req, res) {
      const user = this.storeService.updateUser(req.body);
      if (user) {
          res.status(200).json({
              message: `user id ${user.id} updated!`,
              newUserData: user
          });
      } else {
          res.status(400).json(
              { error: 'there is no such a user' }
          );
      }
  }

  delete(req, res) {
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

  badReques(req, res) {
      res.status(400).json(
          { error: 'bad request' }
      );
  }
}
