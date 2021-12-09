import jwt from "jsonwebtoken"
import fs from "fs"
require('dotenv').config()


var privateKEY = fs.readFileSync(process.env.PATH_JWT_PRIVATE_KEY, 'utf8');

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