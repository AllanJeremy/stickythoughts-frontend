const redirectLoggedInAppUser = ({ redirect, route, store }) => {
  // Keep checking until we get a user
  const interval = setInterval(() => {
    const { data: userData } = store.state.user

    // User was found
    if (Object.keys(userData).length) {
      console.log('user: ', userData)
      const redirectUrl = userData.isNew
        ? '/journal/onboarding'
        : '/journal/record'

      clearInterval(interval)

      // Prevent infinite redirects by only redirecting if we aren't already on the page
      if (!route.path.includes(redirectUrl)) {
        redirect(redirectUrl)
      }
    }
  }, 100)
}

//* EXPORTS
export default redirectLoggedInAppUser
