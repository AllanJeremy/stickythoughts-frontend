<template>
  <section class="d-flex flex-column align-center justify-center text-center">
    <EmptyContainer>
      <v-progress-linear indeterminate color="secondary"></v-progress-linear>
      <h4 class="font-weight-light mt-4">Preparing to upgrade your account</h4>
    </EmptyContainer>
  </section>
</template>

<script>
import { mapState } from 'vuex'

// API handlers
import { paymentApi } from '@/apiRequests'

// Language
import { defaultErrorMessage } from '@/data/messages/feedback'

// Mixins
import { NavMixin } from '@/mixins'

// Components
import EmptyContainer from '@/components/EmptyContainer.vue'

export default {
  components: { EmptyContainer },
  mixins: [NavMixin],
  layout: 'app',
  head() {
    return {
      title: 'Upgrade account',
    }
  },
  computed: {
    ...mapState('user', {
      userData: 'data',
    }),

    paymentPlanName() {
      return this.$route.query.plan
    },
    paymentRedirectUrl() {
      const redirectUrl =
        this.$route.query.redirect || 'https://stickythoughts.app/journal/'

      return redirectUrl
    },
  },
  mounted() {
    // TODO: Add async tracking code here
    // Attempt adding a recurring payment
    paymentApi
      .addRecurringPayment(
        this.userData,
        this.paymentPlanName,
        this.paymentRedirectUrl
      )
      .catch(() => {
        this.$toastr.error(defaultErrorMessage)
      })
      .then((paymentResponse) => {
        // Redirect to the payment link
        window.location.href = paymentResponse.data.link
      })
  },
}
</script>
