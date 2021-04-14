import { Sequelize } from 'sequelize';

export const sequelize = new Sequelize('nodementoring', 'node', 'nodeJS', {
  host: 'localhost',
  dialect: 'postgres' 
});
