import SwaggerClient from 'swagger-client'

const spec = require('../../spec.json')

class allServerServices {
    getDataFunction(token, obj) {
        if(obj.start) {
            obj.start = obj.start + "T00:00:00.000Z"
        }
        if(obj.end) {
            obj.end = obj.end + "T23:59:59.000Z"
        }
        return SwaggerClient.execute({
            spec: spec,
            operationId: 'serverGET',
            parameters: obj,
            securities: {
                authorized: {
                    bearerAuth: token
                }
            },

        })
    }

    async update({
        token
    }, data, id) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: 'serverIdPUT',
            securities: {
                authorized: {
                    bearerAuth: token
                }
            },
            parameters: {
                id: id
            },
            requestContentType: 'application/json',
            requestInterceptor(req) {
                req.body = JSON.stringify(data);
                return req
            }
        })
    }

    async delete({
        token
    }, id) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: "serverDELETE",
            securities: {
                authorized: {
                    bearerAuth: token
                }
            },
            parameters: {
                id
            }
        })
    }

    async create({
        token
    }, server) {

        return SwaggerClient.execute({
            spec: spec,
            pathName: '/server',
            method: 'post',
            securities: {
                authorized: {
                    bearerAuth: token
                }
            },
            requestContentType: 'application/json',
            requestInterceptor(req) {
                req.body = JSON.stringify(server);
                return req
            }
        })


    }

    async getStatus({
        token
    }, id) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: "serverStatusIdGET",
            securities: {
                authorized: {
                    bearerAuth: token
                }
            },
            parameters: {
                id: id
            },
        })
    }

    async getHistory({
        token
    }, id, start, end) {
        if(start) {
            start = start + "T00:00:00.000Z"
        }
        if(end) {
            end = end + "T23:59:59.000Z"
        }
        return SwaggerClient.execute({
            spec: spec,
            operationId: "serverHistoryIdGET",
            securities: {
                authorized: {
                    bearerAuth: token
                }
            },
            parameters: {
                id,
                start,
                end
            },
        })
    }

    async exportXLSX({
        token
    }) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: "exportXLSXGET",
            securities: {
                authorized: {
                    bearerAuth: token
                }
            },
            requestContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
    }
}


export default new allServerServices()