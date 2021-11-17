import CryptoJS from 'crypto-js';
import { JWTCONFIG } from '../../config/auth';


/*
    encryption token
*/
const encrypt = (value) => {
  const key = CryptoJS.enc.Utf8.parse(JWTCONFIG.AES_SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(JWTCONFIG.AES_SECRET_KEY);
  const encrypted = CryptoJS.AES.encrypt(value.trim(), key, {
    keySize: 16,
    iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}


/*
    decription token
*/
const decrypt = (value) => {
  const key = CryptoJS.enc.Utf8.parse(JWTCONFIG.AES_SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(JWTCONFIG.AES_SECRET_KEY);
  return CryptoJS.AES.decrypt(
    value, key, {
    keySize: 16,
    iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
}


export { encrypt, decrypt }