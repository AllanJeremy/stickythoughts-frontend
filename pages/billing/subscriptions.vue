<template>
  <section>
    <SubscriptionForm />
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
