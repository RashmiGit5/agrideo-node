import {
  chatCreate, chatDetail, chatUserDetail, chatSendMsg, chatMessageGet, chatPaggingListGet, chatMessageDelete,
  chatListSearchMessage, chatListSearchContact
} from "../services/chat.service";
import { commonValidator } from '../../common/validators/common.validator';

/**
 * @type function
 * @description Define apis url, validator, middleware and matching each function and method
 */

const chatroute = app => {

  app.post("/chat", commonValidator('v1/schema/chat/chat-list'), chatPaggingListGet);

  app.post("/chat/create", commonValidator('v1/schema/chat/chat-create'), chatCreate);

  app.post("/chat/search-message", commonValidator('v1/schema/chat/chat-list-search'), chatListSearchMessage);

  app.post("/chat/search-contact", commonValidator('v1/schema/chat/chat-list-search'), chatListSearchContact);

  app.post("/chat/send-message", commonValidator('v1/schema/chat/chat-send-msg'), chatSendMsg);

  app.post("/chat/get-message", commonValidator('v1/schema/chat/chat-get-message'), chatMessageGet);

  app.post("/chat/message/delete", commonValidator('v1/schema/chat/chat-message-delete'), chatMessageDelete);

  app.get("/chat/user/:user_id", commonValidator('v1/schema/chat/chat-user-detail'), chatUserDetail);

  app.get("/chat/:chat_id", commonValidator('v1/schema/chat/chat-detail'), chatDetail);

  return app;
};

/**
 * @exports chatroute
 * @description Export chatroute
 */
export default chatroute;
