import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { GENERAL } from '../../../../config/general';
import { commonModel } from '../models/common.model';
import { moveFile } from '../../../../helpers/file-functions';

/**
 * @type function
 * @description upload common file
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const uploadCommonFile = (req, res) => {
  try {
    async.waterfall([
      (callback) => {
        let response = {
          file_name: req.file.filename,
          temp_path: process.env.API_URL || 'http://192.168.0.7:9010' + GENERAL.TEMP_FILE_PATH.FILE_SERVER_PATH + req.file.filename,
        }
        callback(null, response);
      }
    ],
      (err, data) => {
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
        } else {
          httpResponse.sendSuccess(res, data);
        }
      }
    );
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
};

/**
 * @type function
 * @description Matser Commom Service
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const masterCommonService = (input) => {
  return (req, res) => {
    try {
      let data = _.assign(req.body, req.query, req.params, req.jwt);
      async.series([
        (callback) => {
          commonModel(input, data, callback);
        }],
        (err, response) => {
          // err if validation fail
          if (err) {
            httpResponse.sendFailer(res, err.code, err);
            return;
          } else {
            httpResponse.sendSuccess(res, { master: response[0] });
          }
        });
    } catch (err) {
      httpResponse.sendFailer(res, 500);
    }
  };
}

export { uploadCommonFile, masterCommonService };
