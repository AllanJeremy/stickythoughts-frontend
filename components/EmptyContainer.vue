<template>
  <v-container class="fill-height d-flex flex-column justify-center">
    <section class="text-center header-content">
      <slot name="header"></slot>
    </section>

    <section v-if="imageUrl.length" class="d-flex mx-auto mb-4">
      <img :src="imageUrl" :alt="alt" :style="`opacity: ${opacity}`" />
    </section>

    <section class="text-center body-content"><slot></slot></section>
  </v-container>
</template>

<script>
export default {
  name: 'EmptyContainer',
  props: {
    imageUrl: {
      type: String,
      default: '/no-data.svg', // Default svg we use for missing data
    },
    opacity: {
      type: String,
      default: '1.0',
    },
    alt: {
      type: String,
      default: 'NewPine image',
    },
  },
}
</script>

<style scoped>
.body-content,
.header-content h1,
h2,
h3,
h4,
h5,
h6 {
  line-height: 1.25;
  margin-bottom: 8px !important;
}

img {
  width: 100%;
  max-height: 15rem;
  max-width: 20rem;
  align-self: center;
}
</style>
