import { GENERAL } from '../../config/general';
import ErrorManager from '../error-manager';
import _ from 'lodash';
/**
 * @type function
 * @description Generates token with a lenght of 30
 * @returns {string} generated token
 */
const generateToken = () => {
	let text = '';
	for (let i = 0; i < 30; i++)
		text += GENERAL.ALPHABET_AND_DIGITS.charAt(Math.floor(Math.random() * GENERAL.ALPHABET_AND_DIGITS.length));
	return text;
};

/**
 * @type function
 * @description Generates token with a lenght of 30
 * @returns {string} generated token
 */
const generatePassword = () => {
	let text = '';
	for (let i = 0; i < 8; i++)
		text += GENERAL.ALPHABET_AND_DIGITS.charAt(Math.floor(Math.random() * GENERAL.ALPHABET_AND_DIGITS.length));
	return text;
};

export { generateToken, generatePassword };