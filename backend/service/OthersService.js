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
var searchGET = async function (q, status, start, end) {
    try {
        let objSearch = {}

        if (start || end) {
            objSearch.createdAt = {}
            if (start) {
                start = new Date(start).toISOString()
                objSearch.createdAt['$gte'] = start
            }

            if (end) {
                end = new Date(end).toISOString()
                objSearch.createdAt['$lt'] = end
            }
        }

        if (q) objSearch.IP = q

        if (status) objSearch.status = status

        const server = await Server.find(objSearch)

        if (!server) {
            return utils.respondWithCode(404, {
                message: 'Server is not exist',
                code: 404
            });
        } else {
            return utils.respondWithCode(200, {
                server
            })
        }
    } catch (err) {
        return utils.respondWithCode(500, {
            message: 'Something went wrong.',
            code: 500
        });
    }
}

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
    searchGET,
    exportXLSXGET
}