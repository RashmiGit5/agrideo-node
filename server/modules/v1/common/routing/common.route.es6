import { uploadCommonFile, deleteCommonFile } from "../services/common.service";
import { uploadTempFileMulter } from '../../../../helpers/file-functions';
import { checkUserToken } from '../../auth/services/auth.service';

/**
 * @type function
 * @description Define apis url, validator, middleware and matching each function and method
 */

const commonroute = app => {

  app.post("/file/upload", checkUserToken, uploadTempFileMulter.single('file'), uploadCommonFile);

  app.post("/file/delete", checkUserToken, deleteCommonFile);

  return app;
};

/**
 * @exports commonroute
 * @description Export commonroute
 */
export default commonroute;
