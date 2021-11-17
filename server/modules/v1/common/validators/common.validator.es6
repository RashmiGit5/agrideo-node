import httpResponse from "../../../../helpers/http-response";
import ErrorManager from "../../../../helpers/error-manager";
import validatorFactory from "../../../../validator";
import _ from "lodash";

/**
* @type function Common Validator
* @param {object} 
* @property {object}
*/
function commonValidator(input) {
  return (req, res, next) => {
    let data = _.assign(req.body, req.query, req.params);
    const validate = validatorFactory(input);
    const isValid = validate(data);

    if (!isValid) {
      httpResponse.sendFailer(res, 422, null, validate.errors);
    } else {
      next();
    }
  };
}

/**
 * @type function
 * @description Common delete validator function for delete campaign
 * @param (object) req : Request information from route
 * @param (object) res : Response the result(error, success)
 * @return (undefined)
 */
const uploadFileValidator = (req, res, next) => {
  if (!req.files || !req.files.file) {
    httpResponse.sendFailer(res, 400, ErrorManager.getHttpError("FILE_MISSING"), null);
  } else {
    next();
  }
};

export { commonValidator, uploadFileValidator };
