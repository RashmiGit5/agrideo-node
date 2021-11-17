import { ERRORS, ERROR_LANGUAGES } from '../../config/error-manager';

import httpResponse from '../../helpers/http-response';

import _ from 'lodash';

const set = httpResponse.set;

/**
 * @type function
 * @access private
 * @param {string} name - The name of the key of [ERRORS] constant object 
 * @description Returns error object by the key name in [ERRORS] constant object 
 * @returns {object}
 */
const _getErrorByName = (name) => {
	let error = ERRORS[name];
	if (!error) {
		let e = new ReferenceError('The error object can\'t be get for the provided error name');
		throw e;
	}
	return error;
};

/**
 * @type function
 * @access private
 * @param {number} code - The error code name inside [ERRORS] constant object 
 * @description Returns error object by the code name inside [ERRORS] constant object 
 * @returns {object}
 */
const _getErrorByCode = (code) => {
	let error;

	_(ERRORS).forEach((err) => {
		if (err.CODE == code) {
			error = err;
		}
	});
	if (!error) {
		let e = new ReferenceError('The error object can\'t be get for the provided error code');
		throw e;
	}
	return error;
};

/**
 * @type function
 * @access private
 * @param {object} error - Errors type of object containing information about error
 * @param {string} lang - The error language in which it is required to parse
 * @description Parse the provided Errors type of object into provided type (ex. http) specific object
 * @returns {object}
 */
const _parseErrorTo = (error, lang) => {
	lang = lang.toLowerCase();
	let isValidLang = false;
	_(ERROR_LANGUAGES).forEach((LANG) => {
		if (LANG == lang) {
			isValidLang = true;
		}
	});
	if (!isValidLang) {
		let e = new ReferenceError('The error object can\'t be get for the provided error language');
		throw e;
	}
	if (lang == 'http') {
		return httpResponse.makeError(error.httpCode, error.message, error.code);
	}
};

/**
 * @type function
 * @access public
 * @param {string} key - The key of error object or the error code inside [ERRORS] constant object 
 * @param {string} message - An optional parameter for describing error
 * @description Returns error object by the key name or the error code in [ERRORS] constant object
 * @returns {object}
 */
const getError = (key, message) => {
	let _key = parseInt(key);
	let error;
	if (!_.isNaN(_key))
		error = _getErrorByCode(_key);
	else
		error = _getErrorByName(key);

	error = new Errors(error, message);

	return error;
};

/**
 * @type function
 * @access public
 * @param {string} key - The key of error object or the error code inside [ERRORS] constant object 
 * @param {string} message - An optional parameter for describing error
 * @description Returns http specific error object by the key name or the error code in [ERRORS] constant object
 * @returns {object}
 */
const getHttpError = (key, message) => {
	// return getError(key, message).parseTo("http");
	let _key = parseInt(key);
	let error;
	if (!_.isNaN(_key))
		error = _getErrorByCode(_key);
	else
		error = _getErrorByName(key);

	error = new Errors(error, message);

	return error;
};

/**
 * @class
 * @classdesc - Errors class creates error object which could be parse from one defined type to the another defined type

 */
class Errors {
	constructor(error, message) {
		this.code = error.rsmsg_msg_code || error.CODE;
		this.message = message || error.DEFAULT_MESSAGE;
		this.defaultMessage = message || error.DEFAULT_MESSAGE;
		this.httpCode = error.rsmsg_http_code || error.HTTP_CODE;
	}
	parseTo(lang) {
		return _parseErrorTo(this, lang);
	}
}

export default { set, getError, getHttpError };