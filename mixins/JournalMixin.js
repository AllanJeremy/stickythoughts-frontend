import _ from 'lodash'

//* EXPORTS
export default {
  methods: {
    getTrackDetails(journalEntry) {
      const trackDetails = {
        title: `Something in ${journalEntry.category}`,
        durationInSeconds: journalEntry.durationInSeconds,
        url: journalEntry.assetLink,
      }

      return trackDetails
    },

    /** Search through a pre-existing list of journal entries
     * @description Usually, this function will receive the journal entries to search through from the component/page calling it
     * @param {Array<JournalEntry>} journalEntries An array of journal entries
     * @param {String} searchQuery The search query
     * @param {String} category A string representing the category to filter by. Defaults to 'all' meaning all categories
     * @return {Array<JournalEntry>} An array of journal entries found matching the given query
     */
    searchJournalEntries(journalEntries, searchQuery = '', category = 'all') {
      // Convert to lowercase to negate case sensitivity
      searchQuery = searchQuery.toLowerCase()
      category = category.toLowerCase()

      const searchThroughAllCategories = category === 'all'

      let filteredJournalEntries = journalEntries.map((currentJournalEntry) => {
        // [Category search] When we are searching through all categories, the category field now becomes a search point
        if (searchThroughAllCategories) {
          const categoryContainsSearchQuery = currentJournalEntry.category.includes(
            category
          )

          if (categoryContainsSearchQuery) {
            // Add the current journal entry
            return currentJournalEntry
          }
        }
        // ? Using else if so that we don't add duplicates
        // [Tag search] If there are tags, search through them first - this is faster than searching description
        else if (
          _.isArray(currentJournalEntry.tags) &&
          !_.isEmpty(currentJournalEntry.tags)
        ) {
          // .toLowerCase makes this case insensitive
          const tagsContainSearchQuery = currentJournalEntry.tags
            .map((entry) => entry.toLowerCase())
            .includes(searchQuery)

          if (tagsContainSearchQuery) {
            // Add the current journal entry
            return currentJournalEntry
          }
        }
        // [Description search] Slowest to search through since it might be longer, only used as a last resort
        else if (_.isString(currentJournalEntry.description)) {
          // Check description for search query
          const descriptionContainsSearchQuery = currentJournalEntry.description
            .toLowerCase()
            .includes(searchQuery)

          if (descriptionContainsSearchQuery) {
            // Add the current journal entry
            return currentJournalEntry
          }
        }

        // If nothing was found ~ return false - this will be filtered out
        return false
      })

      // Remove any empty entries
      filteredJournalEntries = _.compact(filteredJournalEntries)

      return filteredJournalEntries
    },
  },
}
