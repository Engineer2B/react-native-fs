declare namespace native.iOS {
	/**
	 * An object containing the status of the upload job.
	 */
	interface UploadBegin {
		/**
		 * The upload job ID, required if one wishes to cancel the upload.
		 * {@link rnfs.IiOSRNFSManager.stopUpload}.
		 */
  jobId: number;
	}
}