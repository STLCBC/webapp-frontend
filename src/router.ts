import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

import Auth from '@okta/okta-vue'

Vue.use(Router)
Vue.use(Auth, {
  issuer: process.env.VUE_APP_ISSUER,
  client_id: process.env.VUE_APP_CLIENTID,
  redirect_uri: process.env.VUE_APP_REDIRECT,
  scope: process.env.VUE_APP_SCOPE,
})

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/login',
      component: Login,
    },
  ],
})

const onAuthRequired = async (from: any, to: any, next: any) => {
  if (from.matched.some((record: RouteConfig) => record.meta.requiresAuth)
    && !(await Vue.prototype.$auth.isAuthenticated())) {
    // Navigate to custom login page
    next({ path: '/login' })
  } else {
    next()
  }
}

router.beforeEach(onAuthRequired)

export default router
