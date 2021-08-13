<template>
  <v-app dark>
    <section class="fill-height text-center">
      <template v-if="error.statusCode === 404">
        <img
          class="background mx-auto"
          src="/page-not-found.svg"
          alt="Page not found"
          width="95%"
        />
        <h1>
          {{ pageNotFound }}
        </h1>
      </template>

      <template v-else>
        <img
          class="background mx-auto"
          src="/bug-fixing.svg"
          alt="Error"
          width="70%"
        />
        <h1>
          {{ otherError }}
        </h1>
      </template>

      <div class="mt-4">
        <v-btn class="white--text" depressed color="teal" x-large to="/"
          >Go back home</v-btn
        >
      </div>
    </section>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: 'Page not found',
      otherError: 'An error occurred',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
.background {
  opacity: 0.84;
}
</style>
