<template>
  <v-app>
    <!-- Navigation drawer -->
    <v-navigation-drawer
      v-if="navShouldExist"
      v-model="navIsOpen"
      app
      style="z-index: 999"
    >
      <v-list-item class="d-flex">
        <v-list-item-content>
          <nuxt-link to="/">
            <v-img
              src="/logo-horizontal-light-bg.svg"
              alt="StickyThoughts logo"
              width="14rem"
          /></nuxt-link>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          v-for="(item, i) in navItems"
          :key="`lg-nav-${i}`"
          replace
          :to="item.external ? undefined : item.link"
          :href="item.external ? item.link : undefined"
          :target="item.external ? '__blank' : undefined"
        >
          <v-list-item-content>
            <v-list-item-title
              >{{ item.title.toUpperCase() }}
              <v-icon v-if="item.external" small
                >mdi-open-in-new</v-icon
              ></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item>
          <v-list-item-content>
            <!-- Login/Signup -->
            <v-btn
              class="font-weight-bold"
              outlined
              color="teal"
              link
              to="/auth/login"
              >Login / Signup</v-btn
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar flat max-height="4rem">
      <nuxt-link to="/">
        <v-img
          src="/logo-horizontal-light-bg.svg"
          alt="StickyThoughts logo"
          width="14rem"
      /></nuxt-link>
      <v-spacer></v-spacer>

      <ul class="nav d-none d-md-inline-block">
        <li v-for="(item, i) in navItems" :key="`lg-nav-${i}`">
          <nuxt-link v-if="!item.external" :to="item.link">{{
            item.title
          }}</nuxt-link>

          <a v-if="item.external" target="_blank" :href="item.link"
            >{{ item.title }} <v-icon small>mdi-open-in-new</v-icon></a
          >
        </li>
      </ul>

      <v-spacer></v-spacer>

      <!-- Login/Signup -->
      <v-btn
        class="font-weight-bold d-none d-md-flex"
        outlined
        color="teal"
        link
        to="/auth/login"
        >Login / Signup</v-btn
      >

      <v-app-bar-nav-icon
        class="d-md-none"
        @click.stop="navIsOpen = !navIsOpen"
      ></v-app-bar-nav-icon>
    </v-toolbar>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      navIsOpen: false,
      navItems: [
        {
          title: 'Why StickyThoughts',
          link: '/why',
        },
        {
          title: 'Plans',
          link: '/pricing',
        },
        {
          title: 'Blog',
          link: 'https://blog.stickythoughts.app?utm-source=app',
          external: true,
        },
      ],
    }
  },
  computed: {
    navShouldExist() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
        case 'sm':
          return true

        default:
          return false
      }
    },
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
