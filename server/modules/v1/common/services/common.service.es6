import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { GENERAL } from '../../../../config/general';
import { commonModel } from '../models/common.model';
import { removeFile } from '../../../../helpers/file-functions';

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
        callback(null, {
          name: req.file.key,
          path: req.file.location,
        });
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
 * @description delete common file
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const deleteCommonFile = (req, res) => {
  try {
    async.waterfall([
      (callback) => removeFile(req.body.file_name, callback)
    ],
      (err, data) => {
        if (err) {
          httpResponse.sendFailer(res, 403);
        } else {
          httpResponse.sendSuccess(res);
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

export { uploadCommonFile, masterCommonService, deleteCommonFile };
