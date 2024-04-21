const dotenv = require('dotenv');
dotenv.config("./.env");


module.exports = {
  development: {
    username: process.env.MYUSER,
    password: process.env.MYPASSWORD,
    database: process.env.MYDATABASE,
    host: process.env.MYHOST,
    dialect: "mysql",
    logging:false,
    pool:{
      max: 5,
      min:0,
      acquire: 30000,
      idle: 10000
    },
    /*dialectOptions: {
      ssl: true,
    },*/
  },
  test: {
    username:"root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    "dialect": "mysql"
  },
  production: {
    username: process.env.MYUSER,
    password: process.env.MYPASSWORD,
    database: process.env.MYDATABASE,
    host: process.env.MYHOST,
    dialect: "mysql",
    ssl: 'require'
  }
}