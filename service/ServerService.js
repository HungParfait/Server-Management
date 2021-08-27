'use strict';

const utils = require('../utils/writer');

const Server = require('../models/db/Servers');

const {
  NodeSSH
} = require('node-ssh')

/**
 * delete one or many servers
 *
 * array_id List 
 * returns Success
 **/
exports.serverDELETE = async function (array_id) {
  array_id.forEach(item => {
    Server.findOneAndDelete(item, async (err, server) => {
      if (err) return utils.respondWithCode(500, {
        message: 'Something went wrong.',
        code: 500
      });
      if (!server) {
        return utils.respondWithCode(404, {
          message: 'Server is not exist',
          code: 404
        });
      }
    })
  })

  return utils.respondWithCode(200, {
    message: 'Delete successfully',
    code: 200
  })
}


/**
 * get all servers
 *
 * p Integer Numeric ID of page (optional)
 * returns inline_response_200
 **/
exports.serverGET = async function (p) {
  const page = +p || 1;
  const LIMIT = 20
  const count = await Server.countDocuments();
  const totalPage = Math.ceil(count / LIMIT)
  try {
    var servers = await Server.find({}).limit(LIMIT).skip((page - 1) * LIMIT)

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
exports.serverHistoryIdGET = async function (id) {
  try {
    console.log(id)
      const server =  await Server.findById(id)
      if (!server) {
        return utils.respondWithCode(404, {
          message: 'Server is not exist',
          code: 404
        });
      } else {
        return utils.respondWithCode(200, {
          data: server.history
        })
      }
  }
  catch(error) {
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

      Object.assign(server, body)

      server.history.push(obj)

      await server.save()

      return utils.respondWithCode(200, {
        message: 'Update successfully',
        code: 200
      })
  }
    }
  catch(error) {
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
    await newServer.save()
  } catch (error) {}

  try {
    await newServer.save()
    return utils.respondWithCode(200, {
      message: 'Created Successfully',
      code: 200
    })
  } catch (error) {
    return utils.respondWithCode(400, error)
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
        error.code = 400
        error.status = 'Off'
        return utils.respondWithCode(400, error)
      }

    }
  } catch (error) {
    return utils.respondWithCode(500, error)
  }
}

async function runContinuous() {
  const server = await Server.find({})
  if (server) {
    server.forEach( async (item) => {
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

var time = setInterval(runContinuous, 60 * 60 * 1000);