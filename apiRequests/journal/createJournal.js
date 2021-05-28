import { postRequest } from '../../helpers/api'

/** Create a journal entry in the database
 * @param {Object} loggedInUser The currently logged in user object
 * @param {Object} journalData The data to be entered in the database
 * @return {Promise<ApiResponse>} A promise the resolves into an API response object
 */
const createJournal = (loggedInUser, journalData) => {
  const url = '/journal'

  // Embed user data into the request
  journalData.uid = loggedInUser.uid
  journalData.userFullName = loggedInUser.name

  const requestData = {
    data: journalData,
  }

  return postRequest(url, requestData)
}

//* EXPORTS
export default createJournal
