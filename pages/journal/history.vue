<template>
  <section>
    <!-- Tabs -->
    <v-tabs
      class="mb-4"
      color="teal"
      slider-color="teal"
      :background-color="uiCustomization.color.background"
      fixed-tabs
    >
      <v-tab to="/journal/record">Record</v-tab>
      <v-tab to="/journal/history">History</v-tab>
    </v-tabs>

    <!-- [Modal] Filter journal entries -->
    <v-dialog
      v-if="modalFilterJournalEntriesOpen"
      v-model="modalFilterJournalEntriesOpen"
      scrollable
      max-width="25rem"
    >
      <v-card :color="uiCustomization.color.background">
        <v-card-title>Filter journal entries</v-card-title>

        <section class="mx-6">
          <div class="mb-4">
            <span class="d-block secondary--text pb-2">
              <small>Search term</small>
            </span>
            <v-text-field
              v-model="filterSearchQuery"
              type="search"
              placeholder="What do you hope to find?"
              solo
              hide-details
              class="py-0"
            >
            </v-text-field>
          </div>

          <div>
            <span class="d-block secondary--text">
              <small>Category</small>
            </span>
            <v-select
              v-model="filterCategory"
              :items="categories"
              solo
              item-color="teal"
              label="Category"
            ></v-select>
          </div>

          <div>
            <v-alert type="info" text> Date filters coming soon! </v-alert>
          </div>
        </section>

        <v-card-actions class="mt-4">
          <v-btn depressed @click="modalFilterJournalEntriesOpen = false"
            >Close
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="white--text"
            depressed
            color="teal"
            @click="filterEntries"
            >Filter results</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Search and filter -> Only displayed when there are journal entries -->
    <v-row v-if="allJournalEntries.length" class="align-center mb-4" no-gutters>
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
        <v-btn text icon large @click="modalFilterJournalEntriesOpen = true">
          <v-icon>mdi-filter-variant</v-icon>
        </v-btn>
      </v-col>

      <v-col
        v-if="filterCategory.toLowerCase() !== 'all'"
        cols="10"
        md="11"
        class="d-md-flex justify-md-end"
      >
        <v-spacer></v-spacer>
        <v-chip outline pill small color="secondary" class="text-right mt-2">{{
          filterCategory
        }}</v-chip>
      </v-col>
    </v-row>

    <v-alert
      v-if="filteredJournalEntries.length"
      type="info"
      text
      dense
      dismissible
      color="secondary"
      :value="true"
      class="mb-4"
    >
      You can
      <span class="d-none d-md-inline">click</span>
      <span class="d-inline d-md-none">tap</span>
      on any journal entry to view its details.
    </v-alert>

    <!-- Journal entries -->
    <v-progress-linear
      v-if="journalEntriesLoading"
      :indeterminate="true"
      color="secondary"
    ></v-progress-linear>

    <v-scroll-y-transition>
      <EmptyContainer
        v-if="!filteredJournalEntries.length && !journalEntriesLoading"
      >
        <h2 class="secondary--text">Looks like there's nothing here</h2>
        <p class="font-weight-light">
          Once you
          <nuxt-link class="secondary--text" to="/journal/record"
            >record some stuff</nuxt-link
          >
          it will appear here.
        </p>
      </EmptyContainer>
    </v-scroll-y-transition>

    <v-scroll-y-transition>
      <v-row v-if="filteredJournalEntries.length">
        <v-col
          v-for="(journalEntry, i) in filteredJournalEntries"
          :key="`journal-${i}`"
          cols="12"
          sm="6"
          class="py-0"
        >
          <JournalEntryCard
            :journal-entry="journalEntry"
            :categories="userData.categories"
            :on-delete="removeJournalEntryFromList(journalEntry.id)"
          />
        </v-col>
      </v-row>
    </v-scroll-y-transition>
  </section>
</template>

<script>
import { mapState } from 'vuex'

// Mixins
import { JournalMixin } from '@/mixins'

// Components
import EmptyContainer from '@/components/EmptyContainer.vue'
import JournalEntryCard from '@/components/JournalEntryCard.vue'

export default {
  components: {
    EmptyContainer,
    JournalEntryCard,
  },
  mixins: [JournalMixin],
  layout: 'app',
  data() {
    return {
      filterCategory: 'All',
      searchQuery: '',
      filterSearchQuery: '',
      modalFilterJournalEntriesOpen: false,
      categories: [],
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
  watch: {
    searchQuery(query) {
      // Update the filter search query to be the same
      this.filterSearchQuery = query

      // Perform search
      this.filteredJournalEntries = this.searchJournalEntries(
        query,
        this.filterCategory
      )
    },
  },
  created() {
    this.loadJournalEntries(this.userData.uid)

    this.categories = ['All', ...this.userCategoriesSorted]
  },
  methods: {
    filterEntries() {
      // Since we have the entries locally, this does not need to be async
      this.filteredJournalEntries = this.searchJournalEntries(
        this.filterSearchQuery,
        this.filterCategory
      )

      this.modalFilterJournalEntriesOpen = false

      const noun =
        this.filteredJournalEntries.length === 1 ? 'entry' : 'entries'

      this.$toast.info(
        `${this.filteredJournalEntries.length} journal ${noun} found`
      )
    },
  },
}
</script>
