import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { commonModel } from '../../common/models/common.model';
import { getDataTableSetting, } from '../../../../helpers/common-functions';
import { DATATABLE } from '../../../../config/datatable';
import { GENERAL } from '../../../../config/general';

/**
 * @type function
 * @description socekt send new message
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const socketNewMsg = (io, data) => {
  try {
    data.msg_status = 1
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_SEND_MESSAGE" }, data, callback),
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MSG_FROM_ID" }, { id: res.insertId }, callback),
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_UPDATE_LAST_MESSAGE" }, data, (err, resp) => callback(err, res)),
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL" }, data, (err, resp) => callback(err, { chatDetail: resp, messageDetail: res })),
    ], (err, response) => {
      if (err) {
      } else {
        response.messageDetail.temp_id = data.temp_id
        io.sockets.in(`${response.chatDetail.user_id}`).emit("on_new_message", response.messageDetail)
        io.sockets.in(`${response.chatDetail.friend_id}`).emit("on_new_message", response.messageDetail)
      }
    });
  } catch (err) {

  }
}

/**
 * @type function
 * @description socekt delete message
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const socketDeleteMsg = (io, data) => {
  try {
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL" }, data, callback),
    ], (err, response) => {
      if (err) {
      } else {
        io.sockets.in(`${response.user_id}`).emit("on_delete_message", data)
        io.sockets.in(`${response.friend_id}`).emit("on_delete_message", data)
      }
    });
  } catch (err) {

  }
}

/**
 * @type function
 * @description socekt new chat create
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const socketNewChatCreate = (io, data) => {
  try {
    io.sockets.in(`${data.chat.user_id}`).emit("on_new_chat_create", data)
    io.sockets.in(`${data.chat.friend_id}`).emit("on_new_chat_create", data)
  } catch (err) {

  }
}

export { socketNewMsg, socketDeleteMsg, socketNewChatCreate };
