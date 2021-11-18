import { userStatusUpdate, userBlockUnblock } from "../services/user.service";
import { commonValidator } from '../../common/validators/common.validator';

/**
 * @type function
 * @description Define apis url, validator, middleware and matching each function and method
 */

const userroute = app => {

  app.patch("/user/status", commonValidator('v1/schema/user/status-update'), userStatusUpdate);

  app.post("/user/block-unblock", commonValidator('v1/schema/user/block-unblock'), userBlockUnblock);

  return app;
};

/**
 * @exports userroute
 * @description Export userroute
 */
export default userroute;
