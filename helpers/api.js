import axios from 'axios'
import { API_URL } from '../config'

// Set the default base URL
axios.defaults.baseURL = API_URL

// #region UNAUTHENTICATED REQUESTS
/** Make a standard unauthenticated get request
 * @param {String} url The url the API request should be sent to
 * @param {Object} requestParams Any request parameters passed in as part of the request
 * @return {Promise<Object>} A promise that resolves to the API response if successful. If rejected, the promise returns details of what went wrong with the request.
 */
const getRequest = async (url, requestParams = {}) => {
  const response = await axios.get(url, { params: requestParams })
  return response.data
}

/** Make a standard unauthenticated post request
 * @param {String} url The url the API request should be sent to
 * @param {Object} requestData Any data that needs to be passed in as part of the request
 * @return {Promise<Object>} A promise that resolves to the API response if successful. If rejected, the promise returns details of what went wrong with the request.
 */
const postRequest = async (url, requestData = {}) => {
  const response = await axios.post(url, requestData)
  return response.data
}

/** Make a standard unauthenticated patch request
 * @param {String} url The url the API request should be sent to
 * @param {Object} requestData Any data that needs to be passed in as part of the request
 * @return {Promise<Object>} A promise that resolves to the API response if successful. If rejected, the promise returns details of what went wrong with the request.
 */
const patchRequest = async (url, requestData = {}) => {
  const response = await axios.patch(url, requestData)
  return response.data
}

/** Make a standard unauthenticated delete request
 * @param {String} url The url the API request should be sent to
 * @param {Object} requestParams Any request parameters passed in as part of the request
 * @return {Promise<Object>} A promise that resolves to the API response if successful. If rejected, the promise returns details of what went wrong with the request.
 */
const deleteRequest = async (url, requestParams = {}) => {
  const response = await axios.delete(url, { params: requestParams })
  return response.data
}

// #endregion UNAUTHENTICATED REQUESTS

export { getRequest, postRequest, patchRequest, deleteRequest }
