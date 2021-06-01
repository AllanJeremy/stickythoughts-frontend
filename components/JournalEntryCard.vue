<template>
  <div v-if="!isDeleted">
    <!-- [Modal] Update journal entry-->
    <v-dialog
      v-if="modalEditJournalEntryOpen"
      v-model="modalEditJournalEntryOpen"
      scrollable
      :persistent="btnUpdateJournalEntryLoading"
      max-width="25rem"
    >
      <v-card>
        <v-card-title>Update journal entry</v-card-title>

        <section class="mx-6">
          <p class="font-weight-light">
            You are about to update a journal entry that was recorded on
            {{ journalEntry.dateAdded.toDate() | formatDate }}.
          </p>

          <div>
            <span class="d-block secondary--text pb-2">
              <small>Category</small>
            </span>
            <v-select
              v-model="categorySelected"
              :items="categories"
              solo
              item-color="teal"
              label="Category"
            ></v-select>
          </div>

          <div>
            <span class="d-block secondary--text pb-2">
              <small>Description</small>
            </span>
            <v-textarea
              v-model="description"
              solo
              placeholder="Something to help you remember what you are talking about. You can leave this empty."
            ></v-textarea>
          </div>
        </section>

        <v-card-actions class="mt-4">
          <v-btn depressed @click="modalEditJournalEntryOpen = false"
            >Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="white--text"
            depressed
            color="teal"
            :loading="btnUpdateJournalEntryLoading"
            :disabled="!canUpdateJournalEntry || btnUpdateJournalEntryLoading"
            @click="updateJournalEntry"
            >Update entry</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- [Modal] Delete journal entry -->
    <v-dialog
      v-if="modalDeleteJournalEntryOpen"
      v-model="modalDeleteJournalEntryOpen"
      max-width="25rem"
      :persistent="btnDeleteJournalEntryLoading"
    >
      <v-card
        ><v-card-title>Delete journal entry</v-card-title>

        <p class="font-weight-light mx-6">
          You are about to delete a journal entry in
          <strong class="font-weight-bold secondary--text">
            "{{ journalEntry.category }}"
          </strong>
          that was recorded on:
          {{ journalEntry.dateAdded.toDate() | formatDate }}
        </p>
        <v-card-text>
          Are you sure you want to delete this journal entry?
          <span class="error--text">This action is irreversible.</span>
        </v-card-text>

        <v-card-actions>
          <v-btn depressed @click="modalDeleteJournalEntryOpen = false"
            >Cancel</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn
            depressed
            color="error"
            :loading="btnDeleteJournalEntryLoading"
            :disabled="btnDeleteJournalEntryLoading"
            @click="deleteJournalEntry"
            >Confirm Delete</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- [Modal] Journal entry details  -->
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
              journalEntry.dateAdded.toDate() | formatDate
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
          <small>{{ journalEntry.dateAdded.toDate() | formatDate }}</small>
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
                class="py-6"
                text
                block
                small
                @click="modalJournalEntryDetailsOpen = true"
                >View</v-btn
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item class="px-0">
            <v-list-item-title
              ><v-btn
                class="py-6"
                text
                block
                small
                @click="modalEditJournalEntryOpen = true"
                >Edit</v-btn
              ></v-list-item-title
            >
          </v-list-item>
          <v-list-item class="px-0">
            <v-list-item-title
              ><v-btn
                class="py-6"
                text
                block
                small
                color="error"
                @click="modalDeleteJournalEntryOpen = true"
                >Delete</v-btn
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
import _ from 'lodash'

// Data
import { defaultErrorMessage } from '@/data/messages/feedback'

// API requests
import { journalApi } from '@/apiRequests'

// Mixins
import { FormatMixin, JournalMixin, UploadMixin } from '@/mixins'

export default {
  name: 'JournalEntryCard',
  mixins: [FormatMixin, JournalMixin, UploadMixin],
  props: {
    journalEntry: {
      type: Object,
      required: true,
    },
    categories: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isDeleted: false,
      isPlaying: false,
      modalJournalEntryDetailsOpen: false,

      modalEditJournalEntryOpen: false,
      btnUpdateJournalEntryLoading: false,

      modalDeleteJournalEntryOpen: false,
      btnDeleteJournalEntryLoading: false,

      categorySelected: this.journalEntry.category,
      description: this.journalEntry.description,
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
    canUpdateJournalEntry() {
      const { category, description } = this.journalEntry

      const categoryHasChanged = this.categorySelected !== category
      const descriptionHasChanged =
        this.description !== description && !_.isEmpty(this.description)

      // A journal entry is considered updateable if it has been modified
      return categoryHasChanged || descriptionHasChanged
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

    deleteJournalEntry() {
      this.btnDeleteJournalEntryLoading = true

      // [API request] Delete journal
      journalApi
        .deleteJournal(this.journalEntry.id)
        .then(() => {
          this.isDeleted = true

          // Close the delete journal modal
          this.modalDeleteJournalEntryOpen = false

          this.$toast.success('Successfully deleted journal entry')

          // Remove the journal id from our list of journal entries
          this.removeJournalEntryFromList(this.journalEntry.id)

          //* Delete file associated with this journal entry
          // User doesn't need to wait for this, it will happen in the background
          this.deleteFileFromURL(this.journalEntry.assetLink)
        })
        .catch(() => {
          this.$toast.error(defaultErrorMessage)
        })
        .finally(() => {
          this.btnDeleteJournalEntryLoading = false
        })
    },

    updateJournalEntry() {
      const updateData = {}

      // Intelligent update - only update category if it was updated
      if (this.categorySelected !== this.journalEntry.category) {
        updateData.category = this.categorySelected
      }

      // Intelligent update - only update description if it was updated
      if (this.description !== this.journalEntry.description) {
        updateData.description = this.description
      }

      this.btnUpdateJournalEntryLoading = true

      // [API request] Update the journal
      journalApi
        .updateJournal(this.journalEntry.id, updateData)
        .then(() => {
          this.$toast.success('Successfully updated journal')
        })
        .catch(() => {
          this.$toast.error(defaultErrorMessage)
        })
        .finally(() => {
          this.btnUpdateJournalEntryLoading = false
        })
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
