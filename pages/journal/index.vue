<template>
  <div>
    <Loading />
  </div>
</template>

<script>
import _ from 'lodash'
import { mapState } from 'vuex'

import { NavMixin } from '@/mixins'
import Loading from '@/components/Loading.vue'

export default {
  components: { Loading },
  mixins: [NavMixin],
  data() {
    return {}
  },
  computed: {
    ...mapState('user', {
      userLoading: 'isLoading',
      userLoggedIn: 'isLoggedIn',
      userData: 'data',
    }),
  },
  watch: {
    userData(user) {
      if (_.isEmpty(user.categories)) return

      //* Getting here means the user's data was found in the store

      let redirectUrl

      // New user
      if (user.isNew) {
        redirectUrl = '/journal/onboarding'
        this.$toast.info('Welcome to StickyThoughts')
      }
      // Existing user
      else {
        this.$toast.success(`Welcome back, ${this.userData.name}!`)
        redirectUrl = '/journal/record'
      }

      // Simulates a click - loads a new page
      window.location.href = redirectUrl
    },
  },
}
</script>
