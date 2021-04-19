import { DataTypes } from 'sequelize';
import { sequelize } from '../db-connection';

export const Groups = sequelize.define('groups', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(30),
    allowNull: false,
  },
  permissions: {
    type: DataTypes.ARRAY(DataTypes.ENUM(
      'READ',
      'WRITE',
      'DELETE',
      'SHARE',
      'UPLOAD_FILES',
    )),
  }
});
