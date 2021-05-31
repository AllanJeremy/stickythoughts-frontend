<template>
  <div>
    <!-- Journal entry details  -->
    <v-dialog
      v-if="modalJournalEntryDetailsOpen"
      v-model="modalJournalEntryDetailsOpen"
      scrollable
      max-width="25rem"
    >
      <v-card>
        <v-card-title>Journal entry details</v-card-title>

        <section class="mx-6">
          <p class="font-weight-light">
            This journal entry was recorded under
            <strong class="font-weight-bold">{{
              journalEntry.category
            }}</strong>
            on
            <strong class="font-weight-bold">{{
              journalEntry.dateAdded | formatFirebaseTimestamp
            }}</strong>
          </p>

          <article v-if="journalEntry.description">
            <small>Description</small>
            <p class="font-weight-light">{{ journalEntry.description }}</p>
          </article>
        </section>

        <v-card-actions class="mt-4">
          <v-btn depressed @click="modalJournalEntryDetailsOpen = false"
            >Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-if="canPlay" outlined color="teal" @click="playJournalEntry"
            >Play</v-btn
          >
          <v-btn
            v-if="canPause"
            outlined
            color="error"
            @click="pauseJournalEntry"
            >Pause</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Journal entry card -->
    <v-card
      :class="`d-flex my-2 px-2 py-2 journal-entry-card bg-image ${activeClass}`"
    >
      <div class="bg-full active-bg-overlay"></div>

      <div class="top d-flex flex-column justify-center align-center">
        <!-- Play button -->
        <v-btn v-if="canPlay" icon @click="playJournalEntry">
          <v-icon>mdi-play</v-icon>
        </v-btn>

        <!-- Pause button -->
        <v-btn v-if="canPause" icon @click="pauseJournalEntry">
          <v-icon>mdi-pause</v-icon>
        </v-btn>

        <small class="pl-3">{{
          journalEntry.durationInSeconds | formatTimer
        }}</small>
      </div>

      <!-- Entry details -->
      <div
        class="ml-4 top cursor-pointer d-flex flex-column justify-center"
        @click="modalJournalEntryDetailsOpen = true"
      >
        <h4 class="font-weight-light">
          {{ journalEntry.category }}
        </h4>
        <span class="secondary--text">
          <small>{{ journalEntry.dateAdded | formatFirebaseTimestamp }}</small>
        </span>
      </div>

      <v-spacer></v-spacer>

      <v-menu class="top d-flex flex-column justify-center" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            :attrs="attrs"
            class="top"
            style="height: inherit"
            plain
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item class="px-0">
            <v-list-item-title
              ><v-btn
                class="py-4"
                text
                block
                small
                @click="modalJournalEntryDetailsOpen = true"
                >View</v-btn
              ></v-list-item-title
            >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card>
  </div>
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
      modalJournalEntryDetailsOpen: false,
    }
  },
  computed: {
    activeClass() {
      const theClass = this.isPlaying ? 'active' : ''

      return theClass
    },
    canPlay() {
      return !this.isPlaying || this.isPaused
    },
    canPause() {
      return this.isPlaying && !this.isPaused
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
      this.isPaused = false

      this.trackDetails = this.getTrackDetails(this.journalEntry)

      this.$nuxt.$emit('openPlayer')
      this.$nuxt.$emit('playTrack', this.trackDetails)
    },
    pauseJournalEntry() {
      this.isPlaying = false
      this.isPaused = true

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

  .cursor-pointer:hover {
    cursor: pointer;
  }

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
.top {
  z-index: 100 !important;
}
</style>
