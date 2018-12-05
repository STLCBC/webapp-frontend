<template>
    <nav class="flex items-center justify-between flex-wrap bg-black p-6 mb-6">
        <div class="flex items-center flex-no-shrink text-orange-dark mr-6">
            <span class="font-semibold text-xl tracking-tight">STL CBC</span>
        </div>
        <div class="block lg:hidden">
            <button class="flex items-center px-3 py-2 border rounded text-orange-lighter border-orange-light hover:text-white hover:border-white" @click="expanded = !expanded">
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
            </button>
        </div>
        <div class="" :class="[{'hidden': !expanded, 'block': expanded}, 'w-full', 'flex-grow', 'lg:flex', 'lg:items-center', 'lg:w-auto', 'ease-height-in']">
            <div class="text-sm lg:flex-grow lg:flex lg:justify-start">
            <a href="#responsive-header" class="block mt-4 lg:inline-block text-white lg:mt-0 px-4 py-2 hover:text-orange-dark hover:text-white mr-4 no-underline">
                Previous Events
            </a>
            <a href="#responsive-header" v-if="loggedIn" class="block mt-4 lg:inline-block text-white px-4 py-2 lg:mt-0 hover:text-orange-dark hover:text-white mr-4 no-underline">
                Upcoming Events
            </a>
            <a href="#responsive-header" v-if="loggedIn" class="block mt-4 lg:inline-block text-white px-4 py-2 lg:mt-0 hover:text-orange-dark hover:text-white no-underline">
                Attend an event
            </a>
            </div>
                <a href="#" class="block no-underline lg:inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:bg-orange-dark mt-4 lg:mt-0 lg:mr-4">Login</a>
                <a href="#" class="block no-underline lg:inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:bg-orange-dark mt-4 lg:mt-0">Register</a>
            <div>
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State } from 'vuex-class'

@Component
export default class Navigation extends Vue {
    @State public loggedIn: any

    public expanded: boolean = false
}
</script>

<style lang="scss">
    .ease-height-in{
        transition-property: height;
        transition-duration: .1s;
        transition-timing-function: ease-in-out
    }
</style>
