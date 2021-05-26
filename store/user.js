import { defaultColor } from '../data/colorSuggestions'

export const state = () => ({
  isLoading: true,
  isLoggedIn: false,
  data: {}, // User data
  customization: {
    color: {
      background: defaultColor,
    },
  },
})

export const mutations = {
  /** Update the user */
  mutateUserData(state, userData) {
    state.isLoading = false
    state.data = { ...state.data, ...userData }

    // Update user customizations when any customization is updated
    if (userData.customization) {
      //* Getting here means that customization is at the very least an object
      state.customization.color.background = userData.customization.color
        ? userData.customization.color.background
        : defaultColor
    }
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
