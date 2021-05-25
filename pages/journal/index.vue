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
    userData(data) {
      // Do nothing if no user data was found from the database - using dateJoined to check if it is a db record
      if (_.isEmpty(data.dateJoined)) return

      //* Getting here means user data was found
      const { isNew } = this.userData

      const redirectUrl = isNew ? '/journal/onboarding' : '/journal/record'
      this.goTo(redirectUrl)
    },
  },
}
</script>
