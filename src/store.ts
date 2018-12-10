import Vue from 'vue'
import Vuex from 'vuex'
import Brewery from './models/brewery'
import Event from './models/event'
import axios from './server-axios'
import { Actions, Mutations } from '@/util/vuex-types'
import moment from 'moment'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loggedIn: false,
    breweries: [] as Brewery[],
    events: [] as Event[],
  },
  mutations: {
    [Mutations.SET_BREWERIES](state, breweries) {
      state.breweries = breweries
    },
    [Mutations.SET_EVENTS](state, events) {
      state.events = events
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
