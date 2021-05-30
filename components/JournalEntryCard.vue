<template>
  <v-card
    :class="`d-flex my-2 px-2 py-2 journal-entry-card bg-image ${activeClass}`"
  >
    <div class="bg-full active-bg-overlay"></div>

    <div
      class="d-flex flex-column justify-center align-center"
      style="z-index: 100"
    >
      <!-- Play button -->
      <v-btn v-if="!isPlaying" icon @click="playJournalEntry">
        <v-icon>mdi-play</v-icon>
      </v-btn>

      <!-- Pause button -->
      <v-btn v-if="isPlaying" icon @click="pauseJournalEntry">
        <v-icon>mdi-pause</v-icon>
      </v-btn>

      <small class="pl-3">{{
        journalEntry.durationInSeconds | formatTimer
      }}</small>
    </div>

    <!-- Entry details -->
    <div class="ml-4" style="z-index: 100">
      <h4 class="font-weight-light">
        Something in {{ journalEntry.category }}
      </h4>
    </div>
  </v-card>
</template>

<script>
//* Smart component
import { FormatMixin, JournalMixin } from '@/mixins'

export default {
  name: 'JournalEntryCard',
  mixins: [FormatMixin, JournalMixin],
  props: {
    journalEntry: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isPlaying: false,
    }
  },
  computed: {
    activeClass() {
      const theClass = this.isPlaying ? 'active' : ''

      return theClass
    },
  },
  created() {
    this.$nuxt.$on('playbackEnded', () => {
      this.isPlaying = false
    })

    this.$nuxt.$on('stopAllEntryPlays', () => {
      this.isPlaying = false

      // Reset the audio being played
      this.$nuxt.$emit('stopPlaying')
    })
  },
  methods: {
    playJournalEntry() {
      this.$nuxt.$emit('stopAllEntryPlays')

      this.isPlaying = true

      this.trackDetails = this.getTrackDetails(this.journalEntry)

      this.$nuxt.$emit('openPlayer')
      this.$nuxt.$emit('playTrack', this.trackDetails)
    },
    pauseJournalEntry() {
      this.isPlaying = false

      this.$nuxt.$emit('pauseTrack')
    },
  },
}
</script>

<style lang="scss" scoped>
$transitionTime: 0.5s;

.active-bg-overlay {
  background-color: white;
  transition: background-color $transitionTime;
  opacity: 0.75;
  z-index: 1;
}

.journal-entry-card {
  background-image: url('/white-marble-background.jpg');
  transition: background-image $transitionTime;

  &.active {
    background-image: url('/earphones-closeup-music-background.jpg');
    z-index: 100;

    h4,
    i,
    small {
      color: white !important;
      transition: color $transitionTime;
    }

    .active-bg-overlay {
      background-color: teal;
      opacity: 0.7;
    }
  }
}
</style>
