import { patchRequest } from '../../helpers/api'

/** Update journal records
 * @param {String} journalId The id of the journal to be updated
 * @param {Object} updateData The data to update to
 * @return {Promise<ApiResponse>} A promise the resolves into an API response object
 */
const updateJournal = (journalId, updateData) => {
  const url = `/journal/${journalId}`
  const requestData = {
    data: updateData,
  }

  return patchRequest(url, requestData)
}

//* EXPORTS
export default updateJournal
