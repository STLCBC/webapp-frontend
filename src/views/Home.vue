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

interface Brewery {
    id: number,
    name: string,
    visited: boolean
}

@Component
export default class Home extends Vue {
  public breweries: Brewery[] = [
        {
            id: 0,
            name: 'Charleyville Brewery',
            visited: true,
        },
        {
            id: 1,
            name: 'O\'Fallon Brewery',
            visited: true,
        },
        {
            id: 2,
            name: 'Narrow Guage Brewery',
            visited: false,
        },
        {
            id: 3,
            name: 'Narrow Guage Brewery',
            visited: false,
        },
        {
            id: 4,
            name: 'Narrow Guage Brewery',
            visited: false,
        },
        {
            id: 5,
            name: 'Narrow Guage Brewery',
            visited: false,
        },
        {
            id: 6,
            name: 'Narrow Guage Brewery',
            visited: false,
        },
    ]
}
</script>
