import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { commonModel } from '../../common/models/common.model';
import { getDataTableSetting, } from '../../../../helpers/common-functions';
import { DATATABLE } from '../../../../config/datatable';
import { socketUserStatusUpdate, socketBlockChatUser } from '../socket/user.socket';

/**
 * @type function
 * @description Update user status
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const userStatusUpdate = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    async.waterfall([
      (callback) => commonModel({ module_name: "USER", method_name: "USER_CHECK_IN_STATUS" }, data, callback),
      (res, callback) => commonModel({ module_name: "USER", method_name: "USER_UPDATE_STATUS" }, data, callback),
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res);
          socketUserStatusUpdate(req.app.get('socketio'), { user_id: data.user_id, status: data.status })
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}

/**
 * @type function
 * @description block unblock user
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const userBlockUnblock = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    async.waterfall([
      (callback) => commonModel({ module_name: "USER", method_name: "USER_CHECK_IN_CHAT" }, data, callback),
      (res, callback) => commonModel({ module_name: "USER", method_name: "USER_BLOCK_UNBLOCK" }, { ...data, status: data.is_block ? 1 : null }, callback),
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res);
          socketBlockChatUser(req.app.get('socketio'), { chat_id: data.chat_id, block_uid: data.friend_id, is_block: data.is_block })
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}

/**
 * @type function
 * @description auto complete user
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const userAutoComplete = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    data.search_key = `%${data.search_key}%`
    async.waterfall([
      (callback) => commonModel({ module_name: "USER", method_name: "USER_AUTO_COMPLETE" }, data, callback),
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


export { userStatusUpdate, userBlockUnblock, userAutoComplete };
