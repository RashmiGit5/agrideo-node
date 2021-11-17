
import ErrorManager from '../error-manager';
import axios from 'axios';

/**
 * @type function
 * @description Sends http failer response based on specified error status code
 * @returns {undefined}
 * @param {object} res: http response for sending failer response
 * @param {number} code: http status code
 * @param {object} error: optional parameter describs error message with error code
 */
const makeAxiosRequest = (method, url, data, callback) => {
  try {
    let payload = {
      method: method,
      url: url,
      headers: {
        'Authorization': `Bearer ${''}`
      }
    };

    if (data) {
      payload.data = data;
    }

    axios(payload).then(response => {
      if (!response) {
        callback(ErrorManager.getHttpError('SERVICE_ERROR'), null)
      } else {
        callback(null, response.data.data);
      }
    }).catch(err => {
      let error = ErrorManager.getHttpError('SERVICE_ERROR');
      callback(error, null);
    });
  }
  catch (err) {
    let error = ErrorManager.getHttpError('SERVICE_ERROR');
    callback(error, null);
  }
};

/**
 * @exports http response functions
 * @description Response to http request
 */
export { makeAxiosRequest };