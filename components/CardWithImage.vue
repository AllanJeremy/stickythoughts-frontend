<template>
  <v-card class="mb-6" :width="width">
    <v-img
      class="white--text"
      :alt="alt"
      :height="height"
      gradient="to top right, rgba(0,0,0,.3), rgba(0,0,0,.7)"
      :src="imageUrl"
    >
      <v-card-title><slot name="title"></slot></v-card-title>
      <v-card-subtitle class="white--text text-left"
        ><slot></slot
      ></v-card-subtitle>
    </v-img>
  </v-card>
</template>

<script>
export default {
  name: 'CardWithImage',
  props: {
    alt: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '6.5rem',
    },
    width: {
      type: String,
      default: '100%',
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
}
</script>
