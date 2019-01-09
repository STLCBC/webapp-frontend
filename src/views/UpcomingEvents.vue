<template>
    <main>
        <div class="block lg:flex lg:flex-wrap">
            <event-card v-for="event in upcomingEvents" :key="event.id" :event="event" class="mx-auto mb-2 lg:w-1/3 lg:ml-2" upcoming></event-card>
            <p v-if="upcomingEvents.length == 0">There are no upcoming events. Check back later for new events.</p>
        </div>
    </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import Event from '@/models/event'
import { Actions } from '@/util/vuex-types'
import EventCard from '@/components/EventCard.vue'

@Component({
    components: {
        EventCard,
    },
})
export default class UpcomingEvents extends Vue {

    @State upcomingEvents?: Event[]
    @Action [Actions.FETCH_EVENTS]: any

    async mounted() {
        if (this.upcomingEvents == null || this.upcomingEvents.length === 0) {
            await this.fetchEvents(await this.$auth.getAccessToken())
        }
    }
}
</script>