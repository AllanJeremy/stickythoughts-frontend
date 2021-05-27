import { postRequest } from '../../helpers/api'

/** Add new customer types eg. Student, Entrepreneur - Attached to the user
 * @description This will ignore creation if the user already exists and data returned will be null
 * @param {UUID} uid A string representing the currently logged in user's uid
 * @param {Object} customerTypesData An object representing the data of the customer type to be created
 * @return {Promise<ApiResponse>} A promise that resolves to an ApiResponse object
 */
const addCustomerTypes = (uid, customerTypesData) => {
  return postRequest(`/insight/customer-types/${uid}`, {
    data: customerTypesData,
  })
}

//* EXPORTS
export default addCustomerTypes
