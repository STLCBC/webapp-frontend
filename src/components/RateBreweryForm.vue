<template>
    <section>
        <h3 class="mb-3">Please rate {{ event.brewery.name }}</h3>
        <form action="" @submit.prevent="submitRating">
            <div class="mb-4">
                <label class="block text-grey-darker text-sm font-bold mb-2 lg:text-left" for="beer">
                    Beer Rating
                </label>
                <input v-model="beer" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="beer" type="number" step="0.5" min="1" max="10" placeholder="Beer">
            </div>
            <div class="mb-6">
                <label class="block text-grey-darker text-sm font-bold mb-2 lg:text-left" for="experience">
                    Experience Rating
                </label>
                <input v-model="experience" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="experience" type="number" step="0.5" min="1" max="10" placeholder="Experience">
            </div>
            <button type="submit" :class="{'spinner': submitting}" class="mb-2 block no-underline lg:inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black lg:hover:border-transparent lg:hover:bg-orange-dark mt-4 lg:mt-0 cursor-pointer">
                Submit Rating
            </button>
        </form>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Event from '@/models/event'
import axios from '@/server-axios'
import { Actions } from '@/util/vuex-types'
import { Action } from 'vuex-class'

@Component
export default class RateBreweryForm extends Vue {

    @Prop(Object) event!: Event
    beer: number = 0
    experience: number = 0
    submitting = false
    @Action [Actions.FETCH_EVENTS]: any

    async submitRating() {
        try {
            this.submitting = true
            const request = {
                code: this.event.code,
                rating: {
                    beer: this.beer,
                    experience: this.experience,
                },
            }
            const { status } = await axios.post('ratings/' + this.event.id, request, {
                headers: {
                    Authorization: 'Bearer ' + await this.$auth.getAccessToken(),
                },
            })

            if (status === 201) {
                await this.fetchEvents(await this.$auth.getAccessToken())
                this.$emit('rated')
            }
        } catch (e) {
            console.warn(e)
        }
    }
}
</script>