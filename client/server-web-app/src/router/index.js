import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Server from '../views/Server.vue'
import Register from '../views/Register.vue'
import History from '../views/History.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/server',
    name: 'Server',
    component: Server
  },
  {
    path: '/history/:serverId',
    name: 'History',
    component: History
  },
  {
    path: '/',
    redirect: '/server'
  },
  {
    path: '*',
    redirect: '/server'
  },
]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  if (authRequired && !loggedIn) {
    next('/login');
  } else {
    next();
  }
});

export default router
