import _ from 'lodash'

import { mapActions } from 'vuex'

export default {
  data() {
    return {
      currentTrack: {},
      currentSelectedTime: 0,
      currentTimeSeconds: 0,
      playlist: null,
      isPlaying: false,
      playerIsOpen: false,
      trackDetails: {},
    }
  },
  computed: {
    audioElement() {
      const element = new Audio(this.trackUrl)
      return element
    },
    trackDuration() {
      const duration = this.trackDetails.durationInSeconds || 0

      return duration
    },
    trackDetailsValid() {
      const isValid =
        !_.isEmpty(this.trackDetails) && typeof this.trackDetails === 'object'
      return isValid
    },
    trackUrlValid() {
      const isValid =
        !_.isEmpty(this.trackDetails.localUrl) ||
        !_.isEmpty(this.trackDetails.url)

      return isValid
    },
    trackUrl() {
      const url = this.trackUrlValid
        ? this.trackDetails.localUrl || this.trackDetails.url
        : null

      return url
    },
    trackIsAvailable() {
      return this.trackDetailsValid && this.trackUrlValid
    },
    trackTitle() {
      const title = this.trackDetails.title || 'Something to remember'

      return title
    },
    trackDate() {
      const date = this.trackDetails.dateAdded || 'Tue, 12/Dec/2021 at 10:30pm'

      return date
    },
    playerTimeDisplayed() {
      const time = this.audioElement.currentTime
      return time
    },
  },
  watch: {
    currentSelectedTime(secondsNow, secondsPrevious) {
      if (
        secondsPrevious === this.currentTimeSeconds ||
        secondsNow === this.currentTimeSeconds
      )
        return

      this.audioElement.currentTime = secondsNow
      this.currentTimeSeconds = secondsNow
    },
    currentTimeSeconds(seconds) {
      this.currentSelectedTime = seconds
    },
    playerIsOpen(isOpen) {
      // Update the playing in the background state variable
      const trackOpenInBackground = !isOpen && !_.isEmpty(this.trackDetails)
      this.updateTrackOpenInBackground(trackOpenInBackground)
    },
  },
  created() {
    this.$nuxt.$on('openPlayer', () => {
      this.playerIsOpen = true
    })

    // Load a track without playing it
    this.$nuxt.$on('loadTrack', (trackDetails) => {
      this.setupExternalTrack(trackDetails)
      this.playerIsOpen = true
    })

    // Play track
    this.$nuxt.$on('playTrack', (trackDetails) => {
      this.setupExternalTrack(trackDetails)
      this.playTrack()
    })

    // Pause track
    this.$nuxt.$on('pauseTrack', this.pauseTrack)

    // Stop playing track
    this.$nuxt.$on('stopPlaying', this.stopPlaying)
  },
  methods: {
    ...mapActions('audio', ['updateTrackOpenInBackground']),
    setupExternalTrack(trackDetails) {
      // Set up component track details data
      this.trackDetails = trackDetails
    },

    playTrack() {
      // Something is wrong with the track details provided
      if (!this.trackDetailsValid) {
        throw new Error(
          'Track details need to be provided to play a track. The track details must also be a valid JavaScript Object'
        )
      }

      if (!this.trackUrlValid) {
        throw new Error(
          'No track url found. Please specify one before attempting to play a track'
        )
      }

      this.playerIsOpen = true
      this.isPlaying = !this.audioElement.ended
      this.audioElement.play()

      let interval

      this.audioElement.onplaying = () => {
        setInterval(() => {
          this.currentTimeSeconds = this.audioElement.currentTime
        }, interval)
      }

      // Once the playback ends, allow the user to play it again by reverting isPlaying to false
      this.audioElement.onended = (e) => {
        clearInterval(interval)
        this.isPlaying = false

        this.$nuxt.$emit('playbackEnded')
      }
    },
    stopPlaying() {
      this.audioElement.load()
    },
    closePlayer() {
      // Stop playing any tracks before closing the audio player
      this.stopPlaying()
      this.playerIsOpen = false
    },
    pauseTrack(shouldClosePlayer = false) {
      this.isPlaying = false

      this.audioElement.pause()

      if (shouldClosePlayer) {
        this.playerIsOpen = false
      }
    },
  },
}
