import _ from 'lodash'

import { journalsCollection } from '../../helpers/firebase'

/** Get journal entries for the current user from the database
 * @param {UUID} uid The currently logged in user's UID
 * @param {String} category A string representing the category to filter by. Defaults to 'all' meaning all categories
 */
const getJournalEntries = async (uid, category = 'all') => {
  let query = journalsCollection.where('uid', '==', uid)

  // When they want to search through all categories
  if (category === 'all') {
    query = journalsCollection.where('category', '==', category)
  }

  // Journal entries to return
  let journalEntries = []

  // Ensure errors are handled
  try {
    const querySnapshot = await query.get()

    journalEntries = querySnapshot.map((doc) => {
      const currentJournalEntry = doc.data()

      // If the value ends up being false - it will be filtered out in the final results
      return doc.exists ? currentJournalEntry : false
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(
      'Something went wrong while trying to fetch journal entries',
      error
    )
  }

  // Remove any empty entries
  journalEntries = _.compact(journalEntries)

  // Return the entries we found
  return journalEntries
}

//* EXPORTS
export default getJournalEntries
