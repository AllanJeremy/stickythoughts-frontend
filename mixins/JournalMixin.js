import _ from 'lodash'

// API requests
import { journalApi } from '@/apiRequests'

//* EXPORTS
export default {
  data() {
    return {
      allJournalEntries: [],
      filteredJournalEntries: [],
      journalEntriesLoading: true,
    }
  },
  methods: {
    getTrackDetails(journalEntry) {
      const trackDetails = {
        title: `Something in ${journalEntry.category}`,
        dateAdded: journalEntry.dateAdded,
        durationInSeconds: journalEntry.durationInSeconds,
        url: journalEntry.assetLink,
      }

      return trackDetails
    },

    /** Load journal entries from the database */
    loadJournalEntries(userUid, category = 'all') {
      this.journalEntriesLoading = true

      // Add the current journals to this page
      // ? We'll do this once then search through them locally for efficiency
      journalApi
        .getJournalEntries(userUid, category)
        .then((journalEntriesFound) => {
          this.allJournalEntries = journalEntriesFound
          this.filteredJournalEntries = journalEntriesFound
        })
        .finally(() => {
          this.journalEntriesLoading = false
        })
    },

    removeJournalEntryFromList(journalEntryId) {
      // Remove it from all journal entries
      this.allJournalEntries = this.allJournalEntries.filter(
        (journalEntry) => journalEntry.id !== journalEntryId
      )

      //  Remove it from filtered entries
      this.filteredJournalEntries = this.filteredJournalEntries.filter(
        (journalEntry) => journalEntry.id !== journalEntryId
      )
    },

    /** Search through a pre-existing list of journal entries
     * @description Usually, this function will receive the journal entries to search through from the component/page calling it
     * @param {String} searchQuery The search query
     * @param {String} categoryToSearch A string representing the category to filter by. Defaults to 'all' meaning all categories
     * @return {Array<JournalEntry>} An array of journal entries found matching the given query
     */
    searchJournalEntries(searchQuery = '', categoryToSearch = 'All') {
      const searchThroughAllCategories =
        categoryToSearch.toLowerCase() === 'all'

      // Entries to filter through
      // TODO: Add date filtering to pre-filter journal entries
      const journalEntriesToFilter = this.allJournalEntries

      // When the search query is empty ~ we don't have to perform any complex searches
      if (_.isEmpty(searchQuery)) {
        // Return all records if we are searching through all categories
        const filteredJournalEntries = searchThroughAllCategories
          ? journalEntriesToFilter
          : journalEntriesToFilter.filter(
              (journalEntry) =>
                journalEntry.category.toLowerCase() ===
                categoryToSearch.toLowerCase()
            )

        return filteredJournalEntries
      }

      //* Getting here means that we DO HAVE a search query
      const filteredJournalEntries = journalEntriesToFilter.filter(
        ({ category, description }) => {
          // [Category search] When searching through all categories ~ the category becomes a search point
          if (
            searchThroughAllCategories &&
            category.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return true
          }

          // [Description search]
          if (
            !_.isEmpty(description) &&
            description.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            return true
          }

          // Getting here means nothing was found in our previous searches
          return false
        }
      )

      // Return the search results
      return filteredJournalEntries
    },
  },
}
