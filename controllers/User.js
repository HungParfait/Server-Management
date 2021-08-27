'use strict';

var utils = require('../utils/writer.js');
var User = require('../service/UserService');

module.exports.userLoginPOST = function userLoginPOST (req, res, next, email, password) {
  User.userLoginPOST(email, password)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.userRegisterPOST = function userRegisterPOST (req, res, next, body) {
  User.userRegisterPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
