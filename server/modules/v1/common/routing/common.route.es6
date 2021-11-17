import { uploadCommonFile } from "../services/common.service";
import { uploadTempFileMulter } from '../../../../helpers/file-functions';

/**
 * @type function
 * @description Define apis url, validator, middleware and matching each function and method
 */

const commonroute = app => {

  app.post("/uploadfile", uploadTempFileMulter.single('file'), uploadCommonFile);


  return app;
};

/**
 * @exports commonroute
 * @description Export commonroute
 */
export default commonroute;
