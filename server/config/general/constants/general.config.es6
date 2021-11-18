import { API_CONFIG, CHAT_MESSAGE_TYPE } from '../json/general';

/**
 * @constant general configs
 * @description Some general configs where each config doesn't need to be inside separate folders
 */
const GENERAL = {
	ALPHABET_AND_DIGITS: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
	STATUS: {
		'INSERTED': 1,
		'UPDATED': 2,
		'DELETED': 3,
		'ACTIVE': 1,
		'IN_ACTIVE': 0
	},
	FRONTEND_URL: API_CONFIG.FRONTEND_URL,
	API_URL: API_CONFIG.API_URL,
	CHAT_MESSAGE_TYPE: CHAT_MESSAGE_TYPE,
	SERVICE_FIELDS: {
		SERVICE_URL: '#service-url#' // replace tag for html templates 
	},
	DEFAULT_TIMEZONE: 'Asia/Kolkata',
	TEMP_FILE_PATH: {
		FILE_PATH: '/../../public/admin/tempfiles/',
		FILE_SERVER_PATH: '/admin/tempfiles/'
	},
	ORIGINAL_FILE_PATH: {
	},
	STATUS_ENUM: {
	}
};

/**
 * @exports General configs
 * @description Exports some general configs
 */
export { GENERAL };
