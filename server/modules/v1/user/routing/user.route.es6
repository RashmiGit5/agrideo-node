import { userStatusUpdate, userBlockUnblock, userAutoComplete, userDetailGet } from "../services/user.service";
import { commonValidator } from '../../common/validators/common.validator';
import { checkUserToken } from '../../auth/services/auth.service';

/**
 * @type function
 * @description Define apis url, validator, middleware and matching each function and method
 */

const userroute = app => {

  app.patch("/user/status", checkUserToken, commonValidator('v1/schema/user/status-update'), userStatusUpdate);

  app.post("/user/block-unblock", checkUserToken, commonValidator('v1/schema/user/block-unblock'), userBlockUnblock);

  app.get("/user/auto-complete", checkUserToken, commonValidator('v1/schema/user/auto-complete'), userAutoComplete);

  app.get("/user/detail", checkUserToken, userDetailGet);

  return app;
};

/**
 * @exports userroute
 * @description Export userroute
 */
export default userroute;
