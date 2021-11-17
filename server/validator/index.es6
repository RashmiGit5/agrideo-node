import validator from 'is-my-json-valid';
import formats from './formats';

/**
 * @type function
 * @description define common method for request validation.
 */

const validators = (schemaName) => {

	// import schema from schemaName
	const schema = require(`./${schemaName}`);
	if (!schema) {
		throw new Error('invalid schema: ' + schemaName);
	}
	return validator(schema.default, { formats: formats, greedy: true });
};

/**
 * @exports validators
 * @description Export common validators
 */
export default validators;