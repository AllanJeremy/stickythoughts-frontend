<template>
  <v-bottom-sheet v-model="playerIsOpen">
    <v-card class="d-flex justify-space-around align-center" height="7.5rem">
      <div class="mx-3">
        <v-btn
          v-show="!isPlaying"
          x-large
          icon
          :disabled="!trackIsAvailable"
          @click="playTrack"
          ><v-icon>mdi-play</v-icon></v-btn
        >
        <v-btn
          v-show="isPlaying"
          x-large
          icon
          :disabled="!trackIsAvailable"
          @click="pauseTrack"
          ><v-icon>mdi-pause</v-icon></v-btn
        >

        <h4 class="text-center font-weight-light text--secondary">
          {{ currentTimeSeconds | formatTimer }}
          <br />
        </h4>
      </div>

      <div class="slider-container">
        <h3>{{ trackTitle }}</h3>
        <h5 class="font-weight-medium text--secondary">
          {{ trackDate }}
        </h5>
        <v-slider
          v-model="currentSelectedTime"
          :value="currentTimeSeconds"
          :max="trackDetails.duration"
          :label="trackDetails.duration | formatTimer"
          inverse-label
          color="teal"
          track-color="grey"
          :disabled="!trackDetailsValid"
          hide-details
        ></v-slider>
      </div>

      <v-spacer></v-spacer>

      <slot name="right"></slot>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import _ from 'lodash'
import { FormatMixin } from '@/mixins'

export default {
  mixins: [FormatMixin],
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
      const duration = this.trackDetails.duration || 0

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
  },
  created() {
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
    this.$nuxt.$on('pauseTrack', () => this.pauseTrack)
  },
  methods: {
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
    pauseTrack() {
      this.isPlaying = false

      this.audioElement.pause()
    },
  },
}
</script>

<style scoped>
.slider-container {
  min-width: 15.75rem;
}
</style>
