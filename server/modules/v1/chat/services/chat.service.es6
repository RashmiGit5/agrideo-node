import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { commonModel } from '../../common/models/common.model';
import { getDataTableSetting, } from '../../../../helpers/common-functions';
import { DATATABLE } from '../../../../config/datatable';

/**
 * @type function
 * @description Create Chat
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatCreate = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_CHEXK_EXIST" }, data, callback),
      (res, callback) => {
        if (res) {
          callback(null, res)
        } else {
          commonModel({ module_name: "CHAT", method_name: "CHAT_CREATE" }, data, callback)
        }
      },
      (res, callback) => {
        commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL" }, { chat_id: res.insertId || res.id, user_chat_id: data.friend_id }, callback)
      },
      (res, callback) => {
        commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { chat_id: res.id, user_chat_id: data.friend_id }, (err, response) => {
          if (err) {
            callback(err, null)
          } else {
            callback(null, { chat: res, user: response })
          }
        })
      },
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res, response);
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}


export { chatCreate };
