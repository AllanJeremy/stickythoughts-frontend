<template>
  <v-app>
    <v-main>
      <div id="onboarding-bg" class="bg-full bg-image"></div>

      <Loading v-if="userLoading" />

      <!-- Actual content -->
      <v-container v-else class="fill-height d-flex flex-column justify-center">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

// Components
import Loading from '@/components/Loading.vue'

export default {
  components: { Loading },
  data() {
    return {}
  },
  computed: {
    ...mapState('user', {
      userLoading: 'isLoading',
      userData: 'data',
    }),
  },
  watch: {
    userData(user) {
      if (!_.isEmpty(user.categories) && !user.isNew) {
        window.location.href = '/journal/record'
      }
    },
  },
}
</script>

<style scoped>
#onboarding-bg {
  background-image: url('/empty-notepad-minimalist.jpg');
  filter: blur(3px);
}
</style>
