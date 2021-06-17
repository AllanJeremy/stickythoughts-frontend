<template>
  <v-app>
    <v-toolbar flat max-height="4rem">
      <nuxt-link to="/">
        <v-img
          src="/logo-horizontal-light-bg.svg"
          alt="StickyThoughts logo"
          width="14rem"
      /></nuxt-link>
      <nuxt-link to="/"> </nuxt-link>
      <v-spacer></v-spacer>

      <ul class="nav d-none d-md-inline-block">
        <li>
          <nuxt-link to="/why">Why StickyThoughts</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/pricing">Plans</nuxt-link>
        </li>
        <li>
          <a target="_blank" href="https://blog.stickythoughts.app?source=app"
            >Blog <v-icon small>mdi-open-in-new</v-icon></a
          >
        </li>
      </ul>

      <v-spacer></v-spacer>

      <!-- Login/Signup -->
      <v-btn
        class="font-weight-bold d-none d-sm-flex"
        outlined
        color="teal"
        link
        to="/auth/login"
        >Login / Signup</v-btn
      >

      <!-- Navigation drawer -->
    </v-toolbar>
    <v-main>
      <v-container fluid>
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
      navIsOpen: false,
    }
  },
}
</script>

<style lang="scss" scoped>
.nav {
  li {
    list-style: none;
    display: inline-block;
    margin: auto 1.5rem;

    a {
      color: #212121;
      text-decoration: none !important;
      text-transform: uppercase;
      font-size: 80%;

      &.nuxt-link-active {
        font-weight: bold;
        color: teal;
      }
    }
  }
}
</style>
