import { postRequest } from '../../helpers/api'

/** Create a new user
 * @description This will ignore creation if the user already exists and data returned will be null
 * @param {Object} userData An object representing the data of the user to be created
 * @return {Promise<ApiResponse>} A promise that resolves to an ApiResponse object
 */
const createUser = (userData) => {
  return postRequest('/user', { data: userData })
}

//* EXPORTS
export default createUser
