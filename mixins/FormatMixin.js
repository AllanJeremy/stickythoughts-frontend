import _ from 'lodash'

export default {
  filters: {
    formatTimer(durationInSeconds) {
      const seconds = parseInt(durationInSeconds) % 60
      const min = Math.floor(seconds / 60)
      const hours = Math.floor(seconds / 3600)

      let formattedTime = `${_.padStart(min, 2, '0')}:${_.padStart(
        seconds,
        2,
        '0'
      )}`

      if (hours > 0) {
        formattedTime = `${_.padStart(hours, 2, '0')}:${formattedTime}`
      }

      return formattedTime
    },
  },
}
