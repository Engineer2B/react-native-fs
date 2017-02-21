declare namespace native {
	/**
	 * Partial TypeScript representation of filestat object.
	 */
	export interface FileInfo {
		/**
		 * The length, in bytes, of the file denoted by this abstract pathname, or 0L if the file does not exist.
		 * Some operating systems may return 0L for pathnames denoting system-dependent entities such as devices or pipes.
		 */
		size: number;
		/**
		 * Is 1 if the file exists and is marked as a directory, is 0 otherwise.
		 */
		isdirectory: 1 | 0;
	}
}