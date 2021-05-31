import _ from 'lodash'
import dayjs from 'dayjs'

export default {
  filters: {
    formatTimer(durationInSeconds) {
      durationInSeconds = parseInt(durationInSeconds)

      const seconds = durationInSeconds % 60
      const min = Math.floor(durationInSeconds / 60) % 60
      const hours = Math.floor(durationInSeconds / 3600)

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
    removeExtraSpaces(string) {
      const formattedString = string.replace(/\s/g, ' ')

      return formattedString
    },
    formatDate(dateObj) {
      // Tue, 12/Dec/2021 at 10:30pm
      const dateFormat = 'ddd D/MMM/YYYY hh:mma'
      const formatted = dayjs(dateObj).format(dateFormat)

      return formatted
    },
  },
}
