import { JWT_CONSTANTS } from '../json/jwt.json';

/**
 * @constant json
 * @description JWT Constants for password & authtoken generation
 */
const JWTCONFIG = {
	'AES_SECRET_KEY': JWT_CONSTANTS.AES_SECRET_KEY
};

/**
 * @exports Jwt-Simple constants
 * @description Export Jwt-Simple constants
 */
export { JWTCONFIG };
