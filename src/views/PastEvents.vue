<template>
    <main>
        <div class="block lg:flex lg:flex-wrap">
            <event-card v-for="event in events" :key="event.id" :event="event" class="mx-auto lg:w-1/3 lg:ml-2 mb-2"></event-card>
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
export default class PastEvents extends Vue {

    @State events?: Event[]
    @Action [Actions.FETCH_EVENTS]: any

    async mounted() {
        if (this.events == null || this.events.length === 0) {
            await this.fetchEvents(await this.$auth.getAccessToken())
        }
    }
}
</script>