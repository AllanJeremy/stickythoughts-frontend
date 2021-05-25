import { auth as firebaseAuth } from '../helpers/firebase'

export default {
  methods: {
    /** Logout of the firebase account */
    logout(successCallback = () => {}, errorCallback = () => {}) {
      firebaseAuth.signOut().then(successCallback).catch(errorCallback)
    },
  },
}
