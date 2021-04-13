import { Pool } from 'pg';

const pool = new Pool({
  user: 'node',
  host: 'localhost',
  database: 'nodementoring',
  password: 'nodeJS',
  port: 5432
});

createUserTable()
  .then(res => {
    console.log('Table users created');
    populateUsers();
  })
  .catch(err => console.error(err));

function test() {
  pool.query('select * from users', (error, result) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log(result.rows);
  })
}

function dropUsers() {
  pool.query(
    `drop table if exists users`,
    (error, result) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log('users table has been droped');
    }
  )
}

function createUserTable() {
  return new Promise((resolve, reject) => {
    pool.query(`
    CREATE TABLE users
    (
        id integer NOT NULL,
        login character varying(30) NOT NULL,
        password character varying(30) NOT NULL,
        age smallint NOT NULL,
        is_deleted boolean NOT NULL,
        PRIMARY KEY (id)
    );`,
    (error, result) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    })
  }) 
}

function populateUsers() {
  for( let i = 1; i < 11 ; i += 1) {
    pool.query(`
      insert into users 
      (id, login, password, age, is_deleted)
      values 
      (${i}, 'user${i}', 'pass${i}23', ${20 + i}, false)
    `,
    (error, result) => {
      if (error) {
        console.error(error);
      } else {
        console.log(`user ${i} created`);
      }
    }
    )
  }
}
