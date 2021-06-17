<template>
  <div>
    <article
      class="text-center d-flex flex-column justify-center align-center"
      style="min-height: 50vh"
    >
      <h1 class="font-weight-bold" :style="`font-size: ${ctaTextFontSize}`">
        Remember
        <span :class="`${ctaShuffleText.color}--text`">{{
          ctaShuffleText.text
        }}</span>
      </h1>

      <h3 class="font-weight-light mt-2">
        Finally, a simple organized way to privately record your thoughts on all
        your devices
      </h3>

      <v-btn class="mt-6 white--text" color="teal" to="/auth/login" x-large
        >GET STARTED FOR FREE</v-btn
      >
      <p class="secondary--text">
        <small><i>No credit card required</i></small>
      </p>
    </article>

    <div class="d-flex flex-column align-center" style="height: 80vh">
      <img src="/mockup.png" alt="" height="100%" />
    </div>
  </div>
</template>

<script>
export default {
  layout: 'site',
  data() {
    return {
      ctaShuffleText: { text: 'what you did today', color: 'secondary' },
      ctaShuffleOptions: [
        { text: 'how you felt today', color: 'amber' },
        { text: 'what you did today', color: 'secondary' },
        { text: 'that brilliant idea', color: 'purple' },
        { text: "what you're grateful for", color: 'teal' },
      ],
    }
  },
  computed: {
    ctaTextFontSize() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return '8.5vw'

        default:
          return '3rem'
      }
    },
  },
  mounted() {
    this.shuffleCtaText()
  },
  methods: {
    shuffleCtaText(interval = 3500) {
      setInterval(() => {
        const currentIndex =
          this.ctaShuffleOptions
            .map((option) => option.text)
            .indexOf(this.ctaShuffleText.text) || 0

        // Last option - cycle back to the first one
        if (currentIndex === this.ctaShuffleOptions.length - 1) {
          this.ctaShuffleText = this.ctaShuffleOptions[0]
        } else {
          // Any other option - go to the next option
          this.ctaShuffleText = this.ctaShuffleOptions[currentIndex + 1]
        }
      }, interval)
    },
  },
}
</script>

<style scoped>
h1 {
  font-size: 8vw;
  line-height: 1.15;
}
</style>
