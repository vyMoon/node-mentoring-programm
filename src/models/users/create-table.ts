import { sequelize } from '../db-connection';
import { Users } from './users.model';

Users.sync({ force: true })
  .then(() => {
    console.log('table users created');
    populateUsers();
  })

function populateUsers() {
  for( let i = 1; i < 11 ; i += 1) {
    Users.create({
      id: i,
      login: `user-${i}`,
      password: `pass123${i}`,
      age: 20 + i,
      is_deleted: false
    })
      .then(() => {
        console.log(`user-${i} created`)
        if (i === 10) {
          sequelize.close()
            .then(() => console.log('connections closed'))
        }
      })
      .catch(err => console.log(err))
  }
}
