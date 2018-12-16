<template>
  <div id="app">
    <navigation :authenticated="authenticated" @logout="isAuthenticated"></navigation>
    <div class="container mx-auto">
      <router-view/>
    </div>    
    
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Navigation from '@/components/Navigation.vue'
import { State, Mutation } from 'vuex-class'
import { Mutations } from '@/util/vuex-types'
import User from '@/models/user'
import axios from '@/server-axios'

@Component({
  components: {
    Navigation,
  },
})
export default class App extends Vue {
  // authenticated: boolean = false
  @State authenticated!: boolean
  @State('loggedInUser') user!: User
  @Mutation(Mutations.SET_AUTHENTICATED) setAuth: any
  @Mutation(Mutations.SET_LOGGEDIN_USER) setUser: any

  async created() {
    await this.isAuthenticated()
  }

  @Watch('$route')
  async isAuthenticated() {
    const authenticated = await this.$auth.isAuthenticated()

    if (authenticated) {
      const authToken = await this.$auth.getAccessToken()
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + authToken
    }

    this.setAuth(authenticated)
    if (!authenticated) {
      this.setUser({})
    } else if (Object.keys(this.user).length === 0) {
      const oktaUser = await this.$auth.getUser()
      const user: User = {
        id: 0,
        firstName: oktaUser.given_name,
        lastName: oktaUser.family_name,
        username: oktaUser.email,
        isAdmin: oktaUser.admin,
      }
      this.setUser(user)
    }
  }

}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
