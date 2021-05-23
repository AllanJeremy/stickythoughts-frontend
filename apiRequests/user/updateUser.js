import { patchRequest } from '../../helpers/api'

/** Update an existing user
 * @param {String} uid The uid of the currently logged in user
 * @param {Object} updateData An object representing the data to be used to update the user
 * @return {Promise<ApiResponse>} A promise that resolves to an ApiResponse object
 */
const updateUser = (uid, updateData) => {
  return patchRequest(`/user/${uid}`, { data: updateData })
}

//* EXPORTS
export default updateUser
