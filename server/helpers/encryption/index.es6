import jwt from "jsonwebtoken"
import fs from "fs"
require('dotenv').config()


var publicKEY = fs.readFileSync(process.env.PATH_JWT_PUBLIC_KEY, 'utf8');
var privateKEY = fs.readFileSync(process.env.PATH_JWT_PRIVATE_KEY, 'utf8');

/*
    encryption token
*/
const encrypt = (value) => {
  var token = jwt.sign(value, { key: privateKEY, passphrase: "" }, { algorithm: 'RS256' });
  return token
}


/*
    decription token
*/
const decrypt = (token) => {
  try {
    var decoded = jwt.verify(token, publicKEY, { algorithms: ['RS256'] });
    return decoded
  } catch (error) {
    return {}
  }
}


export { encrypt, decrypt }