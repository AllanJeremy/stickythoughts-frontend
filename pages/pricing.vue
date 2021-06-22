<template>
  <section>
    <div id="bg-subscription" class="bg-image bg-full"></div>

    <article>
      <div
        class="d-flex flex-column justify-center align-center text-center"
        style="min-height: 25vh; max-height: 300px"
      >
        <h1 class="display-3 font-weight-bold">Remember everything</h1>
        <p class="display-1 font-weight-light mt-4">
          Simple pricing to meet your needs
        </p>
      </div>
      <SubscriptionForm redirect="/auth/login" />
    </article>
  </section>
</template>

<script>
import SubscriptionForm from '@/components/subscriptions/SubscriptionForm.vue'

export default {
  components: { SubscriptionForm },
  layout: 'site',
  data() {
    return {
      // TODO: Add implementation
    }
  },
  head() {
    return {
      title: 'Subscription',
      description:
        'Subscribe to StickyThoughts to start preserving your thoughts today.',
    }
  },
}
</script>

<style lang="scss" scoped>
article {
  * {
    z-index: 100;
  }
}
#bg-subscription {
  background-image: url('/minimalist-headphones.jpg');
  z-index: 0;
  opacity: 0.35;
  filter: blur(4px);
}
</style>
