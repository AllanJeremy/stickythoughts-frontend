import { postRequest } from '../../helpers/api'

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
