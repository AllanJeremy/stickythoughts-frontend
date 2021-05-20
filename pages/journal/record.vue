<template>
  <div>
    <v-tabs
      class="mb-8"
      color="teal"
      slider-color="teal"
      background-color="#ffefbb"
      fixed-tabs
    >
      <v-tab class="transparent">Record</v-tab>
      <v-tab>History</v-tab>
    </v-tabs>

    <section>
      <div>
        <label class="font-weight-bold" for="recordCategory">Category</label>
        <v-select
          v-model="selectedCategory"
          class="mt-2"
          :items="categories"
          :loading="categoriesLoading"
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
          class="mt-2"
          solo
          placeholder="Something to help you remember what you are talking about. You can leave this empty."
        ></v-textarea>
      </div>
    </section>

    <AudioRecorder />
  </div>
</template>

<script>
import AudioRecorder from '@/components/audio/AudioRecorder.vue'

export default {
  components: { AudioRecorder },
  layout: 'app',
  data() {
    return {
      selectedCategory: { text: 'Ideas', value: '1' },
      categoriesLoading: false,
      categories: [
        { text: 'Ideas', value: '1' },
        { text: 'Business', value: '2' },
        { text: 'Meditation', value: '3' },
      ],
    }
  },
  head() {
    return {
      title: 'Record',
    }
  },
  created() {
    this.$nuxt.$on('recordingComplete', (trackDetails) => {
      trackDetails.title = `Something in "${this.selectedCategory.text}"`

      this.$nuxt.$emit('loadTrack', trackDetails)
    })
  },
}
</script>
