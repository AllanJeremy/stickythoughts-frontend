import { postRequest } from '../../helpers/api'

/** Create a journal entry in the database
 * @param {Object} journalData The data to be entered in the database
 * @return {Promise<ApiResponse>} A promise the resolves into an API response object
 */
const createJournal = (journalData) => {
  const url = '/journal'
  const requestData = {
    data: journalData,
  }

  return postRequest(url, requestData)
}

//* EXPORTS
export default createJournal
