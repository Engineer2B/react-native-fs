declare namespace native {
	/**
	 * TypeScript representation of the filestat object.
	 */
	interface FileStatInfo extends FileInfo {
		/**
		 * The pathname string of the parent directory named by
		 * this abstract pathname, or null if this pathname does not name a parent
		 */
		parent: string;
		/**
		 * A value representing the time the file was last modified,
		 * measured in milliseconds since the epoch (00:00:00 GMT, January 1, 1970),
		 * or 0L if the file does not exist or if an I/O error occurs
		 */
		mtime: number;
	}
}