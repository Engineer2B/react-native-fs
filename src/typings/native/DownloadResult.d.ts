declare namespace native {
	/**
	 * An object containing the status of a download job.
	 */
	interface DownloadResult {
		/**
		 * A number that identifies the download job.
		 */
		jobId: number;
		/**
		 * A HTTP status code of the download.
		 */
		statusCode: number;
		/**
		 * How many bytes have been written so far.
		 */
		bytesWritten: number;
	}
}