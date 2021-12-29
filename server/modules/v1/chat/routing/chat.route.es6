import {
  chatCreate, chatDetail, chatUserDetail, chatMessageGet, chatPaggingListGet, chatMessageDelete,
  chatListSearchMessage, chatListSearchContact, chatMarkAsReadUnread, chatGetTotalUnreadMsgCount,
  chatDetailWithUser, chatSendMessageApi
} from "../services/chat.service";
import { commonValidator } from '../../common/validators/common.validator';
import { checkUserToken } from '../../auth/services/auth.service';

/**
 * @type function
 * @description Define apis url, validator, middleware and matching each function and method
 */

const chatroute = app => {

  app.post("/chat", checkUserToken, commonValidator('v1/schema/chat/chat-list'), chatPaggingListGet);

  app.post("/chat/send-message", chatSendMessageApi);

  app.post("/chat/create", checkUserToken, commonValidator('v1/schema/chat/chat-create'), chatCreate);

  app.get("/chat/search-message", checkUserToken, commonValidator('v1/schema/chat/chat-list-search'), chatListSearchMessage);

  app.get("/chat/search-contact", checkUserToken, commonValidator('v1/schema/chat/chat-list-search'), chatListSearchContact);

  app.post("/chat/get-message", checkUserToken, commonValidator('v1/schema/chat/chat-get-message'), chatMessageGet);

  app.post("/chat/message/delete", checkUserToken, commonValidator('v1/schema/chat/chat-message-delete'), chatMessageDelete);

  app.post("/chat/mark-as-read-unread", checkUserToken, commonValidator('v1/schema/chat/mark-as-read-unread'), chatMarkAsReadUnread);

  app.get("/chat/unread-msg-count", checkUserToken, chatGetTotalUnreadMsgCount);

  app.get("/chat/detail-with-user/:chat_id", checkUserToken, commonValidator('v1/schema/chat/chat-detail'), chatDetailWithUser);

  app.get("/chat/:chat_id/user/:user_id", checkUserToken, commonValidator('v1/schema/chat/chat-user-detail'), chatUserDetail);

  app.get("/chat/:chat_id", checkUserToken, commonValidator('v1/schema/chat/chat-detail'), chatDetail);

  return app;
};

/**
 * @exports chatroute
 * @description Export chatroute
 */
export default chatroute;
