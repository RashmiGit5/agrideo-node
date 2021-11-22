import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { commonModel } from '../../common/models/common.model';
import { getDataTableSetting, } from '../../../../helpers/common-functions';
import { DATATABLE } from '../../../../config/datatable';
import { GENERAL } from '../../../../config/general';

/**
 * @type function
 * @description socekt update user status
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const socketUserStatusUpdate = (io, data) => {
  try {
    io.sockets.emit("on_user_status_update", data)
  } catch (err) {

  }
}

/**
 * @type function
 * @description socekt block user
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const socketBlockChatUser = (io, data) => {
  try {
    io.sockets.emit("on_chat_user_block", data)
    io.sockets.in(`chat_${data.chat_id}`).emit("on_chat_user_block", data)
  } catch (err) {

  }
}

export { socketUserStatusUpdate, socketBlockChatUser };
