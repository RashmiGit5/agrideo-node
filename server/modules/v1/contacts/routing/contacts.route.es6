import { contactsPaggingListGet, contactsSearchGet } from "../services/contacts.service";
import { commonValidator } from '../../common/validators/common.validator';

/**
 * @type function
 * @description Define apis url, validator, middleware and matching each function and method
 */

const contactsroute = app => {

  app.post("/contact/list", commonValidator('v1/schema/contacts/contacts-pagging-get'), contactsPaggingListGet);

  app.get("/contact/search", commonValidator('v1/schema/contacts/contacts-search-get'), contactsSearchGet);

  return app;
};

/**
 * @exports contactsroute
 * @description Export contactsroute
 */
export default contactsroute;
