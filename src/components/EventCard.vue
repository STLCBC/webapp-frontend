<template>
    <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <div class="px-6 py-4">
            <div class="font-bold text-xl mb-2">
                <router-link :to="'event/' + event.id" v-if="!upcoming && event.ratings.length > 0" class="no-underline color:black text-black no-visited">{{ event.brewery.name }}</router-link>
                <span v-else>{{ event.brewery.name }}</span>
            </div>
            <p class="text-grey-darker text-base">When: {{ formattedDate }}</p>
            <p class="text-grey-darker text-base">Where: {{ event.location }}</p>
        </div>
        <div class="mt-3 mb-3" v-if="upcoming">
            <a :href="addToGoogleCalendar" target="_blank" class="inline-block no-underline bg-transparent hover:bg-blue text-blue-dark font-semibold hover:text-white py-2 px-4 border border-blue hover:border-transparent rounded">Add to Google Calendar</a>
        </div>
        <div class="px-6 py-4" v-if="!upcoming">
            <span v-if="getAverageBeer !== 0" class="inline-block bg-grey-lighter rounded-full mb-2 px-3 py-1 text-sm font-semibold text-grey-darkest mr-2">Avg. Beer rating: {{ getAverageBeer }}</span>
            <span v-if="getAverageExperience !== 0" class="inline-block bg-grey-lighter rounded-full mb-2 px-3 py-1 text-sm font-semibold text-grey-darkest mr-2">Avg. Experience rating: {{ getAverageBeer }}</span>
            <span v-if="event.ratings.length > 0" class="inline-block bg-grey-lighter rounded-full mb-2 px-3 py-1 text-sm font-semibold text-grey-darkest">Number of Attendees: {{ event.ratings.length }} </span>
        </div>
    </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Event from '@/models/event'
import moment from 'moment'


@Component
export default class EventCard extends Vue {

    @Prop(Object) event!: Event
    @Prop({type: Boolean, default: false}) upcoming!: boolean

    get getAverageBeer() {
        if (this.event.ratings === undefined || this.event.ratings.length === 0) {
            return 0
        }

        return (this.event.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.beer, 0)
            / this.event.ratings.length).toFixed(1)
    }

    get getAverageExperience() {
        if (this.event.ratings === undefined || this.event.ratings.length === 0) {
            return 0
        }

        return (this.event.ratings.reduce((accumulator, currentValue) => accumulator + currentValue.experience, 0)
            / this.event.ratings.length).toFixed(1)
    }

    get formattedDate() {
        return this.event.at.format('MMM DD, YYYY hh:mm A')
    }

    get addToGoogleCalendar() {
        const title = encodeURIComponent('CBC at ' + this.event.brewery.name)
        const loc = encodeURIComponent(this.event.location)
        const startDate = this.event.at.clone()
        const startDateString = startDate.toISOString().replace(/[-:]|\.\d+/g, '')
        const endDate = startDate.clone().add(4, 'hours')
        const endDateString = endDate.toISOString().replace(/[-:]|\.\d+/g, '')

        return 'http://www.google.com/calendar/event?action=TEMPLATE&trp=false&text=' + title +
            '&details=' + title + '&location=' + loc + '&dates=' + startDateString + '/' + endDateString
    }
}
</script>