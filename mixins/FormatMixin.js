export default {
  filters: {
    formatTimer(timerString) {
      const formatted = timerString
        .replace(/\s/, '')
        .split(':')
        .map((digitStr) => (digitStr.length === 1 ? `0${digitStr}` : digitStr))
        .join(':')

      return formatted
    },
  },
}
