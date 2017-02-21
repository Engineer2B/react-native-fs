declare namespace rnfs {
  /**
   * FileStatInfo with a date instead of number.
   */
  export interface IFileStatInfo {
    /**
		 * The length, in bytes, of the file denoted by this abstract pathname,
		 * or 0L if the file does not exist.
		 * Some operating systems may return 0L for pathnames denoting
		 * system-dependent entities such as devices or pipes.
		 */
    Size: number;
    /**
     * Is true if the file exists and is marked as a directory, is false otherwise.
     */
    IsDirectory: boolean;

    /**
     * The pathname string of the parent directory named by
     * this abstract pathname, or null if this pathname does not name a parent
     */
    Parent: string;

    /**
     * A value representing the time the file was last modified,
     * measured in milliseconds since the epoch (00:00:00 GMT, January 1, 1970),
     * or 0L if the file does not exist or if an I/O error occurs
     */
    ModifiedTime: Date;
  }
}