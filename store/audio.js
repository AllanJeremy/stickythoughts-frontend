// State
export const state = () => ({
  trackOpenInBackground: false,
})

// Mutations
export const mutations = {
  mutateTrackOpenInBackground(state, value) {
    state.trackOpenInBackground = value
  },
}

// Actions
export const actions = {
  updateTrackOpenInBackground(context, value) {
    context.commit('mutateTrackOpenInBackground', value)
  },
}
