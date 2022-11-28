require('dotenv').config({
  path: './db.env'
});
const env = process.env;

const development = {
  username: env.DB_USER,
  password: env.DB_PWD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  dialect: "mysql",
  logging: false,
  timezone: '+09:00'
  //port: env.MYSQL_PORT
};

const production = {
  username: env.DB_USER,
  password: env.DB_PWD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  dialect: "mysql",
  //port: env.MYSQL_PORT
};

const test = {
  username: env.DB_USER,
  password: env.DB_PWD,
  database: env.DB_NAME,
  host: env.DB_HOST,
  dialect: "mysql",
  //port: env.MYSQL_PORT
};

module.exports = { development, production, test };