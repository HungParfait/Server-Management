'use strict';

const utils = require('../utils/writer');

const Server = require('../models/db/Servers');

var path = require('path');

/**
 * exportXLSX
 *
 * returns byte[]
 **/
var exportXLSXGET = function (res) {
    res.download(path.join(__dirname, '../public/server.xlsx'),'server.xlsx')
}

/**
 * search servers
 *
 * q String  (optional)
 * status Boolean  (optional)
 * start Date  (optional)
 * end Date  (optional)
 * returns inline_response_200
 **/
async function createXLSXfile() {
    try {
        var fs = require('fs')

        var xlsx = require('node-xlsx')

        var servers = await Server.find({})

        let dataExcel = []

        let arr1 = []

        if (servers[0]) {
            Object.getOwnPropertyNames(servers[0]._doc).forEach(item => {
                if (item !== 'history' && item !== '__v') arr1.push(item)
            })

            dataExcel.push(arr1)

            servers.forEach(item1 => {
                let arr2 = []
                arr1.forEach(item2 => {
                    if (item2 === 'status') {
                        let value = item1[item2] ? 'On' : 'Off'
                        arr2.push(value)
                    } else arr2.push(item1[item2])
                })
                dataExcel.push(arr2)
            })
        }

        var buffer = xlsx.build([{
            name: "Sheet1",
            data: dataExcel
        }]);

        fs.writeFileSync(path.join(__dirname, '../public/server.xlsx'), buffer)
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    createXLSXfile,
    exportXLSXGET
}