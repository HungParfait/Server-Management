'use strict';

var utils = require('../utils/writer.js');
var Others = require('../service/OthersService');


module.exports.exportXLSXGET = function exportXLSXGET (req, res, next) {
  Others.createXLSXfile().then( () => {
    Others.exportXLSXGET(res)
  })
};

