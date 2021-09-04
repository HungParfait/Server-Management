'use strict';

const utils = require('../utils/writer');

const Server = require('../models/db/Servers');

const {
  NodeSSH
} = require('node-ssh')

const LIMIT = 5
/**
 * delete one or many servers
 *
 * array_id List 
 * returns Success
 **/
exports.serverDELETE = async function (id) {
  let index = await Server.countDocuments({
    _id: {
      '$lt': id
    }
  })

  let page = Math.ceil(index / LIMIT)

  try {

    let result = await Server.findOneAndDelete({
      _id: id
    })

    let count = await Server.countDocuments()
    const totalPage = Math.ceil(count / LIMIT)

    return utils.respondWithCode(200, {
      page,
      totalPage
    })
  } catch (err) {

    return utils.respondWithCode(500, {
      message: 'Something went wrong.',
      code: 500
    });

  }
}


/**
 * get all servers
 *
 * p Integer Numeric ID of page (optional)
 * returns inline_response_200
 **/
var serverGET = exports.serverGET = async function (p, q, status, start, end) {
  const page = +p || 1;
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

    const count = await Server.countDocuments(objSearch);
    const totalPage = Math.ceil(count / LIMIT)

    var servers = await Server.find(objSearch).limit(LIMIT).skip((page - 1) * LIMIT)

    return utils.respondWithCode(200, {
      servers,
      page,
      totalPage
    })
  } catch (error) {
    return utils.respondWithCode(500, error)
  }
}

/**
 * get history
 *
 * id Integer Numeric ID of page
 * returns inline_response_200_1
 **/
exports.serverHistoryIdGET = async function (start, end, id) {
  try {
    let objSearch = {}
    let date = false
    if (start || end) {
      date = true

      objSearch['change_time'] = {}

      if (start) {
        start = new Date(start).toISOString()
        objSearch['change_time']['$gte'] = start
      }

      if (end) {
        end = new Date(end).toISOString()
        objSearch['change_time']['$lt'] = end
      }

    }
    
    const server = await Server.findById(id)

    if (!server) {
      return utils.respondWithCode(404, {
        message: 'Server is not exist',
        code: 404
      });
    } else {
      if(date) {
        const data = await Server.findById(id).elemMatch(
          "history", objSearch )
        return utils.respondWithCode(200, {
          data: data?.history
        })
      }
      else {
        return utils.respondWithCode(200, {
            data: server.history
        })
      }
    }
  } catch (error) {
    console.log(error)
    return utils.respondWithCode(500, error)
  }
}


/**
 * update server
 *
 * body ServerInfor 
 * id String ID of the server to update
 * returns Success
 **/
exports.serverIdPUT = async function (body, id) {
  try {
    let server = await Server.findById(id)
    if (!server) {
      return utils.respondWithCode(404, {
        message: 'Server is not exist',
        code: 404
      });
    } else {
      const arr = Object.getOwnPropertyNames(body)
      let obj = {}

      arr.forEach(item => {
        obj[`${item}_old`] = server[item]
      })

      if (body.password && body.password !== server.password) {
        try {
          let checkStatus = await ssh.connect({
            host: server.IP,
            username: server.username,
            port: server.port,
            password: server.password,
          })
        } catch (error) {
          return utils.respondWithCode(409, {
            message: 'Wrong password',
            code: 409
          })
        }
      }

      Object.assign(server, body)

      server.history.push(obj)

      await server.save()

      return utils.respondWithCode(200, {
        message: 'Update successfully',
        code: 200
      })
    }
  } catch (error) {
    console.log(error)
    return utils.respondWithCode(500, error);
  }
}


/**
 * create server
 *
 * body ServerInfor 
 * returns Success
 **/
exports.serverPOST = async function (body) {
  const servers = await Server.find({
    IP: body.ip
  })

  for (let i = 0; i < servers.length; i++) {
    if (servers[i].port === body.port) {
      return utils.respondWithCode(409, {
        code: 409,
        message: 'Error. Existed server'
      })
    }
  }

  const newServer = new Server({
    IP: body.ip,
    port: body.port,
    description: body.description,
    username: body.username,
    password: body.password,
    status: false,
    history: [{
      port_old: body.port,
      password_old: body.password,
      status_old: false,
      username_old: body.username,
    }],
  })

  try {
    let checkStatus = await ssh.connect({
      host: newServer.IP,
      username: newServer.username,
      port: newServer.port,
      password: newServer.password,
    })

    newServer.status = true
    newServer.history[0].status_old = true
  } catch (error) {}

  try {
    await newServer.save()
    let index = await Server.countDocuments()
    let page = Math.ceil(index / LIMIT)
    return serverGET(page)

  } catch (error) {
    return utils.respondWithCode(500, error)
  }
};



/**
 * Check servers status
 *
 * id String ID of the server to get status
 * returns inline_response_200_2
 **/
exports.serverStatusIdGET = async function (id) {
  try {
    const server = await Server.findById(id)
    if (!server) {
      return utils.respondWithCode(404, {
        message: 'Server is not exist',
        code: 404
      });
    } else {
      const {
        password,
        username,
        IP,
        port,
        status
      } = server
      const ssh = new NodeSSH()

      try {
        let checkStatus = await ssh.connect({
          host: IP,
          username: username,
          port: port,
          password: password,
        })

        const newStatus = true
        if (newStatus !== status) {
          server.status = newStatus;
          server.history.push({
            status_old: newStatus,
          })
          await server.save()
        }


        return utils.respondWithCode(200, {
          code: 200,
          status: 'On'
        })
      } catch (error) {
        const newStatus = false
        if (newStatus !== status) {
          server.status = newStatus;
          server.history.push({
            status_old: newStatus,
          })
          await server.save()
        }
        error.status = 'Off'
        return utils.respondWithCode(200, error)
      }

    }
  } catch (error) {
    return utils.respondWithCode(500, error)
  }
}

exports.checkStatusContinuous = async function () {
  const server = await Server.find({})
  if (server) {
    server.forEach(async (item) => {
      const {
        password,
        username,
        IP,
        port,
        status
      } = item
      const ssh = new NodeSSH()
      try {
        let checkStatus = await ssh.connect({
          host: IP,
          username: username,
          port: port,
          password: password,
        })

        const newStatus = true
        if (newStatus !== status) {
          item.status = newStatus;
          item.history.push({
            status_old: newStatus,
          })
          await item.save()
        }

        return

      } catch (error) {
        const newStatus = false
        if (newStatus !== status) {
          item.status = newStatus;
          item.history.push({
            status_old: newStatus,
          })
          await server.save()
        }

        return
      }

    })
  }
}