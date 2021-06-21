import { postRequest } from '../../helpers/api'

/** Add a recurring payment - otherwise known as a subscription payment
 * @param {Object} user The paying user's object (MUST contain `uid`, `name` & `email`)
 * @param {String} paymentPlanName A string representing the name of the payment plan in the database
 * @param {String} redirectUrl The url to redirect to on successful payment
 * @return {Promise<PaymentRequestResponse>} The payment request response of this payment
 */
const addRecurringPayment = (loggedInUser, paymentPlan, redirectUrl) => {
  const { name, email, uid } = loggedInUser

  // Only selecting the fields that are needed by the API
  const userData = {
    name,
    email,
    uid,
  }

  // API request data
  const requestData = {
    data: {
      user: userData,
      paymentPlan,
      redirectUrl,
    },
  }

  return postRequest('/payment/subscription', requestData)
}

//* EXPORTS
export default addRecurringPayment
