import allUserServices from '../services/users'

const user = JSON.parse(localStorage.getItem('user'));
const initialValue = user ? {
    status: {
        loggedIn: true
    },
    user
} : {
    status: {
        loggedIn: false
    },
    user: null
};

export const auth = {
    state: initialValue,
    mutations: {
        loginSuccess(state, user) {
            state.status.loggedIn = true;
            state.user = user;
        },
        loginFailure(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        logout(state) {
            state.status.loggedIn = false;
            state.user = null;
        },
        registerSuccess(state) {
            state.status.loggedIn = false;
        },
        registerFailure(state) {
            state.status.loggedIn = false;
        }
    },
    actions: {
        login({
            commit
        }, user) {
            return allUserServices.login(user).then(
                    async ({ data }) => {
                        commit('loginSuccess', data);
                        return data
                    })
                .catch( (error) => {
                        commit('loginFailure');
                        return Promise.reject(error)
                    }
                );
        },
        logout({
            commit
        }) {
            allUserServices.logout();
            commit('logout');
        },
        register({
            commit
        }, user) {
            return allUserServices.register(user)
                .then( async response => {
                    commit('registerSuccess');
                    return response.data;
                })
                .catch(error => {
                    commit('registerFailure');
                    return Promise.reject(error)
                });
    }
}
}