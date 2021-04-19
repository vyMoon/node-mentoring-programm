import { sequelize } from '../db-connection';
// import { Users } from './users.model';
import { Groups } from './groups.model';

console.log('script here');

Groups.sync({ force: true })
  .then(() => {
    console.log('table groups created');
    populateGroups();
  })

function populateGroups() {
  createGroup(1, 'group_1', ['READ']);
  createGroup(2, 'group_2', ['WRITE']);
  createGroup(3, 'group_3', ['DELETE']);
  createGroup(4, 'group_4', ['SHARE']);
  createGroup(5, 'group_5', ['UPLOAD_FILES']);
}

function getGroup(id: number, name: string, permissions: string[]) {
  return {
    id,
    name,
    permissions,
  }
}

function createGroup(id: number, name: string, permissions: string[]) {
  Groups.create(getGroup(
    id, name, permissions
  )).then(() => {
    console.log(`group ${name} created`);
  }).catch(err => console.log(err))
}
