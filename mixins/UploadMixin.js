import { storage } from '@/helpers/firebase'

export default {
  data() {
    return {
      isUploading: false,
    }
  },
  methods: {
    /** Get the object representing the current upload's data
     * @param {Object} uploadTask The current upload task
     * @param {Number} uploadProgressPercentage The current percentage of the upload. 0 is starting , 100 is finished
     * @return {Object} An object containing the upload task and progress
     */
    getUploadData(uploadTask, uploadProgressPercentage) {
      const uploadData = {
        task: uploadTask,
        progressPercentage: uploadProgressPercentage,
      }

      return uploadData
    },

    /** Upload a file to storage
     * @param {Blob} file The file to be uploaded
     * @param {String} fileName The name of the file (including the extension) to be uploaded
     * @return {UploadTask} The upload task of the current upload
     */
    uploadFile(file = null, fileName = null, fileMetadata = {}) {
      const storageRef = storage.ref(fileName)

      const uploadTask = storageRef.put(file, fileMetadata)

      return uploadTask
    },

    /** Delete a file from storage
     * @param {String} fileUrl The url to the file we want to delete
     * @return {Promise} A promise that resolves to the file deletion status
     */
    deleteFileFromURL(fileUrl) {
      const storageRef = storage.refFromURL(fileUrl)

      return storageRef.delete()
    },

    /** Pause an upload
     * @param {Object} uploadTask The upload task to pause
     */
    pauseUpload(uploadTask) {
      return uploadTask.pause()
    },

    /** Resume an upload
     * @param {Object} uploadTask The upload task to resume
     */
    resumeUpload(uploadTask) {
      return uploadTask.resume()
    },

    /** Cancel an upload
     * @param {Object} uploadTask The upload task to cancel
     */
    cancelUpload(uploadTask) {
      return uploadTask.cancel()
    },
  },
}
