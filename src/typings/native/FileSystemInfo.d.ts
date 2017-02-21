declare namespace native {
	/**
	 * TypeScript representation of a filesystem object.
	 */
	export interface FileSystemInfo {
		/**
		 * The total disk space.
		 */
		totalSpace: number;
		/**
		 * The total free space.
		 */
		freeSpace: number;
	}
}