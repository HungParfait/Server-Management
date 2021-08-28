'use strict';

var utils = require('../utils/writer.js');
var Server = require('../service/ServerService');

module.exports.serverDELETE = function serverDELETE(req, res, next, array_id) {
  Server.serverDELETE(array_id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.serverGET = function serverGET(req, res, next, p) {
  Server.serverGET(p)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
}

module.exports.serverHistoryIdGET = function serverHistoryIdGET(req, res, next, id) {
  Server.serverHistoryIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.serverIdPUT = function serverIdPUT(req, res, next, body, id) {
  Server.serverIdPUT(body, id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.serverPOST = function serverPOST(req, res, next, body) {
  Server.serverPOST(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.serverStatusIdGET = function serverStatusIdGET(req, res, next, id) {
  Server.serverStatusIdGET(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};