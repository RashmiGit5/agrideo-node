import mysql from 'mysql';
import ErrorManager from '../helpers/error-manager';
import httpResponse from '../helpers/http-response';
import { DATABASE } from '../config/db';
import _ from 'lodash';

let DB_CONSTANTS = DATABASE.DB_LOCAL_CONSTANTS;

let connection = mysql.createPool({
  host: DB_CONSTANTS.HOST,
  user: DB_CONSTANTS.USER,
  password: DB_CONSTANTS.PASSWORD,
  database: DB_CONSTANTS.DB,
  connectionLimit: 500,
  supportBigNumbers: true,
  multipleStatements: true,
  timezone: 'utc'
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