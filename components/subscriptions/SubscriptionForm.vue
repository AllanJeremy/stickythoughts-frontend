<template>
  <section>
    <v-row>
      <v-col cols="12" sm="4">
        <v-card class="my-4 py-6 px-8">
          <h2 class="secondary--text">
            <v-icon size="2rem">mdi-text-to-speech</v-icon> Basic
          </h2>
          <h1 class="display-1">FREE</h1>
          <h5 class="pricing-tagline">Save your thoughts everywhere</h5>
          <ul class="pl-0 mt-4">
            <li>
              <v-icon>mdi-check</v-icon> Record audio notes on all devices
            </li>
            <li><v-icon>mdi-check</v-icon> Organize and filter audio notes</li>
            <li>
              <v-icon>mdi-check</v-icon> Share audio notes
              <small class="secondary--text">(Coming soon)</small>
            </li>
            <li><v-icon>mdi-check</v-icon> 5 minutes recording time per day</li>
            <li>
              <v-icon>mdi-check</v-icon> Feature updates &amp; improvements
            </li>
            <li><v-icon>mdi-check</v-icon> Discord community access</li>
          </ul>

          <v-card-actions class="mt-5">
            <v-btn outlined depressed block color="error" large
              >Get started for free</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card class="my-4 py-6 px-8">
          <div class="d-flex justify-space-between align-start">
            <h2 class="secondary--text">
              <v-icon size="2rem">mdi-medal</v-icon> Pro
            </h2>

            <v-switch
              v-model="proPlanIsAnnual"
              class="mt-0"
              :label="proPlanIsAnnual ? 'Yearly' : 'Monthly'"
              color="teal"
              hide-details
            ></v-switch>
          </div>

          <h1 class="display-1 mt-2">
            ${{ proMonthlyPaymentTotal.toFixed(2) }}/mo

            <v-scroll-x-transition>
              <v-chip
                v-if="proPlanIsAnnual"
                class="white--text"
                color="teal"
                small
                >Save ${{ proAnnualSavingsTotal }}!</v-chip
              >
            </v-scroll-x-transition>
          </h1>
          <span v-if="proPlanIsAnnual" class="secondary--text d-block mb-2"
            >(${{ proAnnualPlanPaymentTotal }} per year)</span
          >

          <h5 class="pricing-tagline">Remember all that matters</h5>
          <ul class="pl-0 mt-4">
            <li><v-icon>mdi-arrow-left</v-icon> Everything in Basic</li>
            <li><v-icon>mdi-check</v-icon> Unlimited recording time</li>

            <li><v-icon>mdi-check</v-icon> Priority on feature requests</li>
            <li>
              <v-icon>mdi-check</v-icon> Automatic voice-to-text
              <small class="secondary--text">(Coming soon)</small>
            </li>
            <li><v-icon>mdi-check</v-icon> Priority on feature requests</li>
            <li>
              <v-icon>mdi-check</v-icon>
              <span class="font-weight-bold teal--text">
                <v-icon color="teal" small>mdi-shield-star-outline</v-icon>
                Pro
              </span>
              badge in community
            </li>
          </ul>

          <v-card-actions class="mt-5">
            <v-btn depressed block color="error" large>Upgrade to pro</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card class="my-4 py-6 px-8">
          <h2 class="secondary--text">
            <v-icon color="purple" size="2rem">mdi-trophy-award</v-icon>
            Lifetime
          </h2>
          <h1 class="display-1">$349</h1>
          <h5 class="pricing-tagline">For the believers</h5>

          <ul class="pl-0 mt-4">
            <li><v-icon>mdi-arrow-left</v-icon> Everything in Pro. Forever</li>
            <li><v-icon>mdi-check</v-icon> Founder lounge room access</li>

            <li>
              <v-icon>mdi-check</v-icon>
              <span class="font-weight-bold purple--text">
                <v-icon color="purple" small>mdi-shield-star-outline</v-icon>
                Legend
              </span>
              badge in community
            </li>
          </ul>

          <v-card-actions class="mt-5">
            <v-btn outlined depressed block color="error" large
              >Get the lifetime deal</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script>
export default {
  name: 'SubscriptionForm',
  data() {
    return {
      planSelected: 'pro',
      proPlanIsAnnual: true,
      paidPlanPricing: {
        pro: {
          annualMonthlyPrice: 9.5,
          monthlyPrice: 14.5,
        },
      },
    }
  },
  computed: {
    proMonthlyPaymentTotal() {
      const { annualMonthlyPrice, monthlyPrice } = this.paidPlanPricing.pro
      return this.proPlanIsAnnual ? annualMonthlyPrice : monthlyPrice
    },
    proAnnualPlanPaymentTotal() {
      const total = this.paidPlanPricing.pro.annualMonthlyPrice * 12

      return total
    },
    proAnnualSavingsTotal() {
      const { annualMonthlyPrice, monthlyPrice } = this.paidPlanPricing.pro

      const savings = monthlyPrice * 12 - annualMonthlyPrice * 12
      return savings
    },
  },
}
</script>

<style lang="scss" scoped>
ul {
  list-style: none;

  li {
    font-size: 15px;
    line-height: 180%;
  }
}

.pricing-tagline {
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.84;
}
</style>
