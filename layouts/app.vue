<template>
  <v-app>
    <!-- App bar -->
    <v-app-bar color="transparent" flat max-height="56px">
      <v-app-bar-nav-icon
        @click.stop="navIsOpen = !navIsOpen"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>Journable</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="navIsOpen" class="nav" app>
      <v-list-item class="d-flex">
        <v-list-item-content>
          <v-list-item-title class="title">Allan Jeremy</v-list-item-title>
          <v-list-item-subtitle>0 Day Streak</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense nav>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          link
          :to="item.link"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Actual content -->
    <v-container class="px-8 py-4">
      <Nuxt />
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      navIsOpen: false,
      navItems: [
        { icon: 'mdi-microphone', title: 'Record', link: '/journal/record' },
        {
          icon: 'mdi-calendar-range',
          title: 'History',
          link: '/journal/history',
        },
        {
          icon: 'mdi-shape-outline',
          title: 'Categories',
          link: '/journal/categories',
        },
        {
          icon: 'mdi-school-outline',
          title: 'Tutorial',
          link: '/journal/tutorial',
        },
        {
          icon: 'mdi-credit-card-multiple-outline',
          title: 'Billing',
          link: '/journal/subscriptions',
        },

        {
          icon: 'mdi-help-circle-outline',
          title: 'Support',
          link: '/journal/help',
        },
        { icon: 'mdi-logout-variant', title: 'Logout', link: '/auth/logout' },
      ],
    }
  },
}
</script>

<style scoped>
.nav {
  z-index: 999 !important;
}
</style>
