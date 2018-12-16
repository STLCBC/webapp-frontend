<template>
    <main class="container mx-auto">
        <h2 class="text-center mb-4">Register for an account below</h2>
        <div v-if="errors.length > 0">
            <div class="bg-orange-lightest border-l-4 border-orange text-orange-dark p-4 text-left" role="alert">
                <p class="font-bold">There were some issues</p>
                <p v-for="error in errors" :key="error" v-text="error"></p>
            </div>
        </div>
        <form class="w-full max-w-md mx-auto mt-6" @submit.prevent="registerForAccount">
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-first-name">
                        First Name
                    </label>
                    <input v-model="firstName" class="appearance-none block w-full bg-grey-lighter text-grey-darker border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder="Jane" required>
                </div>
                <div class="w-full md:w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-last-name">
                        Last Name
                    </label>
                    <input v-model="lastName" class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-grey" id="grid-last-name" type="text" placeholder="Doe" required>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-full px-3 mb-6 md:mb-0">
                    <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-email">
                        Username (email)
                    </label>
                    <input v-model="email" class="appearance-none block w-full bg-grey-lighter text-grey-darker border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-email" type="email" placeholder="john@doe.com" required>
                </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-6">
                <div class="w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" for="grid-password">
                        Password
                    </label>
                    <input v-model="password" 
                        minlength="8" 
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" 
                        title="Must contain at least 8 characters with a lower case letter, upper case letter and a number" 
                        class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-grey" 
                        id="grid-password" type="password" placeholder="******************" required>
                </div>
                <div class="w-1/2 px-3">
                    <label class="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2" title="Must contain at least 8 characters with a lower case letter, upper case letter and a number" for="grid-password-confirm">
                        Confirm Password
                    </label>
                    <input v-model="confirmPassword" 
                        minlength="8" 
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"  
                        class="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-grey" 
                        id="grid-password-confirm" type="password" placeholder="******************" required>
                </div>
            </div>

             <button type="submit" class="block no-underline lg:inline-block text-sm px-4 py-2 leading-none border rounded text-black border-black lg:hover:border-transparent lg:hover:bg-orange-dark mt-4 lg:mt-0 cursor-pointer">Register</button>
        </form>
    </main>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from '@/server-axios'

@Component
export default class Register extends Vue {
    errors: string[] = []
    firstName: string = ''
    lastName: string = ''
    password: string = ''
    confirmPassword: string = ''
    email: string = ''

    async registerForAccount() {
        console.log('register')
        this.errors = []
        if (this.password !== this.confirmPassword) {
            this.errors.push('Your passwords do not match')
            return
        }

        try {
            const user = {
                firstName: this.firstName,
                lastName: this.lastName,
                password: this.password,
                username: this.email,
            }

            const { status } = await axios.post('users/register', user)

            console.log(status)

            this.$router.push('/login')

        } catch (e) {
            if (e.request.status === 409) {
                this.errors.push('That email is already in use')
            }
        }

    }
}
</script>

<style lang="scss" scoped>
    .input:invalid{
        border-color: #e3342f;
    }
</style>
