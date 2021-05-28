<template>
  <div class="container-loading fill-height">
    <slot v-if="header">
      <h2>StickyThoughts</h2>
      <p class="pb-4">Remember everything.</p>
    </slot>
    <img
      src="/logo-sticky-thoughts.svg"
      alt="StickyThoughts logo"
      width="256"
    />

    <v-progress-circular
      class="mt-4"
      size="40"
      indeterminate
      color="rgba(237, 171, 84, 0.9)"
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
