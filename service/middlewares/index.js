require('dotenv').config()

var jwt = require("jsonwebtoken");

const utils = require('../../utils/writer')

module.exports.auth = async function (req,res,next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    let decodedData;

    if (token) {
      try {
        decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (decodedData) {
          next()
        }
      } catch (err) {
         return utils.writeJson(res, utils.respondWithCode(401, err))
      }
    } else {
      return utils.writeJson(res, utils.respondWithCode(401, {
        message: 'Unauthorized',
        code: '401'
      }))
    }
  } catch (error) {
    return utils.writeJson(res, utils.respondWithCode(401, error))
  }
};