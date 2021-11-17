import { chatCreate } from "../services/chat.service";
import { commonValidator } from '../../common/validators/common.validator';

/**
 * @type function
 * @description Define apis url, validator, middleware and matching each function and method
 */

const chatroute = app => {

  app.post("/chat/create", commonValidator('v1/schema/chat/chat-create'), chatCreate);

  return app;
};

/**
 * @exports chatroute
 * @description Export chatroute
 */
export default chatroute;
