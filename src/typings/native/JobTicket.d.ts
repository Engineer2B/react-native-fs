declare namespace native {
	/**
	 * Object used by methods that intiate downloads and uploads.
	 * TODO: check if it can be cancelled immediately.
	 */
	interface JobTicket<T> {
		/**
		 * A number that identifies the job.
		 */
		jobId: number;
		/**
		 * Resolves when the job has been completed.
		 */
		promise: Promise<T>;
	}
}