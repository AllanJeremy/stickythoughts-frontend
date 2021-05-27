<template>
  <v-app>
    <v-main>
      <div id="onboarding-bg"></div>
      {{ userData }}
      <Loading v-if="userLoading" />

      <!-- Actual content -->
      <v-container v-else class="fill-height d-flex flex-column justify-center">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
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
}
</script>

<style scoped>
#onboarding-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('/empty-notepad-minimalist.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(3px);
}
</style>
