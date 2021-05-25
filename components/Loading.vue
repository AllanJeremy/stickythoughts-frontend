<template>
  <div class="container-loading fill-height">
    <slot v-if="header">
      <h2>DrunkenApe Affiliates</h2>
      <p class="pb-4">Earn with DrunkenApe</p>
    </slot>

    <v-progress-circular
      size="40"
      indeterminate
      color="green"
    ></v-progress-circular>
  </div>
</template>

<script>
export default {
  name: 'Loading',
  props: {
    header: {
      type: Boolean,
      defaultValue: true,
    },
  },
  data() {
    return {
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
    }
  },
}
</script>

<style>
.container-loading {
  min-height: 50vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
