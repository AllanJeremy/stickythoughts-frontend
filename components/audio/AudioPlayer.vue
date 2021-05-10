<template>
  <v-bottom-sheet v-model="playerIsOpen" hide-overlay> </v-bottom-sheet>
</template>

<script>
import _ from 'lodash'

export default {
  data() {
    return {
      currentTrack: {},
      playlist: null,
      isPlaying: false,
      playerIsOpen: false,
    }
  },
  created() {
    // TODO: Play track
    this.$nuxt.$on('playTrack', (trackDetails) => this.playTrack(trackDetails))

    // TODO: Pause track
    this.$nuxt.$on('pauseTrack', () => this.pauseTrack)
  },
  methods: {
    playTrack(trackDetails) {
      // Something is wrong with the track details provided
      if (_.isEmpty(trackDetails) || !_.isObject(trackDetails)) {
        throw new Error(
          'Track details need to be provided to play a track. The track details must also be a valid JavaScript Object'
        )
      }

      // Either the url or local url must be provided
      if (_.isEmpty(trackDetails.localUrl) && _.isEmpty(trackDetails.url)) {
        throw new Error(
          'No track url found. Please specify one before attempting to play a track'
        )
      }

      this.currentTrack.url = _.isEmpty(trackDetails.localUrl)
        ? trackDetails.url
        : trackDetails.localUrl
    },
    pauseTrack() {},
  },
}
</script>
