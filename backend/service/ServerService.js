'use strict';

const utils = require('../utils/writer');

const Server = require('../models/db/Servers');
const History = require('../models/db/History');
const {
  redisClient,
  getAsync,
  setAsync
} = require('../service/redis')


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

  let page = index ? Math.ceil(index / LIMIT): Math.ceil(index + 1 / LIMIT);

  try {

    let result = await Server.findOneAndDelete({
      _id: id
    })

    let count = await Server.countDocuments()
    
    const totalPage = Math.ceil(count / LIMIT)

    redisClient.flushall()

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

    const result = await getAsync('server@' + JSON.stringify(objSearch) + `@${page}`)

    if (result) {
      return utils.respondWithCode(200, JSON.parse(result))
    } else {
      const count = await Server.countDocuments(objSearch);

      const totalPage = Math.ceil(count / LIMIT)

      var servers = await Server.find(objSearch).limit(LIMIT).skip((page - 1) * LIMIT)

      const cache = await setAsync('server@' + JSON.stringify(objSearch) + `@${page}`, 1000 * 5 * 50, JSON.stringify({
        servers,
        page,
        totalPage
      }))

      return utils.respondWithCode(200, {
        servers,
        page,
        totalPage
      })
    }


  } catch (error) {
    return utils.respondWithCode(500, error.message)
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

    const value = await getAsync(JSON.stringify(id) + '@' + JSON.stringify(objSearch))

    if (value) {
      return utils.respondWithCode(200, { data: value})
    } else {
      const server = await History.findOne({
        serverId: id
      })

      if (!server) {
        return utils.respondWithCode(404, {
          message: 'Server is not exist',
          code: 404
        });

      } else {
        if (date) {
          const data = await Server.findById(id).elemMatch(
            "history", objSearch)

          const cache = await setAsync(JSON.stringify(id) + '@' + JSON.stringify(objSearch), 1000 * 5 * 50, JSON.stringify(data?.history))

          return utils.respondWithCode(200, {
            data: data?.history
          })
        } else {
          const cache = await setAsync(JSON.stringify(id) + '@' + JSON.stringify(objSearch), 1000 * 5 * 50, JSON.stringify(server.history))

          return utils.respondWithCode(200, {
            data: server.history
          })
        }
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

      const servers2 = await Server.find({
        IP: body.IP
      })

      for (let i = 0; i < servers2.length; i++) {
        if (servers2[i].port === body.port) {
          return utils.respondWithCode(409, {
            code: 409,
            message: 'Error. Existed server'
          })
        }
      }

      const arr = Object.getOwnPropertyNames(body)

      let obj = {}

      arr.forEach(item => {
        obj[`${item}_old`] = server[item]
      })

      Object.assign(server, body)

      const serverHistory = await History.findOne({
        serverId: id
      })

      serverHistory.history.push(obj)

      await serverHistory.save()
      await server.save()

      await redisClient.flushall()

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

  if (servers.length > 0) {
    for (let i = 0; i < servers.length; i++) {
      if (servers[i].port === body.port) {
        return utils.respondWithCode(409, {
          code: 409,
          message: 'Error. Existed server'
        })
      }
    }
  }

  let status

  try {
    let checkStatus = await ssh.connect({
      host: body.ip,
      username: body.username,
      port: body.port,
      password: body.password,
    })

    status = true
  } catch (error) {
    status = false
  }

  const newServer = new Server({
    IP: body.ip,
    port: body.port,
    description: body.description,
    username: body.username,
    password: body.password,
    status: status,
  })

  try {
    let createdServer = await newServer.save()

    const newHistory = new Server({
      serverId: createdServer,
      history: [{
        port_old: body.port,
        password_old: body.password,
        status_old: status,
        username_old: body.username,
      }],
    })
    await newHistory.save()

    let index = await Server.countDocuments()
    let page = Math.ceil(index / LIMIT)

    await redisClient.flushall()

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
          const serverHistory = await History.findOne({
            serverId: id
          })
          server.status = newStatus;
          serverHistory.history.push({
            status_old: newStatus,
          })
          await redisClient.flushall()
          await server.save()
          await serverHistory.save()
        }


        return utils.respondWithCode(200, {
          code: 200,
          status: 'On'
        })
      } catch (error) {
        const newStatus = false
        if (newStatus !== status) {
          const serverHistory = await History.findOne({
            serverId: id
          })
          server.status = newStatus;
          serverHistory.history.push({
            status_old: newStatus,
          })
          await redisClient.flushall()
          await server.save()
          await serverHistory.save()
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
          const serverHistory = await History.findOne({
            serverId: id
          })
          serverHistory.history.push({
            status_old: newStatus,
          })
          await redisClient.flushall()
          await item.save()
          await serverHistory.save()
        }

        return

      } catch (error) {
        const newStatus = false
        if (newStatus !== status) {
          const serverHistory = await History.findOne({
            serverId: id
          })
          serverHistory.history.push({
            status_old: newStatus,
          })
          await redisClient.flushall()
          await item.save()
          await serverHistory.save()
        }

        return
      }

    })
  }
}