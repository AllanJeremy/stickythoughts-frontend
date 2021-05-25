import { storage } from '@/helpers/firebase'

export default {
  data() {
    return {
      isUploading: false,
    }
  },
  methods: {
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
