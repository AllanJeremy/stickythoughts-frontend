<template>
  <v-app>
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
        &amp;
        <a
          class="grey--text"
          href="https://www.instagram.com/journalingtherapy_ke/"
          target="_blank"
          rel="noopener noreferrer"
          ><i>Journaling Therapy</i></a
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
