import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { commonModel } from '../../common/models/common.model';
import { getDataTableSetting, } from '../../../../helpers/common-functions';
import { DATATABLE } from '../../../../config/datatable';
import { createChatSP } from '../../chat/services/chat.service'

/**
 * @type function
 * @description Contacts Pagination List Get
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const contactsPaggingListGet = (req, res) => {
  try {
    let setting = getDataTableSetting(_.assign(req.body, req.query), DATATABLE.CONTACTS_DATATABLE_CONSTANTS);
    let data = _.assign(req.body, req.query, req.params, req.jwt, setting);
    async.parallel([
      (callback) => {
        commonModel({ module_name: "CONTACTS", method_name: "CONTACTS_PAGGING_COUNT_GET" }, data, callback);
      },
      (callback) => {
        commonModel({ module_name: "CONTACTS", method_name: "CONTACTS_PAGGING_GET" }, data, callback);
      }
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          let result = {
            count: (response[0] || {}).count,
            contacts: response[1]
          }
          httpResponse.sendSuccess(res, result);
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}

/**
 * @type function
 * @description Contacts Search List Get
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const contactsSearchGet = (req, res) => {
  try {
    let data = _.assign(req.body, req.query, req.params, req.jwt);

    if (data.username) {
      data.username = '%' + data.username + '%';
    } else {
      data.username = '%' + '%';
    };

    async.waterfall([
      (callback) => {
        commonModel({ module_name: "CONTACTS", method_name: "CONTACTS_SEARCH_GET" }, data, callback);
      }
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res, response);
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}


/**
 * @type function
 * @description Create all contact chat
 * @param (object) req : Request information from route()
 * @param (object) res : Response the result(filename)
 * @return (undefined)
 */
const createChatForAllContact = (req, res) => {
  try {
    async.waterfall([
      (callback) => commonModel({ module_name: "CONTACTS", method_name: "CONTACTS_GET_ALL_IN_NOT_CHAT" }, {}, callback),
      (response, callback) => {
        let count = 0
        async.whilst(
          () => { return count < response.length },
          (listCallback) => {
            createChatSP(response[count], (err, response) => {
              listCallback(err, response)
              count++
            })
          },
          callback
        )
      }
    ],
      (err, response) => {
        // err if validation fail
        if (err) {
          httpResponse.sendFailer(res, err.code, err);
          return;
        } else {
          httpResponse.sendSuccess(res);
        }
      });
  } catch (err) {
    httpResponse.sendFailer(res, 500);
  }
}

export { contactsPaggingListGet, contactsSearchGet, createChatForAllContact };
