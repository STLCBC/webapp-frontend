<template>
    <div class="login">
        <div id="okta-signin-container"></div>
    </div>
</template>


<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
// @ts-ignore
import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css'
import '@okta/okta-signin-widget/dist/css/okta-theme.css'

@Component
export default class Login extends Vue {

    widget: any

    mounted() {
        this.$nextTick(() => {
            this.widget = new OktaSignIn({
                baseUrl: process.env.VUE_APP_OKTABASE,
                clientId: process.env.VUE_APP_CLIENTID,
                redirectUri: process.env.VUE_APP_REDIRECT,
                // logo: require('@/assets/logo.png'),
                i18n: {
                    en: {
                        'primaryauth.title': 'Sign in to STL CBC',
                    },
                },
                authParams: {
                    responseType: ['id_token', 'token'],
                    issuer: process.env.VUE_APP_ISSUER,
                    display: 'page',
                    scopes: process.env.VUE_APP_SCOPE.split(' '),
                },
            })

            this.widget.renderEl(
                { el: '#okta-signin-container' },
                () => {
                /**
                 * In this flow, the success handler will not be called because we redirect
                 * to the Okta org for the authentication workflow.
                 */
                },
                (err: any) => {
                    throw err
                },
            )
        })
    }

    destroyed() {
        // Remove the widget from the DOM on path change
        this.widget.remove()
    }
}
</script>