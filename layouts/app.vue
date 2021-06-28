<template>
  <v-app :style="`background-color: ${uiCustomization.color.background}`">
    <v-fade-transition>
      <v-progress-linear
        v-if="somethingIsUploading"
        indeterminate
        color="secondary"
        max="100"
      ></v-progress-linear>
    </v-fade-transition>

    <!-- [Modal] Confirm logout -->
    <v-dialog
      v-if="modalConfirmLogoutOpen"
      v-model="modalConfirmLogoutOpen"
      persistent
      max-width="25rem"
    >
      <v-card
        ><v-card-title>Confirm logout?</v-card-title>

        <v-card-text>
          You'll need to login to access your journal entries
        </v-card-text>

        <v-card-actions>
          <v-btn depressed @click="modalConfirmLogoutOpen = false"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn depressed color="error" @click="confirmLogout"
            >Yes, Logout</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- [Modal] Upgrade account -->
    <v-dialog v-model="modalUpgradeAccountOpen" fullscreen scrollable>
      <v-card>
        <div class="d-flex ml-md-2 pb-0">
          <v-card-title class="pb-1 pb-md-0">Upgrade your account</v-card-title>

          <v-spacer></v-spacer>

          <v-btn class="mt-3 mr-4" icon @click="modalUpgradeAccountOpen = false"
            ><v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <div class="mx-2 mx-md-6">
          <p class="mb-md-0 pl-2 pl-md-0 font-weight-light">
            Unlock unlimited recording when you upgrade
          </p>
          <SubscriptionForm
            :show-free-option="false"
            :on-after-button-click="
              () => {
                modalUpgradeAccountOpen = false
              }
            "
          />
        </div>
      </v-card>
    </v-dialog>

    <!-- App bar -->
    <v-app-bar color="transparent" flat max-height="56px">
      <v-app-bar-nav-icon
        @click.stop="navIsOpen = !navIsOpen"
      ></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <!-- Upgrade account -->
      <v-btn
        class="mr-2"
        color="secondary"
        depressed
        small
        @click="modalUpgradeAccountOpen = true"
        >Upgrade</v-btn
      >

      <!-- Track playing in the background indicator -->
      <v-btn
        v-if="trackOpenInBackground"
        icon
        class="pulsating"
        @click="openAudioPlayer"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>

      <!-- Upload is happening in the background indicator -->
      <v-menu v-if="somethingIsUploading" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn class="pulsating" icon :attrs="attrs" v-on="on">
            <v-icon>mdi-upload</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item class="px-0">
            <v-list-item-title>
              <!-- Pause upload - Only show if the upload is in progress -->
              <v-btn
                v-if="!uploadIsPaused"
                class="py-6"
                text
                block
                small
                color="secondary"
                @click="handlePauseUpload"
                >Pause</v-btn
              >

              <!-- Resume upload -  Only show if the upload is paused -->
              <v-btn
                v-else
                class="py-6"
                text
                block
                small
                color="secondary"
                @click="handleResumeUpload"
              >
                Resume
              </v-btn>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Share StickyThoughts -->
      <v-btn icon>
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-if="userFoundInDb"
      v-model="navIsOpen"
      class="nav"
      src="/minimalist-white-workspace.jpg"
      app
    >
      <div
        class="bg-full"
        :style="`background: ${uiCustomization.color.background}; opacity:0.75;`"
      ></div>
      <v-list-item class="d-flex">
        <v-list-item-content>
          <v-list-item-title class="title">{{
            userData.name
          }}</v-list-item-title>
          <v-list-item-subtitle>{{ userData.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          replace
          :to="item.external ? undefined : item.link"
          :href="item.external ? item.link : undefined"
          :target="item.external ? '__blank' : undefined"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-list-item @click="modalConfirmLogoutOpen = true">
          <v-list-item-icon>
            <v-icon>mdi-logout-variant</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Every app page will have an audio player attached to it in the background -->
    <AudioPlayer />

    <Loading v-if="!userFoundInDb" />
    <!-- Actual content -->
    <v-container
      v-else
      id="appContainer"
      class="px-8 py-4"
      style="max-width: 45rem"
    >
      <Nuxt />
    </v-container>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

// Components
import AudioPlayer from '@/components/audio/AudioPlayer.vue'
import Loading from '@/components/Loading.vue'
import SubscriptionForm from '@/components/subscriptions/SubscriptionForm.vue'

// Language
import { defaultErrorMessage } from '@/data/messages/feedback'

// Mixins
import { Analytics, AuthMixin, NavMixin, UploadMixin } from '@/mixins'

export default {
  components: { AudioPlayer, Loading, SubscriptionForm },
  mixins: [Analytics.HotjarMixin, AuthMixin, NavMixin, UploadMixin],
  data() {
    return {
      modalUpgradeAccountOpen: false,
      modalConfirmLogoutOpen: false,
      navIsOpen: false,
      navItems: [
        { icon: 'mdi-microphone', title: 'Record', link: '/journal/record' },
        {
          icon: 'mdi-calendar-range',
          title: 'History',
          link: '/journal/history',
        },
        {
          icon: 'mdi-shape-outline',
          title: 'Categories',
          link: '/journal/categories',
        },
        {
          icon: 'mdi-palette',
          title: 'Customization',
          link: '/journal/customization',
        },
        {
          icon: 'mdi-credit-card-multiple-outline',
          title: 'Subscriptions',
          link: '/billing/subscriptions',
        },
        {
          icon: 'mdi-post-outline',
          title: 'Blog',
          link: 'https://blog.stickythoughts.app?utm-source=app',
          external: true,
        },
      ],

      // Audio related
      somethingIsPlaying: false,

      // Upload related
      somethingIsUploading: false,
      uploadIsPaused: false,
      currentUploadTask: null,
    }
  },
  computed: {
    ...mapState('user', {
      userLoading: 'isLoading',
      userLoggedIn: 'isLoggedIn',
      userData: 'data',
      uiCustomization: 'customization',
    }),
    ...mapState('audio', ['trackOpenInBackground']),

    /** @return `true` if the user was found in the database and `false` if the user was NOT found in the database */
    userFoundInDb() {
      // User was found in the db if we cab access their date joined (not available locally until fetched from db)
      return !this.userLoading && this.userData.categories
    },
  },
  watch: {
    userFoundInDb(userWasFound) {
      if (userWasFound && this.userData.isNew) {
        // Redirect new users to onboarding
        this.goTo('/journal/onboarding')
      }
    },
  },
  mounted() {
    // Statements in order of occurence, not alphabetical
    this.$nuxt.$on('uploading', this.handleUploading)
    this.$nuxt.$on('uploadComplete', this.handleUploadComplete)

    this.$nuxt.$on('playing', this.activateSomethingIsPlaying)
    this.$nuxt.$on('stoppedPlaying', this.deactivateSomethingIsPlaying)
  },
  methods: {
    // Audio related
    activateSomethingIsPlaying() {
      this.somethingIsPlaying = true
    },
    deactivateSomethingIsPlaying() {
      this.somethingIsPlaying = false
    },
    openAudioPlayer() {
      this.$nuxt.$emit('openPlayer')
    },

    // Upload related
    handleUploading({ task, progressPercentage }) {
      // Set the upload task on this vue file so that we can use it for pausing/resuming/cancelling
      this.currentUploadTask = task

      // Establish whether something is uploading or not
      this.somethingIsUploading = progressPercentage !== 100
    },

    //
    handlePauseUpload() {
      this.somethingIsUploading = false
      this.uploadIsPaused = true

      this.pauseUpload(this.currentUploadTask)

      this.$toast.info('Upload paused')
    },

    //
    handleResumeUpload() {
      this.somethingIsUploading = true
      this.uploadIsPaused = false

      this.resumeUpload(this.currentUploadTask)
    },

    //
    handleUploadComplete() {
      this.somethingIsUploading = false
    },
    confirmLogout() {
      // What happens on successful logout
      const _successHandler = () => {
        this.modalConfirmLogoutOpen = false
        this.$toast.success('Successfully logged you out')

        window.location.href = '/auth/login'
      }

      // What happens when the logout fails
      const _errorHandler = () => {
        this.$toast.error(defaultErrorMessage)
      }

      // Actually logout the user
      this.logout(_successHandler, _errorHandler)
    },
  },
}
</script>

<style scoped>
.nav {
  z-index: 999 !important;
}
</style>
