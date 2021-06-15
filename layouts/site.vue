<template>
  <v-app>
    <v-toolbar max-height="4rem">
      <img
        src="/logo-horizontal-light-bg.svg"
        alt="StickyThoughts logo"
        height="100%"
      />
      <v-spacer></v-spacer>
      <v-btn text large>Why StickyThoughts</v-btn>
      <v-btn text to="/pricing">Pricing</v-btn>
      <v-spacer></v-spacer>
      <v-btn class="font-weight-bold" outlined color="teal"
        >Login / Signup</v-btn
      >
    </v-toolbar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <small class="mx-auto grey--text"
        >Made with ♥ by
        <a
          class="grey--text"
          href="https://www.allanjeremy.com"
          target="_blank"
          rel="noopener noreferrer"
          ><i>Allan Jeremy</i></a
        >
      </small>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      fixed: false,
    }
  },
}
</script>
