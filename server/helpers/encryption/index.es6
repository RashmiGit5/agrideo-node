import CryptoJS from 'crypto-js';
import { JWTCONFIG } from '../../config/auth';
import jwt from "jsonwebtoken"
import fs from "fs"
import path from "path";


var privateKEY = fs.readFileSync(path.join(__dirname, 'private.pem'), 'utf8');

/*
    encryption token
*/
const encrypt = (value) => {
  var token = jwt.sign(value, privateKEY);
  return token
}


/*
    decription token
*/
const decrypt = (token) => {
  try {
    var decoded = jwt.verify(token, privateKEY);
    return decoded
  } catch (error) {
    return {}
  }
}


export { encrypt, decrypt }