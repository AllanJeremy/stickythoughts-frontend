<template>
  <div>
    <Loading />
  </div>
</template>

<script>
import { NavMixin } from '@/mixins'
import Loading from '@/components/Loading.vue'

export default {
  components: { Loading },
  mixins: [NavMixin],
  middleware: ['redirectLoggedInAppUser'],
  data() {
    return {}
  },
}
</script>
