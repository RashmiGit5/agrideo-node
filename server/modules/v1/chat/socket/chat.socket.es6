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
    if (data.chatDetail.user_id !== data.chatDetail.blocked_uid) {
      io.sockets.in(`${data.chatDetail.user_id}`).emit("on_new_message", data.messageDetail)
    }

    if (data.chatDetail.friend_id !== data.chatDetail.blocked_uid) {
      io.sockets.in(`${data.chatDetail.friend_id}`).emit("on_new_message", data.messageDetail)
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
    io.sockets.in(`${response.user_id}`).emit("on_delete_message", data)
    io.sockets.in(`${response.friend_id}`).emit("on_delete_message", data)
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
