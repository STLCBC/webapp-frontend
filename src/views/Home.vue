<template>
  <div class="home">
    <h1 class="mb-2">Welcome to the STL Craft Beer Club</h1>

    <p>The mission of the STL Craft Beer Club is to visit every microbrewery within the Saint Louis Metro area.</p>

    <h3 class="text-left mb-2 mt-2">Brewery List (visited breweries have been lined-through)</h3>

    <ul class="text-left w-auto lg:flex lg:flex-col lg:flex-wrap lg:h-24">
      <li v-for="brewery in breweries" :key="brewery.id" v-text="brewery.name" :class="{'line-through': brewery.visited}"></li>
    </ul>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, State } from 'vuex-class'
import Brewery from '@/models/brewery'

@Component
export default class Home extends Vue {

    @Action fetchBreweries: any
    @State breweries?: Brewery[]

    async mounted() {
        await this.fetchBreweries()
    }
}
</script>
