import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { commonModel } from '../../common/models/common.model';
import { getDataTableSetting, } from '../../../../helpers/common-functions';
import { DATATABLE } from '../../../../config/datatable';
import { GENERAL } from '../../../../config/general';
import { socketDeleteMsg, socketNewChatCreate, socketNewMsg, socketMessageStatusUpdate } from '../socket/chat.socket';

var chatMsgRequestQueue = []

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
      (callback) => createChatSP(data, (err, response, chatExist) => {
        isChatExist = chatExist
        callback(err, response)
      }),
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res, response);
          if (!isChatExist || data.from_symfony) {
            socketNewChatCreate(req.app.get('socketio'), { ...response, from_symfony: data.from_symfony, isChatExist: isChatExist })
          }
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}


/**
 * @type function
 * @description Create Chat
 * @param (object) data : data from api
 * @param (object) callback : return callback
 * @return (undefined)
 */
const createChatSP = (data, callback) => {
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
      commonModel({ module_name: "CHAT", method_name: "CHAT_USER_STATUS_GET" }, { user_id: data.user_id }, (err, response) => {
        if (err) {
          callback(err, null)
        } else if (!response) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_USER_STATUS_CREATE" }, { user_id: data.user_id, user_status: 1 }, (err, response) => callback(err, res))
        } else {
          callback(null, res)
        }
      })
    },
    (res, callback) => {
      commonModel({ module_name: "CHAT", method_name: "CHAT_USER_STATUS_GET" }, { user_id: data.friend_id }, (err, response) => {
        if (err) {
          callback(err, null)
        } else if (!response) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_USER_STATUS_CREATE" }, { user_id: data.friend_id, user_status: 1 }, (err, response) => callback(err, res))
        } else {
          callback(null, res)
        }
      })
    },
    (res, callback) => {
      commonModel({ module_name: "CHAT", method_name: "CHAT_STATUS_GET" }, { chat_id: res.insertId || res.id, user_id: data.user_id }, (err, response) => {
        if (err) {
          callback(err, null)
        } else if (!response) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_STATUS_CREATE" }, { chat_id: res.insertId || res.id, user_id: data.user_id }, (err, response) => callback(null, res))
        } else {
          callback(null, res)
        }
      })
    },
    (res, callback) => {
      commonModel({ module_name: "CHAT", method_name: "CHAT_STATUS_GET" }, { chat_id: res.insertId || res.id, user_id: data.friend_id }, (err, response) => {
        if (err) {
          callback(err, null)
        } else if (!response) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_STATUS_CREATE" }, { chat_id: res.insertId || res.id, user_id: data.friend_id }, (err, response) => callback(null, res))
        } else {
          callback(null, res)
        }
      })
    },
    (res, callback) => {
      commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL" }, { chat_id: res.insertId || res.id }, callback)
    },
    (res, callback) => {
      commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { chat_id: res.insertId || res.id, user_chat_id: data.friend_id }, (err, response) => {
        if (err) {
          callback(err, null)
        } else {
          callback(null, { chat: res, user: response })
        }
      })
    },
  ], (err, response) => {
    callback(err, response, isChatExist)
  });
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
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { chat_id: data.chat_id, user_chat_id: data.user_id }, callback),
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
            commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { chat_id: chatListData[count].id, user_chat_id }, (err, res) => {
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
      },
      (response, callback) => {
        let chatListData = response.chat || [], count = 0, modifiedChatData = []
        async.whilst(
          () => { return count < chatListData.length },
          (call) => {
            commonModel({ module_name: "CHAT", method_name: "CHAT_UNREAD_MSG_COUNT" }, { chat_id: chatListData[count].id, user_id: data.user_id }, (err, res) => {
              if (!err) {
                chatListData[count].unread_msg_count = res.unread_msg_count
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
            commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { chat_id: chatListData[count].id, user_chat_id }, (err, res) => {
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
    data.search_key = `%${(data.search_key).split(" ").join("")}%`
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
  if (chatMsgRequestQueue.length === 0) {
    chatMsgRequestQueue.push({ io, data })
    msgQueueExecution()
  } else {
    chatMsgRequestQueue.push({ io, data })
  }
}

/**
 * @type function
 * @description check request in array and call api funciton
 * @param (bool) fromApi : is it from api function
 */
const msgQueueExecution = (fromApi = false) => {
  if (fromApi) {
    chatMsgRequestQueue.splice(0, 1);
  }

  if (chatMsgRequestQueue.length > 0) {
    addMsgInDBAndSocekt(chatMsgRequestQueue[0].io, chatMsgRequestQueue[0].data)
  }
}

/**
 * @type function
 * @description send chat message
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const addMsgInDBAndSocekt = (io, data) => {
  try {
    let isSenderBlocked = false
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_SENDER_STATUS_DETAIL" }, { ...data, user_id: data.sender_id }, callback),
      (res, callback) => {
        isSenderBlocked = !!res.is_blocked
        commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL" }, data, callback)
      },
      (res, callback) => {
        commonModel({ module_name: "CHAT", method_name: "CHAT_USER_STATUS_DETAIL" }, { ...data, user_id: data.sender_id }, (err, resp) => callback(err, { chatDetail: { ...res, chatStatus: resp } }))
      },
      (res, callback) => {
        data.msg_status = isSenderBlocked || !!res.chatDetail.chatStatus.is_blocked ? 4 : 1
        commonModel({ module_name: "CHAT", method_name: "CHAT_SEND_MESSAGE" }, data, (err, resp) => callback(err, { chatDetail: res.chatDetail, messageDetail: resp }))
      },
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MSG_FROM_ID" }, { id: res.messageDetail.insertId }, (err, resp) => callback(err, { chatDetail: res.chatDetail, messageDetail: resp })),
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_UPDATE_LAST_MESSAGE" }, data, (err, resp) => callback(err, res)),
    ], (err, response) => {
      msgQueueExecution(true)
      if (err) {
      } else {
        response.messageDetail.temp_id = data.temp_id
        response.isSenderBlocked = isSenderBlocked
        socketNewMsg(io, response)
      }
    });
  } catch (err) {
    msgQueueExecution(true)
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
    async.waterfall([
      (callback) => {
        if (!!data.message_id) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_OFFSET_COUNT_GET" }, data, (err, res) => {
            if (!!res && res.count) {
              req.body.page_index = Math.ceil(res.count / data.page_size)
              setting = getDataTableSetting(_.assign(req.body, req.query), DATATABLE.CHAT_MESSAGE_DATATABLE_CONSTANTS);
              data = _.assign(req.body, req.query, req.params, req.jwt, setting);
            }
            callback(err, res)
          })
        } else {
          callback(null, {})
        }
      },
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_COUNT_GET" }, data, callback),
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_GET" }, data, (err, response) => callback(err, { page_index: req.body.page_index, count: res.count, chat: response })),
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL_WITH_USER" }, data, (err, response) => callback(err, { ...res, contacts_id: response.contacts_id })),
      (res, callback) => {
        if (!res.contacts_id) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_TODAY_COUNT_GET" }, data, (err, response) => callback(err, { ...res, total_message_count: response.total_message_count }))
        } else {
          callback(null, { ...res, total_message_count: null })
        }
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

    let sentMsg = [], sentDeletedMsg = [], receivedMsg = [], receivedDeletedMsg = [], deleteMsgStatus = 1

    if (data.deleted_for_everyone) {
      deleteMsgStatus = 3
      sentMsg = data.messages_id.map(ele => ele.id)
    } else {
      data.messages_id.forEach(element => {
        if (element.sender_id === data.user_id) {
          if (element?.msg_status === 0) {
            sentMsg.push(element.id)
          } else {
            sentDeletedMsg.push(element.id)
          }
        } else {
          if (element?.msg_status === 0) {
            receivedMsg.push(element.id)
          } else {
            receivedDeletedMsg.push(element.id)
          }
        }
      });
    }

    async.waterfall([
      (callback) => {
        if (sentMsg.length > 0) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_DELETE" }, { chat_messages_id: sentMsg, msg_status: deleteMsgStatus }, callback)
        } else {
          callback(null, {})
        }
      },
      (res, callback) => {
        if (sentDeletedMsg.length > 0) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_DELETE" }, { chat_messages_id: sentDeletedMsg, msg_status: 3 }, callback)
        } else {
          callback(null, res)
        }
      },
      (res, callback) => {
        if (receivedDeletedMsg.length > 0) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_DELETE" }, { chat_messages_id: receivedDeletedMsg, msg_status: 3 }, callback)
        } else {
          callback(null, res)
        }
      },
      (res, callback) => {
        if (receivedMsg.length > 0) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_MESSAGE_DELETE" }, { chat_messages_id: receivedMsg, msg_status: 2 }, callback)
        } else {
          callback(null, res)
        }
      },
      (res, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL" }, data, callback),
      (res, callback) => {
        if (data.deleted_for_everyone) {
          callback(null, { chatDetail: res })
        } else {
          commonModel({ module_name: "CHAT", method_name: "CHAT_LAST_MSG_GET" }, data, (err, response) => callback(err, { chatDetail: res, last_message: response }))
        }
      }
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res, response);
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
          socketMessageStatusUpdate(io, { chat_id: data.chat_id, message_id: data.message_id, msg_status: data.is_read ? 3 : 2 })
        }
      });
  } catch (err) {
  }
}


/**
 * @type function
 * @description Chat Mark As Read Unread
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatMarkAsReadUnread = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_MARK_AS_READ_UNREAD" }, { ...data, status: data.mark_as_read ? 1 : null }, callback)
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res);
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}


/**
 * @type function
 * @description Read all chat message
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const messageReadAllMessage = (io, data) => {
  try {
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_READ_ALL_MESSAGE" }, data, callback),
    ],
      (err, response) => {
        if (err) {
        } else {
          socketMessageStatusUpdate(io, { ...data, msg_status: 3 })
        }
      });
  } catch (err) {
  }
}

/**
 * @type function
 * @description Receive all chat message
 * @param (object) io : socket io ref
 * @param (object) res : socket event data
 */
const messageReceivedAllMessage = (io, data) => {
  try {
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_GET_ALL_SEND_MESSAGE" }, { ...data, chat_msg_status: [1] }, callback),
      (res, callback) => {
        let chat_msg_id = (res || []).map(ele => ele.id)
        if (chat_msg_id.length > 0) {
          commonModel({ module_name: "CHAT", method_name: "CHAT_RECEIVE_ALL_MESSAGE" }, { chat_msg_id }, callback)
        } else {
          callback({ error: true }, null)
        }
      },
    ],
      (err, response) => {
        if (err) {
        } else {
          socketMessageStatusUpdate(io, { ...data, msg_status: 2 })
        }
      });
  } catch (err) {
  }
}


/**
 * @type function
 * @description Chat get total unread coount
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatGetTotalUnreadMsgCount = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_GET_ALL_SEND_MESSAGE" }, { ...data, chat_msg_status: [1, 2] }, callback),
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res, { count: (response || []).length });
        }
      });
  } catch (err) {
  }
}


/**
 * @type function
 * @description Chat detail as per user
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const chatDetailWithUser = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);
    async.waterfall([
      (callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_DETAIL_WITH_USER" }, data, callback),
      (response, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_USER_DETAIL" }, { chat_id: response.id, user_chat_id: response.user_id === data.user_id ? response.friend_id : response.user_id }, (err, res) => callback(err, { ...response, user: res })),
      (response, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_LAST_MSG_GET" }, { chat_id: response.id, user_id: data.user_id }, (err, res) => callback(err, { ...response, message: res })),
      (response, callback) => commonModel({ module_name: "CHAT", method_name: "CHAT_UNREAD_MSG_COUNT" }, { chat_id: response.id, user_id: data.user_id }, (err, res) => callback(err, { ...response, unread_msg_count: res.unread_msg_count }))
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

export {
  chatCreate, createChatSP, chatDetail, chatUserDetail, chatPaggingListGet, chatListSearchMessage, chatSendMsg, chatMessageGet,
  chatMessageDelete, chatListSearchContact, messageReceiveStstusUpdate, chatMarkAsReadUnread, messageReadAllMessage,
  messageReceivedAllMessage, chatGetTotalUnreadMsgCount, chatDetailWithUser
};
