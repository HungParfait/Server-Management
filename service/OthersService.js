'use strict';

const utils = require('../utils/writer');

const Server = require('../models/db/Servers');

/**
 * exportCSV
 *
 * returns byte[]
 **/
exports.exportCSVGET = async function (req, res) {
    createXLSXfile()
    res.download('./server.xlsx','server.xlsx')
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
exports.searchGET = async function (req, q, status, start, end) {
    Server.find({
        'createdAt': {
            "$gte": start,
            "$lt": end
        },
        'IP': q,
        'status': status
    }, (err, server) => {
        if (err) return utils.respondWithCode(500, {
            message: 'Something went wrong.',
            code: 500
        });
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
    })
}

var createXLSXfile = exports.createXLSXfile =  async function() {
    try {
        var fs = require('fs')

        var xlsx = require('node-xlsx')

        var servers = await Server.find({})

        let dataExcel = []

        let arr1 = []

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

        var buffer = xlsx.build([{
            name: "Sheet1",
            data: dataExcel
        }]);

        fs.writeFile('./server.xlsx', buffer, function (err) {
            if (err) throw err;
        })

        return
    } catch (err) {
        console.log(err)
    }
}

createXLSXfile()