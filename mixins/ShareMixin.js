export default {
  methods: {
    async shareApp() {
      const shareData = {
        url: 'https://stickythoughts.app/auth/login',
        title: 'Share StickyThoughts',
        text:
          'I remember everything by recording my thoughts with StickyThoughts. You can join for free too!',
      }
      await navigator.share(shareData)
    },
  },
}
