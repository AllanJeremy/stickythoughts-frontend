/* 
    This file is simply meant to be an aggregator of all api request aggregators
    This file does not implement any logic of its own and simply serves the purpose of importing functions and exporting them out together so that they can be loaded from one file.
*/
import journalApi from './journal'
import marketInsightApi from './marketInsight'
import paymentApi from './payment'
import userApi from './user'

//* EXPORTS
export { journalApi, marketInsightApi, paymentApi, userApi }
