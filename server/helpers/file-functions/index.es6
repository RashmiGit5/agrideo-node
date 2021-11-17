import fs from 'fs';
import ErrorManager from '../error-manager';
import _ from 'lodash';
import { GENERAL } from '../../config/general';
import async from 'async';
import uuid from 'uuid/v4';
import multer from 'multer';
const Externalpath = require('path');

const FILE_CONFIG = {
  dev: '',
  local: __dirname,
  prod: ''
};

const prodFilePath = FILE_CONFIG[global.build];

/**
 * @type function
 * @param {files} files, {string} filePath, {string} oldfilePath, {function} callback
 * @description Function for upload file
 * @returns {undefined}
 */
const uploadFile = (files, path, old_file_path, maincallback) => {
  if (files && files.file) {
    let file_name = files.file.name.substring(0, files.file.name.lastIndexOf('.')) + '_' + new Date().getTime() + '.' + files.file.name.split('.').pop();
    let new_path = prodFilePath + path + file_name;
    let old_path = prodFilePath + path + old_file_path;
    let error = null;
    async.waterfall([
      (callback) => {
        fs.readFile(files.file.path, (err, data) => {
          if (err) {
            error = ErrorManager.getHttpError('SYSTEM_ERROR');
            callback(error, data, err);
          } else {
            callback(error, data);
          }
        });
      },
      (data, callback) => {
        fs.writeFile(new_path, data, function (err) {
          if (err) {
            error = ErrorManager.getHttpError('SYSTEM_ERROR');
            callback(error, data, err);
          } else {
            callback(error, data);
          }
        });
      },
      (data, callback) => {
        fs.unlink(files.file.path, function (err) {
          if (err) {
            error = ErrorManager.getHttpError('SYSTEM_ERROR');
            callback(error, data, err);
          } else {
            callback(error, data);
          }
        });
      }, (data, callback) => {
        if (old_file_path && old_file_path != '') {
          fs.unlink(old_path, function (err) {
            callback(null, data);
          });
        } else {
          callback(null, data);
        }
      }],
      (err, data, error_detail) => {
        maincallback(err, file_name, error_detail);
      });
  } else {
    maincallback(null, null);
  }

};
/**
 * @exports upload file function
 * @description Exports upload file function
 */

/**
* @type function
* @param {files} files, {string} filePath, {function} callback
* @description Function for upload temp file
* @returns {undefined}
*/
const uploadTempFile = (files, path, server_path, maincallback) => {
  if (files && files.file) {
    try {
      let file_name = uuid() + '.' + files.file.name.split('.').pop();
      let new_path = prodFilePath + path + file_name;
      let temp_path = GENERAL.API_URL + server_path + file_name;
      let error = null;
      async.waterfall([
        (callback) => {
          fs.readFile(files.file.path, (err, data) => {
            if (err) {
              error = ErrorManager.getHttpError('SYSTEM_ERROR');
              callback(error, data, err);
            } else {
              callback(error, data);
            }
          });
        },
        (data, callback) => {
          fs.writeFile(new_path, data, function (err) {
            if (err) {
              error = ErrorManager.getHttpError('SYSTEM_ERROR');
              callback(error, data, err);
            } else {
              callback(error, data);
            }
          });
        },
        (data, callback) => {
          fs.unlink(files.file.path, function (err) {
            if (err) {
              error = ErrorManager.getHttpError('SYSTEM_ERROR');
              callback(error, data, err);
            } else {
              callback(error, data);
            }
          });
        }],
        (err, data, error_detail) => {
          maincallback(err, { file_name, temp_path }, error_detail);
        });
    } catch (err) {
      maincallback(ErrorManager.getHttpError('SYSTEM_ERROR'), {}, err);
    }
  } else {
    maincallback(null, null);
  }

};
/**
 * @exports upload temp file function
 * @description Exports upload temp file function
 */

/**
* @type function
* @param {string } fileName, {string } filePath, {string } TempPath, {function} callback
* @description Function for move file
* @returns {undefined}
*/
const moveFile = (file_name, path, temp_path, previewpath, maincallback) => {
  if (file_name) {
    let new_path = __dirname + path + file_name;
    let old_path = __dirname + temp_path + file_name;
    let response_path = process.env.API_URL || 'http://192.168.0.7:9010' + previewpath + file_name;
    let error = null;
    async.waterfall([
      (callback) => {
        fs.readFile(old_path, (err, data) => {
          if (err) {
            error = ErrorManager.getHttpError('SYSTEM_ERROR');
            callback(error, data);
          } else {
            callback(error, data);
          }
        });
      },
      (data, callback) => {
        fs.writeFile(new_path, data, function (err) {
          if (err) {
            error = ErrorManager.getHttpError('SYSTEM_ERROR');
            callback(error, data);
          } else {
            callback(error, data);
          }
        });
      }
    ],
      (err, data) => {
        maincallback(err, { new_path, path: response_path });
      });
  } else {
    maincallback(null, null);
  }
};
/**
 * @exports  move file function
 * @description Exports move file function
 */

/**
* @type function
* @param {string } fileName, {string } filePath, {function} callback
* @description Function for remove file
* @returns {undefined}
*/
const removeFile = (file_name, path, maincallback) => {
  if (file_name) {
    let old_path = prodFilePath + path + file_name;
    let error = null;
    async.waterfall([
      (callback) => {
        fs.unlink(old_path, (err, data) => {
          if (err) {
            error = ErrorManager.getHttpError('SYSTEM_ERROR');
            callback(error, data, err);
          } else {
            callback(error, data);
          }
        });
      }],
      (err, data, error_detail) => {
        maincallback(err, { file_name }, error_detail);
      });
  } else {
    maincallback(null, null);
  }
};
/**
* @type function
* @param {string } data,{string } path, {string } file_name, {function} callback
* @description Function for write file
* @returns {undefined}
*/

/**
* @type function
* @param {string } fileName, {string } filePath, {function} callback
* @description Function for remove file
* @returns {undefined}
*/
const writeFile = (data, path, file_name, override, callback) => {
  file_name = file_name ? file_name : (uuid() + '.' + file_name.split('.').pop());
  let new_path = prodFilePath + path + file_name;
  let error = null;
  fs.writeFile(new_path, data, 'utf-8', function (err) {
    if (err) {
      error = ErrorManager.getHttpError('SYSTEM_ERROR');
    }
    callback(error, { file_name, new_path }, err);
  });
};
/**
* @type function
* @param {string } data,{string } path, {string } file_name, {function} callback
* @description Function for write file
* @returns {undefined}
*/


/**
* @type function
* @param {string } data,{string } path, {string } file_name, {function} callback
* @description Function for write file
* @returns {undefined}
*/
const writeFileWithoutEncoding = (data, path, file_name, override, callback) => {
  file_name = override && file_name ? override : (uuid() + '.' + file_name.split('.').pop());
  let new_path = prodFilePath + path + file_name;
  let error = null;
  fs.writeFile(new_path, data, function (err) {
    if (err) {
      error = ErrorManager.getHttpError('SYSTEM_ERROR');
    }
    callback(error, { file_name, new_path }, err);
  });
};
/**
 * @exports  remove file function
 * @description Exports remove file function
 */


/**
* @type function
* @param {string } filePath, {function} callback
* @description Function for read html file
* @returns {undefined}
*/
const readwriteFile = (readfilePath, writefilePath, server_path, file_name, maincallback) => {
  let file_path = `${process.env.API_PATH}:${global.port}/` + server_path + file_name;
  let old_path = prodFilePath + readfilePath;
  let new_path = __dirname + writefilePath + file_name;
  let error = null;
  try {
    async.waterfall([
      (callback) => {
        fs.readFile(old_path, (err, data) => {
          if (err) {
            error = ErrorManager.getHttpError('SYSTEM_ERROR');
            callback(error, data, err);
          } else {
            callback(error, data);
          }
        });
      },
      (result, callback) => {
        let error = null;
        fs.writeFile(new_path, result, function (err) {
          if (err) {
            error = ErrorManager.getHttpError('SYSTEM_ERROR');
          }
          callback(error, { file_name, file_path }, err);
        });
      }
    ], (err, result) => {
      maincallback(err, result);
    });
  } catch (err) {
    maincallback(err, {});
  }

};
/**
* @type function
* @param {string } data,{string } path, {string } file_name, {function} callback
* @description Function for write file
* @returns {undefined}
*/

const tempFileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'dist/public/tempfiles');
  },
  filename: (req, file, filenamecallback) => {
    filenamecallback(null, uuid() + '.' + file.originalname.split('.').pop());
  }
});

const uploadTempFileMulter = multer({ storage: tempFileStorage });

export { uploadFile, uploadTempFile, moveFile, removeFile, writeFile, writeFileWithoutEncoding, readwriteFile, uploadTempFileMulter };