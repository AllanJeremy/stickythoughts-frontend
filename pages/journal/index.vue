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
      userLoggedIn: 'isLoggedIn',
      userData: 'data',
    }),
  },
  watch: {
    userData(user) {
      let redirectUrl

      // New user
      if (_.isEmpty(user.dateJoined)) {
        redirectUrl = '/journal/onboarding'
      }
      // Existing user
      else {
        redirectUrl = '/journal/record'
      }

      this.goTo(redirectUrl)
    },
  },
}
</script>
