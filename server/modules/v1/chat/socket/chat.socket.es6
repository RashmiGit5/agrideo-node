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
    console.log("\ndata ---> " + JSON.stringify(data));
    if (data.isSenderBlocked) {
      io.to(`${data.messageDetail.sender_id}`).emit("on_new_message", data.messageDetail)
    } else {
      if (data.chatDetail.user_id === data.messageDetail.sender_id || !data.chatDetail.chatStatus.is_blocked) {
        io.to(`${data.chatDetail.user_id}`).emit("on_new_message", data.messageDetail)
      }

      if (data.chatDetail.friend_id === data.messageDetail.sender_id || !data.chatDetail.chatStatus.is_blocked) {
        io.to(`${data.chatDetail.friend_id}`).emit("on_new_message", data.messageDetail)
      }
    }
  } catch (err) {

  }
}

/**
 * @type function
 * @description socekt delete message
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const socketDeleteMsg = (io, response, data) => {
  try {
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_LAST_MSG_GET" }, { chat_id: data.chat_id, user_id: response.chatDetail.user_id }, callback)
    ], (err, res) => {
      if (!err) {
        io.to(`${response.chatDetail.user_id}`).emit("on_delete_message", { ...data, last_message: res })
      }
    });

    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_LAST_MSG_GET" }, { chat_id: data.chat_id, user_id: response.chatDetail.friend_id }, callback)
    ], (err, res) => {
      if (!err) {
        io.to(`${response.chatDetail.friend_id}`).emit("on_delete_message", { ...data, last_message: res })
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

    if (data.isChatExist && data.from_symfony) {
      io.to(`${data.chat.user_id}`).emit("on_contact_request_accept", { chat_id: data.chat.id })
      io.to(`${data.chat.friend_id}`).emit("on_contact_request_accept", { chat_id: data.chat.id })
    }

    if (!data.isChatExist) {
      async.waterfall([
        (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { chat_id: data.chat.id, user_chat_id: data.chat.user_id }, callback),
      ],
        (err, response) => {
          io.to(`${data.chat.user_id}`).emit("on_new_chat_create", data)
          io.to(`${data.chat.friend_id}`).emit("on_new_chat_create", { chat: data.chat, user: response })
        });
    }
  } catch (err) {

  }
}

/**
 * @type function
 * @description socekt on message status update
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const socketMessageStatusUpdate = (io, data) => {
  try {
    io.sockets.emit("on_message_status_update", data)
  } catch (err) {

  }
}

export { socketNewMsg, socketDeleteMsg, socketNewChatCreate, socketMessageStatusUpdate };
