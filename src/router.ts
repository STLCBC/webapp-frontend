import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'
import PastEvents from './views/PastEvents.vue'
import UpcomingEvents from './views/UpcomingEvents.vue'
import AttendAnEvent from './views/AttendAnEvent.vue'
import HostEvent from './views/HostEvent.vue'
import ViewEvent from './views/ViewEvent.vue'
import Register from './views/Register.vue'

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
      path: '/implicit/callback',
      component: Auth.handleCallback(),
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/past-events',
      component: PastEvents,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/upcoming-events',
      component: UpcomingEvents,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/attend-an-event',
      component: AttendAnEvent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/host-an-event',
      component: HostEvent,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/event/:id',
      component: ViewEvent,
      meta: {
        requiresAuth: true,
      },
    },
  ],
})

const onAuthRequired = async (from: any, to: any, next: any) => {
  if (to.matched.some((record: RouteConfig) => record.meta.requiresAuth)
    && !(await Vue.prototype.$auth.isAuthenticated())) {
    // Navigate to custom login page
    next({ path: '/login' })
  } else {
    next()
  }
}

router.beforeEach(onAuthRequired)

export default router
