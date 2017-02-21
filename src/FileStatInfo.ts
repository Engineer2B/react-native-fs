export class FileStatInfo implements rnfs.IFileStatInfo {
  /**
* The length, in bytes, of the file denoted by this abstract pathname,
* or 0L if the file does not exist.
* Some operating systems may return 0L for pathnames denoting
* system-dependent entities such as devices or pipes.
*/
  get Size(): number {
    return this.size;
  }
  /**
   * Is true if the file exists and is marked as a directory, is false otherwise.
   */
  get IsDirectory(): boolean {
    return this.isDirectory;
  }

  /**
   * The pathname string of the parent directory named by
   * this abstract pathname, or null if this pathname does not name a parent
   */
  get Parent(): string {
    return this.parent;
  }

  /**
   * A value representing the time the file was last modified,
   * measured in milliseconds since the epoch (00:00:00 GMT, January 1, 1970),
   * or 0L if the file does not exist or if an I/O error occurs
   */
  get ModifiedTime(): Date {
    return this.modifiedTime;
  }

  private constructor(
    private size: number,
    private isDirectory: boolean,
    private parent: string,
    private modifiedTime: Date) {
  }

  static FromNativeFileStatInfo(input: native.FileStatInfo): FileStatInfo {
    return new FileStatInfo(
      input.size,
    input.isdirectory === 1,
    input.parent,
    new Date(input.mtime * 1000));
  }
}