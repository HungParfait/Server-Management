import SwaggerClient from 'swagger-client'

import spec from '../../spec.json'

class allUserServices {
    login({
        email,
        password
    }) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: 'userLoginPOST',
            parameters: {
                email: email,
                password: password,
            },
        })
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return SwaggerClient.execute({
            spec: spec,
            operationId: 'userRegisterPOST',
            requestContentType: 'application/json',
            requestInterceptor(req) {
                req.body = JSON.stringify(user);
                return req
            }
        })
    }
}

export default new allUserServices()