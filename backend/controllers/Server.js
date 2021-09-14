'use strict';

var utils = require('../utils/writer.js');
var Server = require('../service/ServerService');

module.exports.serverDELETE = function serverDELETE(req, res, next, id) {
  Server.serverDELETE(id)
    .then(function (response) {
      redisClient.set('serverData', null);
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response)
    });
};


//cacheable
module.exports.serverGET = function serverGET(req, res, next, p, q, status, start, end) {
  Server.serverGET(p, q, status, start, end)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
}
//cacheable
module.exports.serverHistoryIdGET = function serverHistoryIdGET(req, res, next, start, end, id) {
  Server.serverHistoryIdGET(start, end, id)
    .then(function (response) {
      redisClient.set(`history-${id}`, JSON.stringify(response));
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
}

module.exports.serverIdPUT = function serverIdPUT(req, res, next, body, id) {
  Server.serverIdPUT(body, id)
    .then(function (response) {
      redisClient.set('serverData', null)
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.serverPOST = function serverPOST(req, res, next, body) {
  Server.serverPOST(body)
    .then(function (response) {
      redisClient.set('serverData', null);
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