import _ from 'lodash'

import { journalsCollection } from '../../helpers/firebase'

/** Get journal entries for the current user from the database
 * @param {UUID} uid The currently logged in user's UID
 * @param {String} category A string representing the category to filter by. Defaults to 'all' meaning all categories
 */
const getJournalEntries = async (uid, category = 'all') => {
  // Journal entries to return
  let journalEntries = []

  // Ensure errors are handled
  try {
    let query = journalsCollection.where('uid', '==', uid)

    // Only filter by category if it's an actual category and not all categories
    if (category !== 'all') {
      query = query.where('category', '==', category)
    }

    const querySnapshot = await query.orderBy('dateAdded', 'desc').get()

    // Get the data
    querySnapshot.forEach((doc) => {
      const currentJournalEntry = doc.data()

      if (doc.exists) {
        journalEntries.push(currentJournalEntry)
        currentJournalEntry.id = doc.id
      }
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
