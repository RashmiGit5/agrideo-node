import mysql from 'mysql';
import ErrorManager from '../helpers/error-manager';
import httpResponse from '../helpers/http-response';
import _ from 'lodash';
require('dotenv').config()

let connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DB,
  connectionLimit: process.env.DB_CONNECTION_LIMIT,
  supportBigNumbers: true,
  multipleStatements: true,
  timezone: 'utc',
  charset: 'utf8mb4_unicode_ci'
});

/**
 * @type function
 * @description  release persistent connection
 */
const exec = (sql, data, callback) => {
  connection.query(sql, data, (err, results) => {
    if (err) {
      console.log(err);
      let error = ErrorManager.getHttpError('DATABASE_QUERY_ERROR')
      callback(error, false);
      return;
    }
    callback(false, results);
  });

};

/**
 * @type function
 * @description  Get persistent connection
 */
const getConnection = (req, res, next) => {
  // get a connection from the pool
  dbConnection.getConnection((err, connection) => {
    if (err) {
      let error = ErrorManager.getHttpError('DATABASE_CONNECTION_FAILED')
      httpResponse.sendFailer(res, error.code, error);
      return;
    } else {
      req.connection = connection;
      next();
    }
  });
};

/**
 * @type function
 * @description  release persistent connection
 */
const releaseConnection = (req, res, next) => {
  if (req.connection) {
    req.connection.release();
  }
  next();
};

export { exec, releaseConnection, getConnection };