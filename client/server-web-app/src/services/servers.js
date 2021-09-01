import SwaggerClient from 'swagger-client'

const spec = require('../../spec.json')

class allServerServices {
    getDataFunction(token) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: 'serverGET',
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
    }, array) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: "serverDELETE",
            securities: {
                authorized: {
                    bearerAuth: token
                }
            },
            parameters: {
                array_id: array
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
    }, id) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: "serverHistoryIdGET",
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

    async search({
        token
    }, {
        q,
        status,
        start,
        end
    }) {
        if(start) {
            start = start + "T00:00:00.000Z"
        }
        if(end) {
            end = end + "T23:59:59.000Z"
        }
        
        return SwaggerClient.execute({
            spec: spec,
            operationId: "searchGET",
            securities: {
                authorized: {
                    bearerAuth: token
                }
            },
            parameters: {
                q,
                status,
                start,
                end
            },
        })
    }

    async exportCSV({
        token
    }) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: "exportCSVGET",
            securities: {
                authorized: {
                    bearerAuth: token
                }
            }
        })
    }
}


export default new allServerServices()