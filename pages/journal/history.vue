<template>
  <section>
    <v-tabs
      class="mb-4"
      color="teal"
      slider-color="teal"
      :background-color="uiCustomization.color.background"
      fixed-tabs
      value=""
    >
      <v-tab to="/journal/record">Record</v-tab>
      <v-tab to="/journal/history">History</v-tab>
    </v-tabs>

    <!-- Search and filter -->
    <v-row class="align-center mb-8" no-gutters>
      <v-spacer></v-spacer>
      <v-col cols="10" sm="6" lg="4">
        <div class="d-flex flex-row align-center">
          <v-text-field
            v-model="searchQuery"
            type="search"
            placeholder="What do you hope to find?"
            solo
            flat
            hide-details
            class="py-0"
          >
          </v-text-field>
        </div>
      </v-col>
      <v-col cols="2" sm="1" class="py-0 d-flex justify-end">
        <v-btn text icon large>
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
      </v-col>
    </v-row>

    <!-- Journal entries -->
    <v-row>
      <v-col
        v-for="(journalEntry, i) in currentJournalEntries"
        :key="`journal-${i}`"
        cols="12"
        sm="6"
        md="4"
        class="py-0"
      >
        <JournalEntryCard :journal-entry="journalEntry" />
      </v-col>
    </v-row>
  </section>
</template>

<script>
import { mapState } from 'vuex'

// API requests
import { journalApi } from '@/apiRequests'

// Mixins
import { JournalMixin } from '@/mixins'

// Components
import JournalEntryCard from '@/components/JournalEntryCard.vue'

export default {
  components: {
    JournalEntryCard,
  },
  mixins: [JournalMixin],
  layout: 'app',
  data() {
    return {
      filterCategory: 'all',
      searchQuery: '',
      filterSearchQuery: '',
      journalEntriesLoading: true,
      currentJournalEntries: [],
    }
  },
  head() {
    return {
      title: 'Journal Entries',
    }
  },
  computed: {
    ...mapState('user', {
      uiCustomization: 'customization',
      userData: 'data',
    }),
    userCategoriesSorted() {
      // Make a copy of categories since sort() mutates the array it is called on and we can't mutate store values outside the store.
      // We probably don't want to anyway
      const categories =
        JSON.parse(JSON.stringify(this.userData.categories)) || []
      const sortedCategories = categories.sort()

      return sortedCategories
    },
  },
  created() {
    // Add the current journals to this page
    // ? We'll do this once then search through them locally for efficiency
    journalApi
      .getJournalEntries(this.userData.uid)
      .then((journalEntriesFound) => {
        this.currentJournalEntries = journalEntriesFound
      })
      .finally(() => {
        this.journalEntriesLoading = false
      })
  },
  mounted() {
    // Pre-select the first category found if categories were found ~ which they usually will be (this is just some defensive programming)
    if (this.userCategoriesSorted.length) {
      this.selectedCategory = this.userCategoriesSorted[0]
    }
  },
  methods: {
    filterEntries() {
      // Since we have the entries locally, this does not need to be async
      this.currentJournalEntries = this.searchJournalEntries(
        this.currentJournalEntries,
        this.searchQuery,
        this.filterCategory
      )
    },
  },
}
</script>
