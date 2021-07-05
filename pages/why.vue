<template>
  <section>
    <v-parallax dark src="/hand-holding-golden-mic.jpg">
      <div class="bg-full overlay"></div>
      <v-row align="center" justify="center" style="z-index: 100">
        <v-col class="text-center" cols="12">
          <h1 class="text-h4 font-weight-bold mb-4">Why StickyThoughts?</h1>
          <p class="font-weight-thin">
            StickyThoughts lets you vocally record, organize and retrieve your
            thoughts everywhere
          </p>

          <v-btn
            class="white--text"
            depressed
            color="teal"
            to="/auth/login"
            x-large
            >GET STARTED FOR FREE</v-btn
          >
          <p class="white--text">
            <small><i>No credit card required</i></small>
          </p>
        </v-col>
      </v-row>
    </v-parallax>

    <article
      class="px-8 fill-height d-flex flex-column align-center justify-center text-center"
    >
      <h1 class="display-2 font-weight-bold mb-2">
        We do less so you can do more
      </h1>
      <h2 class="display-1 grey--text mb-4">
        The simplest way to journal with your voice.
      </h2>
      <p class="font-weight-light">
        We take security seriously and use the same servers that Google uses to
        protect your thoughts.
      </p>

      <v-btn class="white--text" depressed color="teal" to="/auth/login" x-large
        >GET STARTED FOR FREE</v-btn
      >
    </article>
  </section>
</template>

<script>
export default {
  layout: 'site',
  head() {
    return {
      title: 'Remember everything',
    }
  },
}
</script>

<style lang="scss" scoped>
.overlay {
  background-color: black;
  opacity: 0.64;
  z-index: 0;
}

article {
  min-height: 80vh;
  width: 100%;
  max-width: 50rem;
  margin: auto;

  p {
    line-height: 180%;
  }
}
</style>
