<template>
    <main class="mx-auto container">
        <section v-if="loading">
            <div class="spinner"></div>
        </section>
        <section v-else>
            <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0 mx-auto">
                <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="current-events">
                    Current Events
                </label>
                <div class="relative">
                    <select v-model="chosenEventCode" @change="generateQR" class="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-grey" id="current-events">
                        <option></option>
                        <option v-for="event in upcomingEvents" :key="event.id" :value="event.code" v-text="event.brewery.name"></option>
                    </select>
                    <div class="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
                        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                </div>
            </div>

            <div v-if="chosenEventCode">
                <img class="block mx-auto mb-2" v-if="imageData" :src="imageData">

                <button @click="rateBrewery = true" class="block no-underline lg:inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black lg:hover:border-transparent lg:hover:bg-orange-dark mt-4 lg:mt-0 cursor-pointer">Rate Brewery</button>
            
                <rate-brewery-form class="mt-6" v-if="event && rateBrewery && !breweryRated" :event="event" @rated="breweryRated = true"></rate-brewery-form>

                <div v-if="breweryRated" class="flex items-center bg-green text-white text-sm font-bold px-4 py-3 mt-6" role="alert">
                    <p>Thank you for your rating! Click <router-link :to="'/event/' + event.id">here</router-link> to see all other ratings for this event.</p>
                </div>
            </div>
        </section>
    </main>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import { Actions } from '@/util/vuex-types'
import qrcode from 'qrcode'
import Event from '@/models/event'
import RateBreweryForm from '@/components/RateBreweryForm.vue'

@Component({
    components: {
        'rate-brewery-form': RateBreweryForm,
    },
})
export default class HostEvent extends Vue {

    @State upcomingEvents!: Event[]
    @Action [Actions.FETCH_EVENTS]: any
    loading: boolean = false
    chosenEventCode: string = ''
    imageData: string = ''
    rateBrewery: boolean = false
    event?: Event
    breweryRated = false

    async mounted() {
        if (this.upcomingEvents == null || this.upcomingEvents.length === 0) {
            this.loading = true
            await this.fetchEvents(await this.$auth.getAccessToken())
            this.loading = false
        }
    }

    async generateQR() {
        this.rateBrewery = false
        this.event = undefined
        this.breweryRated = false

        if (!this.chosenEventCode) {
            this.imageData = ''
            return
        }
        const foundEvent = this.upcomingEvents.find((elem) => elem.code === this.chosenEventCode)
        if (foundEvent) {
            this.event = foundEvent
        }

        try {
            const data = await qrcode.toDataURL(this.chosenEventCode)
            this.imageData = data
        } catch (err) {
            console.error(err)
            this.imageData = ''
        }
    }
}
</script>