import Vue from 'vue'
import Vuex from 'vuex'
import Brewery from './models/brewery'
import Event from './models/event'
import axios from './server-axios'
import { Actions, Mutations } from '@/util/vuex-types'
import moment from 'moment'
import User from './models/user'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: false,
    loggedInUser: {} as User,
    breweries: [] as Brewery[],
    events: [] as Event[],
    upcomingEvents: [] as Event[],
    pastEvents: [] as Event[],
    currentEvents: [] as Event[],
  },
  mutations: {
    [Mutations.SET_BREWERIES](state, breweries) {
      state.breweries = breweries
    },
    [Mutations.SET_EVENTS](state, events) {
      state.upcomingEvents = []
      state.pastEvents = []
      state.currentEvents = []
      const today = moment()
      events.forEach((element: Event) => {
        if (element.at.isAfter(today, 'day')) {
          state.upcomingEvents.push(element)
        } else if (element.at.isSame(today, 'day')) {
          state.currentEvents.push(element)
        } else {
          state.upcomingEvents.push(element)
        }
      })
      state.events = events
    },
    [Mutations.SET_AUTHENTICATED](state, authenticated) {
      state.authenticated = authenticated
    },
    [Mutations.SET_LOGGEDIN_USER](state, user) {
      state.loggedInUser = user
    },
  },
  actions: {
    async [Actions.FETCH_BREWERIES]({ commit }) {
      const { data } = await axios.get('breweries/')
      commit(Mutations.SET_BREWERIES, data)
    },
    async [Actions.FETCH_EVENTS]({ commit }, accessToken: string) {
      const { data } = await axios.get('events', {
        headers: {
          Authorization: 'Bearer ' + accessToken,
        },
      })
      data.map((el: any) => el.at = moment(el.at, 'DD-MM-YYYY hh-mm-ss A'))
      commit(Mutations.SET_EVENTS, data)
    },
  },
})
