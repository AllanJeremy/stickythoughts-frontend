import _ from 'lodash'

export default {
  filters: {
    formatTimer(durationInSeconds) {
      durationInSeconds = parseInt(durationInSeconds)

      const seconds = isNaN(durationInSeconds) ? 0 : durationInSeconds % 60
      const min = seconds === 0 ? 0 : Math.floor(seconds / 60)
      const hours = seconds === 0 ? 0 : Math.floor(seconds / 3600)

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
