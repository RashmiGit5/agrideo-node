import CryptoJS from 'crypto-js';
import { JWTCONFIG } from '../../config/auth';
import jwt from "jsonwebtoken"


/*
    encryption token
*/
const encrypt = (value) => {
  var token = jwt.sign(value, JWTCONFIG.AES_SECRET_KEY);
  return token
}


/*
    decription token
*/
const decrypt = (token) => {
  try {
    var decoded = jwt.verify(token, JWTCONFIG.AES_SECRET_KEY);
    return decoded
  } catch (error) {
    return {}
  }
}


export { encrypt, decrypt }