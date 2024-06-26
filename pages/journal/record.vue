<template>
  <div>
    <v-dialog v-model="modalRecordingLimitOpen" max-width="30rem">
      <v-card>
        <v-card-title class="text-error">Recording limit reached</v-card-title>

        <article class="px-6">
          <p class="font-weight-light">
            You have reached the recording limit of
            {{ recordingLimitMinutes }} minutes for your free account. Kindly
            upgrade your account to get unlimited recording plus more.
          </p>
        </article>

        <v-card-actions>
          <v-btn depressed @click="modalRecordingLimitOpen = false"
            >No, thanks</v-btn
          >
          <v-spacer></v-spacer>
          <v-btn depressed color="secondary" @click="handleUpgradeAccount"
            >Upgrade <span class="d-none d-sm-inline">my account</span></v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-tabs
      class="mb-8"
      color="teal"
      slider-color="teal"
      :background-color="uiCustomization.color.background"
      fixed-tabs
    >
      <v-tab class="font-weight-bold" to="/journal/record">Record</v-tab>
      <v-tab to="/journal/history">History</v-tab>
    </v-tabs>

    <section>
      <div>
        <label class="font-weight-bold" for="recordCategory">Category</label>
        <v-select
          v-model="selectedCategory"
          class="mt-2"
          :items="userCategoriesSorted"
          solo
          color="teal"
          item-color="teal"
          return-object
        ></v-select>
      </div>
      <div>
        <label class="font-weight-bold" for="recordCategory">Description</label>
        <v-textarea
          id="recordDescription"
          v-model="description"
          class="mt-2"
          solo
          placeholder="Something to help you remember what you are talking about. You can leave this empty."
        ></v-textarea>
      </div>

      <AudioRecorder :on-timer-updated="limitRecording" />
    </section>
  </div>
</template>

<script>
//
import _ from 'lodash'
import { mapState } from 'vuex'

// Config
import { FREE_RECORDING_LIMIT_SECONDS } from '@/config'

// API handlers
import { journalApi } from '@/apiRequests'

// Language
import { defaultErrorMessage } from '@/data/messages/feedback'

// Components
import AudioRecorder from '@/components/audio/AudioRecorder.vue'

// Mixins
import { UploadMixin } from '@/mixins'

export default {
  components: { AudioRecorder },
  mixins: [UploadMixin],
  layout: 'app',
  middleware: ['redirectLoggedInAppUser'], // ? Worth noting that this will be added to the default success page upon login for app users, for now this is the record page
  data() {
    return {
      selectedCategory: { text: 'Ideas', value: '1' },
      categoriesLoading: true,
      categories: [],
      description: '',
      uploadProgress: 0,
      currentUploadTask: null,
      journalData: {},

      //
      modalRecordingLimitOpen: false,
    }
  },
  head() {
    return {
      title: 'Record',
    }
  },
  computed: {
    ...mapState('user', { uiCustomization: 'customization', userData: 'data' }),
    userCategoriesSorted() {
      // Make a copy of categories since sort() mutates the array it is called on and we can't mutate store values outside the store.
      // We probably don't want to anyway
      const categories =
        JSON.parse(JSON.stringify(this.userData.categories)) || []
      const sortedCategories = categories.sort()

      //! Undocumented internal modification of external variable - consider alternative
      // If categories were found - select the first one among the sorted ones

      return sortedCategories
    },

    //
    recordingLimitMinutes() {
      const minutes = FREE_RECORDING_LIMIT_SECONDS / 60

      return Math.ceil(minutes)
    },
  },
  watch: {
    currentUploadTask(uploadTask) {
      if (_.isEmpty(uploadTask)) return

      //* HANDLING AUDIO RECORDING UPLOAD FUNCTIONALITY
      // Upload state changed
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          this.uploadProgress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100

          // Data to broadcast to other pages/components
          const uploadData = this.getUploadData(uploadTask, this.uploadProgress)

          this.$nuxt.$emit('uploading', uploadData)
        },
        (error) => {
          this.$toast.error('Oops! Something went wrong with the upload')

          // eslint-disable-next-line no-console
          console.error('Error details: ', error)
        },
        () => {
          // Emit upload complete event
          this.$nuxt.$emit('uploadComplete')

          // Upload is done ~ get the url to the uploaded asset
          this.currentUploadTask.snapshot.ref
            .getDownloadURL()
            .then((downloadUrl) => {
              //
              this.journalData.assetLink = downloadUrl

              journalApi
                .createJournal(this.userData, this.journalData)
                .then(() => {
                  // Provide the user with feedback
                  this.$toast.success(
                    'Journal entry upload successful. You can view it under History'
                  )

                  // Empty the description ~ it has been saved in the cloud
                  this.description = ''
                })
                .catch(() => {
                  this.$toast.error(defaultErrorMessage)
                })
                .finally(() => {
                  // Reset the current upload task to prevent duplicates
                  this.currentUploadTask = null
                })
            })
        }
      )
    },
  },
  created() {
    // Handle a completed recording
    this.$nuxt.$on('recordingComplete', (trackDetails) => {
      trackDetails.title = `Something in "${this.selectedCategory}"`

      const metadata = {
        title: `Something in ${trackDetails.title}`,
        artist: this.userData.name,
        duration: trackDetails.durationInSeconds,
        album: `${this.userData.name} - ${this.selectedCategory}`,
        year: new Date().getFullYear(),
        comment: this.description,
      }

      this.$nuxt.$emit('loadTrack', trackDetails)

      // Set the journal data
      this.journalData = this.getJournalData(trackDetails)

      // Start uploading the file automatically and store the upload task
      this.currentUploadTask = this.uploadAudio(
        trackDetails.file,
        this.generateFileName(trackDetails.extension),
        metadata
      )
    })
  },
  mounted() {
    // Pre-select the first category found if categories were found ~ which they usually will be (this is just some defensive programming)
    if (this.userCategoriesSorted.length) {
      this.selectedCategory = this.userCategoriesSorted[0]
    }
  },
  methods: {
    addUploadToQueue(uploadTask, extraData) {
      // TODO: Add this to store
    },
    generateFileName(extension) {
      const dateMs = new Date().getTime()
      const randomSeed = _.random(1000)

      const fileName = `Sticky-${_.upperFirst(
        this.selectedCategory
      )}-${dateMs}-${randomSeed}.${extension}`

      return fileName
    },

    /** A getter that returns an object containing journal data to be added to the database in the appropriate format */
    getJournalData(trackDetails) {
      const journalData = {
        duration: trackDetails.durationInSeconds,
        size: trackDetails.file.size,
        description: this.description,
        category: this.selectedCategory,
      }

      return journalData
    },

    uploadAudio(file, fileName, metadata) {
      const fullFilePath = `audio/${fileName}`
      return this.uploadFile(file, fullFilePath, metadata)
    },

    limitRecording(recordingDurationSeconds) {
      if (recordingDurationSeconds === FREE_RECORDING_LIMIT_SECONDS + 1) {
        this.$toast.info('Free account recording limit reached')
        this.modalRecordingLimitOpen = true
        this.$nuxt.$emit('completeRecording')
      }
    },

    handleUpgradeAccount() {
      this.modalRecordingLimitOpen = false
      this.$nuxt.$emit('upgradeAccount')
    },
  },
}
</script>
