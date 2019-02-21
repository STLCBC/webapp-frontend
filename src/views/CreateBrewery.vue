<template>
    <section>
        <h3 class="mb-3">Create a new brewery</h3>
        <div class="bg-green-lightest border border-green-light text-green-dark px-4 py-3 rounded relative mb-3" role="alert" v-if="successfullyCreated">
            <span class="block sm:inline">Brewery successfully created</span>
            <span class="absolute pin-t pin-b pin-r px-4 py-3">
                <svg class="fill-current h-6 w-6 text-green" role="button" @click="successfullyCreated=false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
        </div>
        <div class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative" role="alert" v-if="error">
            <span class="block sm:inline">There was an error</span>
            <span class="absolute pin-t pin-b pin-r px-4 py-3">
                <svg class="fill-current h-6 w-6 text-red" role="button" @click="error=false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
        </div>
        <form action="" @submit.prevent="createBrewery">
            <div class="mb-4">
                <label class="block text-grey-darker text-sm font-bold mb-2 lg:text-left" for="breweryName">
                    Brewery Name
                </label>
                <input v-model="breweryName" name="breweryName" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="beer" type="text" placeholder="Brewery Name">
            </div>
            <button type="submit" :class="{'spinner': submitting}" class="mb-2 block no-underline lg:inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black lg:hover:border-transparent lg:hover:bg-orange-dark mt-4 lg:mt-0 cursor-pointer">
                Create Brewery
            </button>
        </form>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import { Actions } from '@/util/vuex-types'
import Event from '@/models/event'
import moment from 'moment'
import axios from '@/server-axios'

@Component
export default class CreateBrewery extends Vue {
    breweryName: string = ''
    submitting: boolean = false
    successfullyCreated = false
    error = false
    @Action [Actions.FETCH_BREWERIES]: any

    async createBrewery() {
        try {
            this.successfullyCreated = false
            this.submitting = true
            this.error = false
            const request = {
               name: this.breweryName,
               visited: false,
            }
            const { status } = await axios.post('breweries/', request, {
                headers: {
                    Authorization: 'Bearer ' + await this.$auth.getAccessToken(),
                },
            })

            if (status === 201) {
                this.successfullyCreated = true
                this.submitting = false
                this.fetchBreweries()
            } else if (status >= 400) {
                this.error = true
                this.submitting = false
            }
        } catch (e) {
            console.warn(e)
        }
    }
}
</script>
