<template>
    <main>
        <div v-if="!eventFound">
            <a @click="reload" class="mb-2 block no-underline lg:inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black hover:border-transparent hover:bg-orange-dark mt-4 lg:mt-0 cursor-pointer">Reload QR Code Reader</a>
            <div v-if="error" class="bg-red-lightest border border-red-light text-red-dark px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">An error occurred. </strong>
                <span class="block sm:inline">{{ error }}</span>
                <span class="absolute pin-t pin-b pin-r px-4 py-3" @click="error = ''">
                    <svg class="fill-current h-6 w-6 text-red" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
            <div class="mt-2 h-32">
                <qrcode-stream class="h-32" @decode="onDecode" @init="onInit" :camera="cameraInfo" v-if="!destroyed">
                    <div class="loading-indicator" v-if="scanningLoading">
                        Loading...
                    </div>
                </qrcode-stream>
            </div>
        </div>
        <div v-else>
            <rate-brewery-form v-if="!breweryRated" :event="event" @rated="breweryRated = true"></rate-brewery-form>

            <div v-if="breweryRated" class="flex items-center bg-green text-white text-sm font-bold px-4 py-3 mt-6" role="alert">
                <p>Thank you for your rating! Click here to see all other ratings for this event.</p>
            </div>
        </div>
    </main>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'
// @ts-ignore
import { QrcodeStream, QrcodeDropZone, QrcodeCapture } from 'vue-qrcode-reader'
import axios from '@/server-axios'
import Event from '@/models/event'
import RateBreweryForm from '@/components/RateBreweryForm.vue'


@Component({
    components: {
        'qrcode-stream': QrcodeStream,
        'rate-brewery-form': RateBreweryForm,
    },
})
export default class AttendAnEvent extends Vue {
    code: string = ''
    eventFound: boolean = false
    scanningPause: boolean = false
    scanningLoading: boolean = true
    destroyed: boolean = false
    error: string = ''
    cameraInfo: any = {
        audio: false, // don't request microphone access
        video: {
            facingMode: { ideal: 'environment' }, // use rear camera if available
            width: { min: 240, ideal: 320, max: 350 }, // constrain video width resolution
            height: { min: 240, ideal: 320, max: 350 }, // constrain video height resolution
        },
    }
    event?: Event
    breweryRated = false

    async onInit(promise: any) {
        // show loading indicator
        this.scanningLoading = true
        try {
            await promise

        // successfully initialized
        } catch (error) {
            console.log(error)
            if (error.name === 'NotAllowedError') {
                this.error = 'Please allow camera access and then click the reload button to continue.'
            } else if (error.name === 'NotFoundError') {
                this.error = 'A camera was not found on your device'
            } else if (error.name === 'NotSupportedError') {
                this.error = 'Your browser or device does not support camera access'
            } else if (error.name === 'NotReadableError') {
                this.error = 'Your camera is already in use'
            } else if (error.name === 'OverconstrainedError') {
                this.error = 'An unexpected error occured.'
            } else if (error.name === 'StreamApiNotSupportedError') {
                this.error = 'Your browser or device does not support camera access'
            }
        } finally {
            this.scanningLoading = false
        }
    }

    async onDecode(result: any) {
        try {
            const { data, status } = await axios.get('/events/validate/' + result, {
                headers: {
                Authorization: 'Bearer ' + await this.$auth.getAccessToken(),
                },
            })
            console.log(data)
            console.log(status)
            if (status === 200) {
                this.eventFound = true
                this.event = data
            }
        } catch (e) {
            console.log(e)
        }
    }

    async reload() {
      this.destroyed = true

      await this.$nextTick()

      this.destroyed = false
    }

}
</script>