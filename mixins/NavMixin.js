import _delay from 'lodash/delay'

export default {
  methods: {
    itemIsActive(current) {
      return this.$router.history.current.path === current
    },
    goTo(link, wait = 0) {
      if (this.$router.history.current.path !== link) {
        _delay(() => {
          this.$router.push({
            path: link,
          })
        }, wait)
      }
    },
  },
}
