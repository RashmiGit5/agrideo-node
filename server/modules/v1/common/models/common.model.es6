import { exec } from "../../../../db";
import { COMMON } from "../../../../config/common-model";
import ErrorManager from "../../../../helpers/error-manager";
import { getDate, momentParse } from "../../../../helpers/common-functions";
import _ from 'lodash';
import moment from "moment-timezone";
import { GENERAL } from "../../../../config/general";

moment.tz.setDefault('Asia/Calcutta');

/**
* @type function Common Model 
* @param {object} 
* @property {object} 
*/
const commonModel = (type, data, callback) => {
  try {
    const { MULTI, VALIDATION, ERROR_CODE, RESULT } = COMMON[type.module_name][type.method_name];

    let sqlQuery = '';
    let sqlParams = [];

    if (MULTI) {
      data.multi.forEach(a => {
        const { sql, params } = makeSqlParams(COMMON[type.module_name][type.method_name], _.assign(a, data.common));
        sqlQuery += sql;
        sqlParams = sqlParams.concat(params);
      })
    } else {
      const { sql, params } = makeSqlParams(COMMON[type.module_name][type.method_name], data);
      sqlQuery = sql;
      sqlParams = params;
    }

    exec(sqlQuery, sqlParams, function (err, result, error_detail) {
      if (err) {
        return callback(err, []);
      } else if (checkValidation(VALIDATION, result)) {
        return callback(null, returnResponse(RESULT, result));
      } else {
        return callback(ErrorManager.getHttpError(ERROR_CODE), []);
      }
    });
  } catch (err) {
    console.log(err)
    throw err;
  }
};

/**
* @type function make sql params base on request params
* @param {object} 
* @property {object} 
*/
const makeSqlParams = (request, data) => {
  const { PARAMS, SQL } = request;

  let sql = SQL;
  let params = [];
  PARAMS.forEach(field => {

    if (field.SUPER_ADMIN) {
      if (data.tenant_role === GENERAL.ROLE_CONSTANT.SUPER_ADMIN) {
        sql = sql.replace(`#${field.FIELD}#`, '');
      } else {
        const value = (data[field.KEY] !== '' && !isNaN(data[field.KEY])) ? parseInt(data[field.KEY]) : (field.DEFAULT || null)
        sql = sql.replace(`#${field.FIELD}#`, (`${field.FILTER_PREFIX || ''}${field.FIELD} = ${value}${field.FILTER_SUFFIX || ''}`));
      }
    } else {

      if (field.TYPE === "string") {
        params.push(data[field.KEY] ? data[field.KEY].toString() : null);
      }

      if (field.TYPE === "number") {
        params.push((data[field.KEY] !== '' && !isNaN(parseInt(data[field.KEY]))) ? parseInt(data[field.KEY]) : (field.DEFAULT || null));
      }

      if (field.TYPE === "float") {
        params.push((data[field.KEY] !== '' && !isNaN(data[field.KEY])) ? parseFloat(data[field.KEY]) : null);
      }

      if (field.TYPE === "date") {
        if (field.CURRENT) {
          params.push(getDate());
        } else {
          params.push(data[field.KEY] ? momentParse(data[field.KEY], "YYYY-MM-DD", "YYYY-MM-DD") : null);
        }
      }
      if (field.TYPE === "datetime") {
        if (field.CURRENT) {
          params.push(getDate());
        } else {
          params.push(data[field.KEY] ? moment(data[field.KEY], "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss") : null);
        }
      }

      if (field.TYPE === "json") {
        params.push(data[field.KEY] ? JSON.stringify(data[field.KEY]) : null);
      }

      if (field.TYPE === "globalfilter") {

        let globalfilter = '';
        if (data[field.KEY]) {
          let globallength = data[field.KEY].columns.length;
          let que = [];
          data[field.KEY].columns.forEach((val, gloalindex) => {
            let globalsuffix = !((globallength - 1) === gloalindex);
            que.push(`${val} like '%${data[field.KEY].value}%' ${globalsuffix ? 'OR' : ''} `);
          });
          globalfilter += `( ${que.toString().replace(/,/g, '')})`;
        }
        sql = sql.replace(`#${field.KEY}#`, globalfilter ? (`${field.FILTER_PREFIX || ''}${globalfilter}${field.FILTER_SUFFIX || ''}`) : '');
      }

      if (field.TYPE === "filter") {
        let filter = '';
        if (data[field.KEY] && data[field.KEY].length) {
          let length = data[field.KEY].length;
          data[field.KEY].forEach((text, index) => {
            let key = text.key;
            if (text.table) {
              key = `${text.table}.${text.key}`;
            }
            let suffix = !((length - 1) === index);
            // logic for when fields contains values in array format
            if (text.type === 'array' && text.value && text.value.length) {
              let que = [];
              text.value.forEach(val => {
                if (val && val.toString().length) {
                  que.push('?');
                  params.push(val || '');
                }
              });
              if (que.length) { filter += `${key} in (${que.toString()})${suffix ? ' AND ' : ''}`; }
            }
            // logic for when fields contains values in string format
            else if (text.type === 'string') {
              filter += `${key} LIKE ? ${suffix ? ' AND ' : ''}`;
              params.push(`%${text.value}%`);
            }
            else if (text.type === 'exact') {
              filter += `${key} LIKE ? ${suffix ? ' AND ' : ''}`;
              params.push(`${text.value}`);
            }
            else if (text.type === 'start_date') {
              filter += `${key} >= ? ${suffix ? ' AND ' : ''}`;
              params.push(`${text.value.toString()}`);
            }
            else if (text.type === 'end_date') {
              filter += `${key} <= ? ${suffix ? ' AND ' : ''}`;
              params.push(`${text.value.toString()}`);
            }
          });
        }
        sql = sql.replace(`#${field.KEY}#`, filter ? (`${field.FILTER_PREFIX || ''}${filter}${field.FILTER_SUFFIX || ''}`) : '');
      }

      if (field.TYPE === "sort") {
        sql = sql.replace(`#${field.KEY}#`, data[field.KEY]);
      }

      if (field.TYPE === "array") {
        let filter = '';
        if (data[field.KEY] && data[field.KEY].length) {
          let que = [];
          data[field.KEY].forEach(val => {
            // logic for when fields contains values in array format
            if (val && val.toString().length) {
              que.push('?');
              params.push(val || '');
            }
          });
          if (que.length) { filter += `${field.KEY} ${field.OPERATOR} (${que.toString()})`; }
        }
        sql = sql.replace(`#${field.KEY}#`, filter ? (`${field.FILTER_PREFIX || ''}${filter}${field.FILTER_SUFFIX || ''}`) : '');

      }
    }
  });
  return { sql, params };
}

const returnResponse = (RESULT, result) => {
  if (RESULT) {
    if (RESULT === 'SINGLE') {
      return result.length ? result[0] : null
    } else if (RESULT === 'INSERT') {
      return result;
    }
  }
  return result;
}


const checkValidation = (VALIDATION, result) => {
  if (VALIDATION) {
    if (VALIDATION === 'EXISTS' && result && result.length) {
      return false;
    } else if (VALIDATION === 'NOT_EXISTS' && (!result || !result.length)) {
      return false;
    }
  }
  return true;
}

export { commonModel };
