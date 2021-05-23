// State
export const state = () => ({
  isUploading: false,
  currentUploadTask: {},
  uploadTaskQueue: [],
})

// Mutations
export const mutations = {
  mutateIsUploading(state, value) {
    state.isUploading = value
  },
  mutateCurrentUploadTask(state, value) {
    state.isUploading = value
  },
  mutateAddToUploadTaskQueue(state, value) {
    state.uploadTaskQueue = [value, ...state.uploadTaskQueue]
  },
  mutateRemoveFromUploadTaskQueue(state, value) {
    state.uploadTaskQueue = state.uploadTaskQueue.filter(
      (currentVal) => currentVal !== value
    )
  },
}

// Actions
export const actions = {
  updateIsUploading(context, value) {
    context.commit('mutateIsUploading', value)
  },
  updateCurrentUploadTask(context, value) {
    context.commit('mutateCurrentUploadTask', value)
  },
  addToUploadTaskQueue(context, value) {
    context.commit('mutateAddToUploadTaskQueue', value)
  },
  removeFromUploadTaskQueue(context, value) {
    context.commit('mutateRemoveFromUploadTaskQueue', value)
  },
}
