import moment from 'moment';
import async from 'async';
import _ from 'lodash';
import httpResponse from '../../../../helpers/http-response';
import { commonModel } from '../../common/models/common.model';
import ErrorManager from '../../../../helpers/error-manager';
import { generateToken } from "../../../../helpers/token-generator";
import { encrypt, decrypt } from '../../../../helpers/encryption';

/**
 * @type function
 * @description check user token and validate
 * @param (object) req : Request information from route
 * @param (object) res : Response the result(error, success)
 * @return (undefined)
 */
const checkUserToken = (req, res, next) => {
    let token = req.body.token || req.query.token || req.params.token || req.headers['authorization'];
    token = token ? token.replace('Bearer', '').trim() : '';
    if (!!token) {
        const decoded = decrypt(token)
        if (!!decoded.user_id) {
            req.jwt = decoded
            next()
        } else {
            httpResponse.sendFailer(res, 400, ErrorManager.getHttpError("ACCESS_TOKEN_INVALID"), null);
        }
    } else {
        httpResponse.sendFailer(res, 400, ErrorManager.getHttpError("TOKEN_MISSING"), null);
    }
};

export { checkUserToken };
