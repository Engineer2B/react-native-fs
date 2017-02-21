declare namespace native {
	/**
	 * An object containing the status of a download job.
	 */
	interface DownloadBegin {
		/**
		 * A number that identifies the download job.
		 */
		jobId: number;
		/**
		 * A HTTP status code of the download.
		 */
		statusCode: number;
	  /**
		 * The length of the content or -1 if it is not known.
		 */
		contentLength: number;
		/**
		 * The headers of the download.
		 */
		headers: { [name: string]: string };
	}
}