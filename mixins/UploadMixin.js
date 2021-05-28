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
     * @param {String} fileName The full filename (including path) that we want to delete
     */
    deleteFile(fileName) {
      // TODO: Add implementation
    },
  },
}
