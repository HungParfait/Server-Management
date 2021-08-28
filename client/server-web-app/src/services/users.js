import SwaggerClient from 'swagger-client'

import spec from '../../spec.json'

class allUserServices {
    login( { email, password } ) {
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

    register (user) {
        
    }

    handleHeader() {
        
    }
}

export default new allUserServices()