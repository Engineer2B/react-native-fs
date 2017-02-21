declare namespace native {
	/**
	 * The options of the download.
	 */
	interface DownloadOptions {
		/**
		 * The output file name or path.
		 */
		toFile: string;

		/**
		 * The url to download from.
		 */
		fromUrl: string;

		/**
		 * A number that identifies the download job.
		 */
		jobId: number;

		/**
		 * Any headers.
		 */
		headers?: { [name: string]: string };

		/**
		 * A progress counter.
		 */
		progressDivider: number;
	}
}