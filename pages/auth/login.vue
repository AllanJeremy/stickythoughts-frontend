<template>
  <section class="mh-full d-flex flex-column align-center justify-center">
    <img
      src="/logo-plain.png"
      height="256"
      alt="StickyThoughts - Remember everything. Logo."
    />

    <h2 class="secondary--text">Welcome onboard</h2>
    <p class="font-weight-light text-center">
      You are one step away from preserving the thoughts that matter the most to
      you.
    </p>

    <div ref="firebaseuiAuthContainer"></div>
  </section>
</template>

<script>
import { auth, firebase } from '@/helpers/firebase'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

import { NavMixin } from '@/mixins'
import { userApi } from '@/apiRequests'

export default {
  mixins: [NavMixin],
  data() {
    return {
      // TODO: Add implementation
    }
  },
  head() {
    return {
      title: 'Login / SignUp',
    }
  },
  mounted() {
    this.initializeFirebaseUi()
  },
  methods: {
    initializeFirebaseUi() {
      // Initialize the FirebaseUI Widget using Firebase.
      const ui = new firebaseui.auth.AuthUI(auth)

      ui.start(this.$refs.firebaseuiAuthContainer, {
        signInOptions: [
          // List of OAuth providers supported.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        signInFlow: 'popup',
        signInSuccessUrl: '/journal/',
        callbacks: {
          signInSuccessWithAuthResult({ user }, _redirectUrl) {
            const newUserData = {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
            }

            // User successfully signed in.
            return userApi.createUser(newUserData).then(() => {
              window.location.href = '/journal/'
            })
          },
          uiShown() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none'
          },
        },
      })
    },
  },
}
</script>

<style scoped>
.mh-full {
  min-height: calc(100vh - 4rem);
}
</style>
