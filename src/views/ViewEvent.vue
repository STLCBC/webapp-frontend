<template>
    <main class="mx-auto container" v-if="event">
        <h2 class="mb-2">{{ event.brewery.name }}</h2>
        <h4 class="mb-2">{{ numberOfAttendees }} {{ peopleTerm }} attendeed this event</h4>
        <h4 class="mb-2">{{ formattedDate }}</h4>
        <p class="mb-2">Average Beer Rating: {{ averageBeer }}</p>
        <p>Average Experience Rating: {{ averageExperience }}</p>

        <table class="border-collapse text-left m-4 w-full">
            <thead>
                <tr>
                    <th class="py-4 px-6 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey-dark border-b border-grey-light">Name</th>
                    <th class="py-4 px-6 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey-dark border-b border-grey-light">Beer Rating</th>
                    <th class="py-4 px-6 bg-grey-lighter font-sans font-medium uppercase text-sm text-grey-dark border-b border-grey-light">Exerpience Rating</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="rating in event.ratings" :key="rating.id">
                    <td class="py-4 px-6 border-b border-grey-light">{{ rating.user.firstName }} {{ rating.user.lastName }}</td>
                    <td class="py-4 px-6 border-b border-grey-light">{{ rating.beer }}</td>
                    <td class="py-4 px-6 border-b border-grey-light">{{ rating.experience }}</td>
                </tr>
            </tbody>
        </table>
    </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { RouteRecord, Route, RawLocation } from 'vue-router'
import axios from '@/server-axios'
import Event from '@/models/event'
import moment from 'moment'

Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate', // for vue-router 2.2+
])

@Component
export default class ViewEvent extends Vue {

    event: Event | null = null

    async beforeRouteEnter(to: Route, from: Route, next:
        (to?: RawLocation | false | ((vm: ViewEvent) => any) | void) => void) {

        if (!axios.defaults.headers.common['Authorization']) {
            const authToken = await Vue.prototype.$auth.getAccessToken()
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken
        }

        try {
            const eventId = to.params.id
            const { data } = await axios.get('events/' + eventId)
            data.at = moment(data.at, 'DD-MM-YYYY hh-mm-ss A')
            next((vm) => {
                vm.event = data
            })
        } catch (e) {
            console.warn(e)
            next(false)
        }

    }

    async beforeRouteUpdate(to: Route, from: Route, next:
        (to?: RawLocation | false | ((vm: ViewEvent) => any) | void) => void){
            try {
                const data = await this.fetchEvent(to)
                this.event = data
                next()
            } catch (e) {
                console.warn(e)
                next(false)
            }
        }

    async fetchEvent(route: Route) {
        const eventId = route.params.id
        const { data } = await axios.get('events/' + eventId)
        data.at = moment(data.at, 'DD-MM-YYYY hh-mm-ss A')

        return data
    }

    get numberOfAttendees() {
        if (!this.event || !this.event.ratings) {
            return 0
        }
        return this.event.ratings.length
    }

    get peopleTerm() {
        return this.numberOfAttendees === 1 ? 'person' : 'people'
    }

    get formattedDate() {
        if (!this.event) {
            return ''
        }
        return this.event.at.format('MMM DD, YYYY hh:mm A')
    }

    get averageBeer() {
        if (!this.event || !this.event.ratings) {
            return 0
        }

        return (this.event.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.beer, 0)
            / this.event.ratings.length).toFixed(1)
    }

    get averageExperience() {
        if (!this.event || !this.event.ratings) {
            return 0
        }

        return (this.event.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.experience, 0)
            / this.event.ratings.length).toFixed(1)
    }
}
</script>