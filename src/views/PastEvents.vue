<template>
    <main>
        <div class="block lg:flex lg:flex-wrap">
            <event-card v-for="event in pastEvents" :key="event.id" :event="event" class="mx-auto mb-2 lg:w-1/3 lg:ml-2"></event-card>
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

    @State pastEvents?: Event[]
    @Action [Actions.FETCH_EVENTS]: any

    async mounted() {
        if (this.pastEvents == null || this.pastEvents.length === 0) {
            await this.fetchEvents(await this.$auth.getAccessToken())
        }
    }
}
</script>