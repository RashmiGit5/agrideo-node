import fs from 'fs';
import ErrorManager from '../error-manager';
import _ from 'lodash';
import moment from 'moment';
var os = require('os');


const FILE_CONFIG = {
  dev: '',
  local: __dirname,
  prod: '',
};

const CSV_FILE_CONFIG = {
  dev: __dirname,
  local: __dirname,
  prod: __dirname,
};

const prodFilePath = FILE_CONFIG[global.build];

/**
 * @type function
 * @param {string } filePath, {function} callback
 * @description Function for read html file
 * @returns {undefined}

 */

const readFile = (filePath, callback) => {
  fs.readFile(prodFilePath + filePath, { encoding: 'utf-8' }, (err, data) => {
    let error;
    if (err) {
      error = ErrorManager.getHttpError('SYSTEM_ERROR');
    }
    callback(error, data);
  });
};

/**
 * @type function
 * @param {object} data, {string } token, {string } html, {function} callback
 * @description Function for replace reset password constants
 * @returns {undefined}

 */
const compareValues = (key, order = 'asc') => {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }

    const varA = typeof a[key] === 'string' ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === 'string' ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === 'desc' ? comparison * -1 : comparison;
  };
};

/**
 * @type function
 * @description {string} date,
 * @property {date} getDate - return date
 */
const getDate = (date) => {
  if (date) return new Date(date);
  else return new Date();
};

/**
 * @exports function
 * @description exports current date
 */

/**
 * @type function
 * @description {string} date,
 * @property {date} momentParse - return moment parse date
 */
const momentParse = (date, input, format) => {
  if (!date) return null;
  if (
    moment(date, input).format('MM-DD-YYYY') === moment().format('MM-DD-YYYY')
  ) {
    return moment().add(1, 'minutes').format(format);
  } else {
    return moment(date, input).format(format);
  }
};

/**
 * @exports function
 * @description exports current date
 */

/**
 * @exports functions
 * @description exports return common error payload
 */

const getDataTableSetting = (data, defaultConstant) => {
  if (!data) {
    data = {};
  }

  if (!data.page_index) {
    data.page_index = 1;
  }

  if (!data.page_size) {
    data.page_size = defaultConstant.PAGE_SIZE;
  }

  if (!data.sort_by) {
    data.sort_by = defaultConstant.SORT_FIELD;
  }

  if (!data.sort_order) {
    data.sort_order = defaultConstant.SORT_VALUE;
  }

  data.page_offset = parseInt((data.page_index - 1) * data.page_size);

  data.sort_order = data.sort_order || 'asc';
  if (data.filters && data.filters.length) {
    data.filters = data.filters;
  }

  return data;
};


export { readFile, momentParse, getDate, getDataTableSetting, compareValues };
