import { auth as firebaseAuth, usersCollection } from '../helpers/firebase'

const setLoggedInUserData = ({ store }) => {
  let userIsLoggedIn = false

  firebaseAuth.onAuthStateChanged((loggedInUser) => {
    if (loggedInUser) {
      // User was found ~ we are currently logged in
      userIsLoggedIn = true

      let userData = {
        uid: loggedInUser.uid,
        name: loggedInUser.displayName,
        email: loggedInUser.email,
      }

      // Check for user updates
      usersCollection.doc(loggedInUser.uid).onSnapshot((usersSnapshot) => {
        // Get the first user record found if the snapshot is not empty ~ aka. There is at least one user that matches that criteria
        if (usersSnapshot.exists) {
          userData = { ...userData, ...usersSnapshot.data() }

          // Update user store
          store.dispatch('user/updateUser', userData)
        }
      })
    }

    // Update the logged in status
    store.dispatch('user/updateLoggedInStatus', userIsLoggedIn)
  })
}

//* EXPORTS
export default setLoggedInUserData
