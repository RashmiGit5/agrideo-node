import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { commonModel } from '../../common/models/common.model';
import { getDataTableSetting, } from '../../../../helpers/common-functions';
import { DATATABLE } from '../../../../config/datatable';
import { GENERAL } from '../../../../config/general';
import { socketDeleteMsg, socketNewChatCreate, socketNewMsg, socketMessageStatusUpdate } from '../socket/chat.socket';

/**
 * @type function
 * @description Create Chat and user status
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatCreate = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    let isChatExist = false
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_CHECK_EXIST" }, data, callback),
      (res, callback) => {
        if (res) {
          isChatExist = true
          callback(null, res)
        } else {
          commonModel({ module_name: "CHAT", method_name: "CHAT_CREATE" }, data, callback)
        }
      },
      (res, callback) => {
        if (res.insertId) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_USER_STATUS_GET" }, { user_id: data.user_id }, (err, response) => {
            if (err) {
              callback(err, null)
            } else if (!response) {
              commonModel({ module_name: "CHAT", method_name: "CHAT_USER_STATUS_CREATE" }, { user_id: data.user_id, user_status: 1 }, (err, response) => callback(err, res))
            } else {
              callback(null, res)
            }
          })
        } else {
          callback(null, res)
        }
      },
      (res, callback) => {
        if (res.insertId) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_USER_STATUS_GET" }, { user_id: data.friend_id }, (err, response) => {
            if (err) {
              callback(err, null)
            } else if (!response) {
              commonModel({ module_name: "CHAT", method_name: "CHAT_USER_STATUS_CREATE" }, { user_id: data.friend_id, user_status: 1 }, (err, response) => callback(err, res))
            } else {
              callback(null, res)
            }
          })
        } else {
          callback(null, res)
        }
      },
      (res, callback) => {
        commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL" }, { chat_id: res.insertId || res.id }, callback)
      },
      (res, callback) => {
        commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { user_chat_id: data.friend_id }, (err, response) => {
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
          if (!isChatExist) {
            socketNewChatCreate(req.app.get('socketio'), response)
          }
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}

/**
 * @type function
 * @description get chat detail
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatDetail = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL" }, data, callback),
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

/**
 * @type function
 * @description Get chat user detail
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatUserDetail = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { user_chat_id: data.user_id }, callback),
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

/**
 * @type function
 * @description Chat Pagination List Get
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatPaggingListGet = (req, res) => {
  try {
    let setting = getDataTableSetting(_.assign(req.body, req.query), DATATABLE.CHAT_DATATABLE_CONSTANTS);
    let data = _.assign(req.body, req.query, req.params, req.jwt, setting);
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_PAGGING_COUNT_GET" }, data, callback),
      (response, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_PAGGING_GET" }, data, (err, res) => callback(err, { count: response.count || 0, chat: res })),
      (response, callback) => {
        let chatListData = response.chat || [], count = 0, modifiedChatData = []
        async.whilst(
          () => { return count < chatListData.length },
          (call) => {
            let user_chat_id = chatListData[count].user_id === data.user_id ? chatListData[count].friend_id : chatListData[count].user_id
            commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { user_chat_id }, (err, res) => {
              if (!err) {
                chatListData[count].user = res
                modifiedChatData.push(chatListData[count])
              }
              count++
              call(err, res)
            })
          },
          () => {
            response.chat = modifiedChatData
            callback(null, response)
          }
        )
      },
      (response, callback) => {
        let chatListData = response.chat || [], count = 0, modifiedChatData = []
        async.whilst(
          () => { return count < chatListData.length },
          (call) => {
            commonModel({ module_name: "CHAT", method_name: "CHAT_LAST_MSG_GET" }, { chat_id: chatListData[count].id, user_id: data.user_id }, (err, res) => {
              if (!err) {
                chatListData[count].message = res
                modifiedChatData.push(chatListData[count])
              }
              count++
              call(err, res)
            })
          },
          () => {
            response.chat = modifiedChatData
            callback(null, response)
          }
        )
      }
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

/**
 * @type function
 * @description Chat message list search
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatListSearchMessage = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    data.search_key = `%${data.search_key}%`
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_LIST_MESSAGE_SEARCH" }, data, callback),
      (response, callback) => {
        let chatListData = response || [], count = 0, modifiedChatData = []
        async.whilst(
          () => { return count < chatListData.length },
          (call) => {
            let user_chat_id = chatListData[count].user_id === data.user_id ? chatListData[count].friend_id : chatListData[count].user_id
            commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { user_chat_id }, (err, res) => {
              if (!err) {
                chatListData[count].user = res
                modifiedChatData.push(chatListData[count])
              }
              count++
              call(err, res)
            })
          },
          () => {
            callback(null, modifiedChatData)
          }
        )
      }
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

/**
 * @type function
 * @description Chat contact list search
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatListSearchContact = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    data.search_key = `%${data.search_key}%`
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_LIST_CONTACT_SEARCH" }, data, callback),
      (response, callback) => {
        let chatListData = response || [], count = 0, modifiedChatData = []
        async.whilst(
          () => { return count < chatListData.length },
          (call) => {
            commonModel({ module_name: "CHAT", method_name: "CHAT_LAST_MSG_GET" }, { chat_id: chatListData[count].id, user_id: data.user_id }, (err, res) => {
              if (!err) {
                chatListData[count].message = res
                modifiedChatData.push(chatListData[count])
              }
              count++
              call(err, res)
            })
          },
          () => {
            callback(null, modifiedChatData)
          }
        )
      }
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

/**
 * @type function
 * @description send chat message
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const chatSendMsg = (io, data) => {
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
        socketNewMsg(io, response)
      }
    });
  } catch (err) {
  }
}

/**
 * @type function
 * @description Message Pagination List Get
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatMessageGet = (req, res) => {
  try {
    let setting = getDataTableSetting(_.assign(req.body, req.query), DATATABLE.CHAT_MESSAGE_DATATABLE_CONSTANTS);
    let data = _.assign(req.body, req.query, req.params, req.jwt, setting);
    async.series([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_COUNT_GET" }, data, callback),
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_GET" }, data, callback),
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          let result = {
            count: (response[0] || {}).count,
            chat: response[1]
          }
          httpResponse.sendSuccess(res, result);
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}

/**
 * @type function
 * @description Chat message delete
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatMessageDelete = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    if (data.messages_id && data.messages_id.length === 0) {
      httpResponse.sendFailer(res, 400);
      return
    }

    let sentMsg = [], receivedMsg = [], deleteMsgStatus = 1

    if (data.deleted_for_everyone) {
      deleteMsgStatus = 3
      sentMsg = data.messages_id.map(ele => ele.id)
    } else {
      data.messages_id.forEach(element => {
        if (element.sender_id === data.user_id) {
          sentMsg.push(element.id)
        } else {
          receivedMsg.push(element.id)
        }
      });
    }

    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_DELETE" }, { chat_messages_id: sentMsg, msg_status: deleteMsgStatus }, callback),
      (res, callback) => {
        if (receivedMsg.length > 0) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_DELETE" }, { chat_messages_id: receivedMsg, msg_status: 2 }, callback)
        } else {
          callback(null, res)
        }
      },
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL" }, data, callback),
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res);
          if (data.deleted_for_everyone) {
            socketDeleteMsg(req.app.get('socketio'), response, data)
          }
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}

/**
 * @type function
 * @description Chat message update message status
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const messageReceiveStstusUpdate = (io, data) => {
  try {
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_STATUS_UPDATE" }, { message_ids: data.message_id, msg_status: data.is_read ? 3 : 2 }, callback),
    ],
      (err, response) => {
        if (err) {
        } else {
          socketMessageStatusUpdate(io, { message_id: data.message_id, msg_status: data.is_read ? 3 : 2 })
        }
      });
  } catch (err) {
  }
}


/**
 * @type function
 * @description Chat message status update
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatMessageStatusUpdate = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_STATUS_UPDATE" }, { message_ids: data.messages_id, msg_status: data.is_read ? 3 : 2 }, callback),
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res);
          socketMessageStatusUpdate(req.app.get('socketio'), { message_id: data.messages_id, msg_status: data.is_read ? 3 : 2 })
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}

export {
  chatCreate, chatDetail, chatUserDetail, chatPaggingListGet, chatListSearchMessage, chatSendMsg, chatMessageGet,
  chatMessageDelete, chatListSearchContact, messageReceiveStstusUpdate, chatMessageStatusUpdate
};
