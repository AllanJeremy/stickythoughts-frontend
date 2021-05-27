<template>
  <v-app :style="`background-color: ${uiCustomization.color.background}`">
    <!-- App bar -->
    <v-app-bar color="transparent" flat max-height="56px">
      <v-app-bar-nav-icon
        @click.stop="navIsOpen = !navIsOpen"
      ></v-app-bar-nav-icon>

      <v-spacer></v-spacer>

      <v-btn
        v-if="trackOpenInBackground"
        icon
        class="pulsating"
        @click="openAudioPlayer"
      >
        <v-icon>mdi-play</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="navIsOpen" class="nav" app>
      <v-list-item class="d-flex">
        <v-list-item-content>
          <v-list-item-title class="title">Allan Jeremy</v-list-item-title>
          <v-list-item-subtitle>0 Day Streak</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          link
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Every app page will have an audio player attached to it in the background -->
    <AudioPlayer />

    <Loading v-if="userLoading" />
    <!-- Actual content -->
    <v-container v-else class="px-8 py-4">
      <Nuxt />
    </v-container>
  </v-app>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

// Components
import AudioPlayer from '@/components/audio/AudioPlayer.vue'
import Loading from '@/components/Loading.vue'

export default {
  components: { AudioPlayer, Loading },
  data() {
    return {
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
          icon: 'mdi-school-outline',
          title: 'Tutorial',
          link: '/journal/tutorial',
        },
        {
          icon: 'mdi-credit-card-multiple-outline',
          title: 'Billing',
          link: '/journal/subscriptions',
        },

        {
          icon: 'mdi-help-circle-outline',
          title: 'Support',
          link: '/journal/help',
        },
        { icon: 'mdi-logout-variant', title: 'Logout', link: '/auth/logout' },
      ],
      somethingIsPlaying: false,
    }
  },
  computed: {
    ...mapState('user', {
      userLoading: 'isLoading',
      userData: 'data',
      uiCustomization: 'customization',
    }),
    ...mapState('audio', ['trackOpenInBackground']),
  },
  watch: {
    userData(user) {
      // Do nothing if no user data was found from the database - using dateJoined to check if it is a db record
      if (_.isEmpty(user.dateJoined)) return

      //* Getting here means a user was found in the database
      // Redirect new users to onboarding
      if (user.isNew) {
        this.goTo('/journal/onboarding')
      }
    },
  },
  mounted() {
    this.$nuxt.$on('playing', this.activateSomethingIsPlaying)
    this.$nuxt.$on('stoppedPlaying', this.deactivateSomethingIsPlaying)
  },
  methods: {
    activateSomethingIsPlaying() {
      this.somethingIsPlaying = true
    },
    deactivateSomethingIsPlaying() {
      this.somethingIsPlaying = false
    },
    openAudioPlayer() {
      this.$nuxt.$emit('openPlayer')
    },
  },
}
</script>

<style scoped>
.nav {
  z-index: 999 !important;
}
</style>
