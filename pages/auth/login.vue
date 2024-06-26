<template>
  <section
    class="mh-login-container d-flex flex-column align-center justify-center"
  >
    <img
      src="/logo-plain.png"
      height="200"
      alt="StickyThoughts - Remember everything. Logo."
    />

    <h1 class="secondary--text">Welcome onboard</h1>
    <p class="font-weight-light text-center">
      You are one step away from preserving the thoughts that matter the most to
      you.
    </p>

    <!-- Progress bar shown when logged in but loading -->
    <v-progress-linear
      v-if="userCreationLoading"
      :indeterminate="true"
      :color="uiCustomization.color.background"
    ></v-progress-linear>

    <v-progress-linear
      id="loader"
      indeterminate
      color="amber"
    ></v-progress-linear>
    <div ref="firebaseuiAuthContainer"></div>
  </section>
</template>

<script>
import { mapState } from 'vuex'

// Firebase
import { auth, firebase } from '@/helpers/firebase'
import * as firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

// Mixins
import { NavMixin } from '@/mixins'

// Helpers
import { getLinkWithQueryParams } from '@/helpers/redirect'

// API requests
import { userApi } from '@/apiRequests'

export default {
  mixins: [NavMixin],
  layout: 'site',
  data() {
    return {
      userCreationLoading: false,
    }
  },
  head() {
    return {
      title: 'Login / SignUp',
    }
  },
  computed: {
    ...mapState('user', { uiCustomization: 'customization' }),
  },
  mounted() {
    this.initializeFirebaseUi()
  },
  methods: {
    initializeFirebaseUi() {
      // Initialize the FirebaseUI Widget using Firebase.
      let ui = firebaseui.auth.AuthUI.getInstance()

      if (!ui) {
        ui = new firebaseui.auth.AuthUI(auth)
      }

      ui.start(this.$refs.firebaseuiAuthContainer, {
        signInOptions: [
          // List of OAuth providers supported.
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
        signInFlow: 'popup',
        callbacks: {
          signInSuccessWithAuthResult: ({ user }, _redirectUrl) => {
            const newUserData = {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
            }

            this.userCreationLoading = true

            // User successfully signed in.
            userApi
              .createUser(newUserData)
              .then(() => {
                const redirectUrl = getLinkWithQueryParams(
                  '/journal/',
                  this.$route
                )

                window.location.href = redirectUrl
              })
              .finally(() => {
                this.$toast.success('Login successful!')
                this.userCreationLoading = false
              })

            return false
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
.mh-login-container {
  min-height: calc(100vh - 10rem);
}
</style>
