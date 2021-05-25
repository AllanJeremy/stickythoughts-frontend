<template>
  <div>
    <v-card
      class="pill d-flex align-center justify-space-between px-4"
      elevation="8"
      height="4rem"
    >
      <template v-if="!isRecording">
        <span class="font-weight-light">Tap the mic to start recording</span>
        <v-btn
          icon
          color="teal"
          large
          :disabled="!recorderIsEnabled"
          @click="startRecording"
          ><v-icon>mdi-microphone</v-icon></v-btn
        >
      </template>
      <template v-else>
        <v-btn
          icon
          color="error"
          large
          :disabled="!recordingControlsActive"
          @click="cancelRecording"
          ><v-icon>mdi-window-close</v-icon></v-btn
        >

        <div class="d-flex align-center">
          <v-icon class="pulsating" color="error">mdi-circle </v-icon>
          <h3 class="ml-1">{{ recordingDurationSeconds | formatTimer }}</h3>
        </div>

        <v-btn
          icon
          color="teal"
          large
          :disabled="!recordingControlsActive"
          @click="completeRecording"
          ><v-icon>mdi-check</v-icon></v-btn
        >
      </template>
    </v-card>
  </div>
</template>

<script>
import { FormatMixin } from '@/mixins'

export default {
  name: 'AudioRecorder',
  mixins: [FormatMixin],
  data() {
    return {
      isRecording: false,
      isLoading: false,
      isUploading: false,
      timerInterval: null,
      mediaRecorder: null,
      recordingStream: {},
      audioChunks: [],

      recordingControlsActive: false,
      recorderIsReady: false,
      recordingLocalUrl: null,
      recordingIsSupported: false,
      recordingDurationSeconds: 0,
      recordingFile: null,
    }
  },
  computed: {
    recorderIsEnabled() {
      const enabled = this.recordingIsSupported

      return enabled
    },
  },
  created() {
    this.recordingIsSupported =
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
  },
  methods: {
    startRecordingTimer() {
      // Recording controls inactive ~ minimum record time = 3 seconds
      this.recordingControlsActive = false

      this.timerInterval = setInterval(() => {
        this.recordingDurationSeconds++

        // Activate recording controls after 2 seconds of recording
        if (this.recordingDurationSeconds === 1) {
          // ? Using equality right here 👆🏾 instead of >= to make sure this only runs once
          this.recordingControlsActive = true
        }
      }, 1000)
    },
    resetTimer() {
      clearInterval(this.timerInterval)
      this.recordingDurationSeconds = 0
    },
    startRecording() {
      // Reset any recording related values that may have been set
      this.recordingFile = null
      this.isRecording = true
      this.recorderIsReady = false

      if (this.recordingIsSupported) {
        // Get the current user's microphone
        navigator.mediaDevices
          .getUserMedia({ audio: true })
          .then(async (recordingStream) => {
            this.mediaRecorder = await new MediaRecorder(recordingStream)
            this.recordingStream = recordingStream
            this.audioChunks = []

            // Start recording
            this.mediaRecorder.start(250)
            this.startRecordingTimer()

            // Capture the recording data
            this.mediaRecorder.ondataavailable = ({ data }) => {
              this.audioChunks.push(data)
            }
          })
          .catch((err) => {
            this.$nuxt.$emit('recordingError', err)
          })
      } else {
        const message =
          'This browser does not the microphone api. Please use a more recent browser.'
        throw new Error(message)
      }

      // This event notifies any listeners that recording has started
      this.$nuxt.$emit('recordingStarted')
    },
    stopRecording() {
      this.isRecording = false

      this.mediaRecorder.stop()

      // Stop all tracks being recorded in the stream
      this.recordingStream.getTracks().forEach((track) => track.stop())

      // Delay 1 second before allowing for clicking of the record button again
      setTimeout(() => {
        this.recorderIsReady = true
      }, 1000)
    },
    cancelRecording() {
      this.stopRecording()

      this.resetTimer()

      // This event notifies any listeners that recording has been cancelled
      this.$nuxt.$emit('recordingCancelled')
    },
    completeRecording() {
      this.stopRecording()
      this.recordingFile = new Blob(this.audioChunks, {
        type: 'audio/mpeg',
      })

      this.recordingLocalUrl = window.URL.createObjectURL(this.recordingFile)

      this.$nuxt.$emit('recordingComplete', {
        duration: this.recordingDurationSeconds,
        file: this.recordingFile,
        extension: 'mp3', // ? Custom extensions can be specified here
        localUrl: this.recordingLocalUrl,
      })

      // Cleanup the blob file we are setting after recording and let the Garbage collector handle the rest
      this.resetTimer()
      this.recordingFile = null
    },
  },
}
</script>

<style scoped>
.pill {
  border-radius: 3rem !important;
}
</style>
