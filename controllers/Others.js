'use strict';

var utils = require('../utils/writer.js');
var Others = require('../service/OthersService');

module.exports.exportCSVGET = function exportCSVGET (req, res, next) {
  Others.exportCSVGET(res)
};

module.exports.searchGET = function searchGET (req, res, next, q, status, start, end) {
  Others.searchGET(q, status, start, end)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
