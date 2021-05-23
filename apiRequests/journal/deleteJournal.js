import { deleteRequest } from '../../helpers/api'

/** Delete a journal entry in the database
 * @param {String} journalId The id of the journal to delete
 * @return {Promise<ApiResponse>} A promise the resolves into an API response object
 */
const deleteJournal = (journalId) => {
  const url = `/journal/${journalId}`

  return deleteRequest(url)
}

//* EXPORTS
export default deleteJournal
