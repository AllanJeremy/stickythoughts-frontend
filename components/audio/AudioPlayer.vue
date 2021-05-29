<template>
  <v-bottom-sheet v-model="playerIsOpen" hide-overlay>
    <v-card
      class="d-flex justify-space-around align-center"
      height="7.5rem"
      :color="color"
    >
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
          :max="trackDetails.durationInSeconds"
          :label="trackDetails.durationInSeconds | formatTimer"
          inverse-label
          color="teal"
          track-color="grey"
          :disabled="!trackDetailsValid"
          :step="0.05"
          hide-details
        ></v-slider>
      </div>

      <v-spacer></v-spacer>

      <slot name="right"></slot>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import { AudioPlayerMixin, FormatMixin } from '@/mixins'

export default {
  mixins: [AudioPlayerMixin, FormatMixin],
  props: {
    color: {
      type: String,
      default: '#FFF',
    },
  },
}
</script>

<style scoped>
.slider-container {
  width: 100%;
  max-width: 70vw;
}
</style>
