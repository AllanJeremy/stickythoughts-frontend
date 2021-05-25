<template>
  <v-app>
    <v-main>
      <div id="onboarding-bg"></div>
      <v-container class="fill-height d-flex flex-column justify-center">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

<style scoped>
#onboarding-bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('/empty-notepad-minimalist.jpg');
  background-size: cover;
  background-position: center;
  filter: blur(3px);
}
</style>
