import { HTTPCODE } from '../../config/http';

/**
 * @type object
 * @description Optional configurations such us whether should show custom error messages or not
 * @property {Boolean} showCustomErrMessages - Do not show custom error messages
 */
let _options = {
  showCustomErrMessages: true
};

/**
 * @type function
 * @description Sets configurations, such us whether should show custom error messages or not
 * @returns {undefined}
 * @param {Object} options: options 

 */
const set = (options) => {
  _options.showCustomErrMessages = options.showCustomErrMessages;
};

/**
 * @type function
 * @description Creats error
 * @returns {Object} error information with error message and code
 * @param {Number} code: http error status code 
 * @param {String} message: Information about the error
 */
const makeError = (code, message, msg_code) => {
  let httpCode = HTTPCODE['ERROR_' + code];
  let error;
  try {
    code = httpCode.CODE;
    error = {
      httpCode: code,
      message: message || httpCode.MESSAGE,
      msg_code: msg_code
    };
    if (!_options.showCustomErrMessages) {
      error.message = httpCode.MESSAGE;
    }
  } catch (error) {
    let err = new RangeError('The provided [code] http code:' + JSON.stringify(code)
      + ' is not valid. Please check the http config file.');
    throw err;
  }
  return error;
};

/**
 * @type function
 * @description Sends http failer response based on specified error status code
 * @returns {undefined}
 * @param {object} res: http response for sending failer response
 * @param {number} code: http status code
 * @param {object} error: optional parameter describs error message with error code
 */
const sendFailer = (res, code, error, errors) => {
  if (!error) {
    error = makeError(code);
  }
  res.status(error.httpCode);

  let response = {
    'status': error.httpCode,
    'message': error.message
  };

  if (error.code) {
    response['code'] = error.code;
  }
  if (errors) {
    response['errors'] = errors;
  }

  res.json(response);
};

/**
 * @type function
 * @description Sends http succeed response
 * @returns {undefined}
 * @param {object} res: http response for sending successful response
 * @param {number} code: http status code
 */
const sendSuccess = (res, result) => {
  let data;
  if (!result) {
    data = {
      'status': HTTPCODE.SUCCESS_200.CODE,
      'message': HTTPCODE.SUCCESS_200.MESSAGE
    };
  } else {
    data = {
      'status': HTTPCODE.SUCCESS_200.CODE,
      'message': HTTPCODE.SUCCESS_200.MESSAGE,
      'data': result.data || result
    };
  }
  res.status(HTTPCODE.SUCCESS_200.CODE);
  res.json(data);
};

/**
 * @type function
 * @description Sends http succeed response for datatable
 * @returns {undefined}
 * @param {object} res: http response for sending successful datatable response
 * @param {number} code: http status code
 */
const sendDataTableSuccess = (res, result) => {
  res.status(HTTPCODE.SUCCESS_200.CODE);
  res.json(result);
};



/**
 * @exports http response functions
 * @description Response to http request
 */
export default { sendSuccess, sendDataTableSuccess, sendFailer, makeError, set };