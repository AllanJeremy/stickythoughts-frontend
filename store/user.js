export const state = () => ({
  isLoading: true,
  isLoggedIn: false,
  data: {}, // User data
})

export const mutations = {
  /** Update the user */
  mutateUserData(state, userData) {
    state.isLoading = false
    state.data = { ...state.data, ...userData }
  },

  /** Update the logged in status */
  mutateLoggedInStatus(state, isLoggedIn) {
    state.isLoading = false
    state.isLoggedIn = isLoggedIn
  },
}

export const actions = {
  updateUser(context, userData) {
    context.commit('mutateUserData', userData)
  },
  updateLoggedInStatus(context, isLoggedIn) {
    context.commit('mutateLoggedInStatus', isLoggedIn)
  },
}
