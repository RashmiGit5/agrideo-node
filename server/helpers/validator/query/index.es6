/**
 * @type function
 * @description Validates the query made for retrieving user document from db based on sa_email
 * @returns {Boolean} true if the query is valid
 * @param {Object} doc: the doc gotten from db
 * @param {String} sa_email: query is made based on sa_email
 */
const validEmail = (doc, sa_email) => {
	if (!doc || !sa_email || (doc.sa_email != sa_email))
		return false;
	return true;
};

/**
 * @type function
 * @description Validates the query made for retrieving any document from db based on any property of the document
 * @returns {Boolean} true if the query is valid
 * @param {Object} doc: the doc gotten from db
 * @param {String} query: The actual query is made based on this [query] argument
 */
const valid = (doc, query) => {
	if (!doc) return false;
	for (var key in query) {
		if (!doc[key]) {
			return false;
		}
		if (doc[key] != query[key])
			return false;
	}
	return true;
};

export default { validEmail, valid };