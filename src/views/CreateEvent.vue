<template>
    <section>
        <h3 class="mb-3">Create a new event</h3>
        <div class="bg-green-lightest border border-green-light text-green-dark px-4 py-3 rounded relative mb-3" role="alert" v-if="successfullyCreated">
            <span class="block sm:inline">Event successfully created</span>
            <span class="absolute pin-t pin-b pin-r px-4 py-3">
                <svg class="fill-current h-6 w-6 text-green" role="button" @click="successfullyCreated=false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
        </div>
        <div class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative" role="alert" v-if="error">
            <span class="block sm:inline">{{ errorText }}</span>
            <span class="absolute pin-t pin-b pin-r px-4 py-3">
                <svg class="fill-current h-6 w-6 text-red" role="button" @click="error=false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
        </div>
        <form action="" @submit.prevent="createBrewery">
            <div class="mb-4">
                <div class="block relative">
                    <label class="block text-grey-darker text-sm font-bold mb-2 lg:text-left" for="brewery"></label>
                    <select name="brewery" v-model="selectedBrewery" class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                        <option value="">--Select a brewery--</option>
                        <option v-for="brewery in breweries" :key="brewery.id" :value="brewery.id" v-text="brewery.name"></option>
                    </select>
                    <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>
            <div class="mb-4">
                <label class="block text-grey-darker text-sm font-bold mb-2 lg:text-left" for="eventDate">
                    Event Date
                </label>
                <datetime v-model="date" type="datetime" use12-hour input-class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline"></datetime>
            </div>
            <div class="mb-4">
                <label class="block text-grey-darker text-sm font-bold mb-2 lg:text-left" for="eventLocation">
                    Event Location
                </label>
                <input v-model="eventLocation" name="eventLocation" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="beer" type="text" placeholder="Event Location">
            </div>
            <button type="submit" :class="{'spinner': submitting}" class="mb-2 block no-underline lg:inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black lg:hover:border-transparent lg:hover:bg-orange-dark mt-4 lg:mt-0 cursor-pointer">
                Create Event
            </button>
        </form>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import { Actions } from '@/util/vuex-types'
import Event from '@/models/event'
import moment from 'moment'
import axios from '@/server-axios'
import { Datetime } from 'vue-datetime'
import Brewery from '@/models/brewery'
import 'vue-datetime/dist/vue-datetime.css'

@Component({
    components: {
        datetime: Datetime,
    },
})
export default class CreateEvent extends Vue {
    eventLocation: string = ''
    submitting: boolean = false
    successfullyCreated = false
    date: string = moment().toISOString(true)
    error = false
    selectedBrewery: any = ''
    @Action [Actions.FETCH_EVENTS]: any
    @State breweries?: Brewery[]
    @Action [Actions.FETCH_BREWERIES]: any
    errorText = ''

    async mounted(){
        if (this.breweries === null || (this.breweries !== null && this.breweries.length === 0)) {
            this.fetchBreweries()
        }
    }

    async createBrewery() {
        try {
            const missingFields = []
            if (this.selectedBrewery === '' || this.selectedBrewery === null){
                missingFields.push('Brewery')
            }

            if (this.date === '' || this.date === null){
                missingFields.push('Event date')
            }

            if (this.eventLocation === '' || this.eventLocation === null){
                missingFields.push('Event location')
            }

            if(missingFields.length > 0){
                this.error = true
                this.errorText = 'The following fields are required: ' + missingFields.join(', ')
                return
            }


            this.successfullyCreated = false
            this.submitting = true
            this.error = false
            const request = {
               location: this.eventLocation,
               at: moment(this.date).format('DD-MM-YYYY hh:mm:ss A'),
            }
            const { status } = await axios.post('events/' + this.selectedBrewery, request, {
                headers: {
                    Authorization: 'Bearer ' + await this.$auth.getAccessToken(),
                },
            })

            if (status === 201) {
                this.successfullyCreated = true
                this.submitting = false
                this.fetchEvents()
            } else if (status >= 400) {
                this.error = true
                this.errorText = 'There was a problem'
                this.submitting = false
            }
        } catch (e) {
            console.warn(e)
        }
    }
}
</script>
