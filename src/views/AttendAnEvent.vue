<template>
    <main>
        <div v-if="!eventFound">
            <ul v-if="currentEvents.length > 0">
                <li class="text-left cursor-pointer text-xl" v-for="currentEvent in currentEvents" :key="currentEvent.id" @click="event = currentEvent; eventFound = true">{{ currentEvent.brewery.name }} on {{ formatDate(currentEvent.at)}} </li>
            </ul>
            <h2 v-else>There are no current events.</h2>
        </div> 
        <div v-else>
            <rate-brewery-form v-if="!breweryRated" :event="event" @rated="breweryRated = true"></rate-brewery-form>

            <div v-if="breweryRated" class="flex items-center bg-green text-white text-sm font-bold px-4 py-3 mt-6" role="alert">
                <p>Thank you for your rating! Click <router-link :to="'/event/' + event.id">here</router-link> to see all other ratings for this event.</p>
            </div>
        </div>
    </main>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import axios from '@/server-axios'
import * as moment from 'moment'
import Event from '@/models/event'
import { Actions } from '@/util/vuex-types'
import RateBreweryForm from '@/components/RateBreweryForm.vue'
import { RouteRecord, Route, RawLocation } from 'vue-router'
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
])

@Component({
    components: {
        'rate-brewery-form': RateBreweryForm,
    },
})
export default class AttendAnEvent extends Vue {
    code: string = ''
    eventFound: boolean = false
    destroyed: boolean = false
    error: string = ''
    event?: Event
    breweryRated = false
    @State currentEvents!: Event[]
    @Action [Actions.FETCH_EVENTS]: any

    async mounted() {
        if (this.currentEvents == null || this.currentEvents.length === 0) {
            await this.fetchEvents(await this.$auth.getAccessToken())
        }
    }

    formatDate(date: moment.Moment){
        return date.format('MMM DD, YYYY hh:mm A')
    }
}
</script>