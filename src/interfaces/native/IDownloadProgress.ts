/**
 * An object containing the state of a download job.
 */
export interface IDownloadProgress {
  /**
   * The download job's identifier.
   */
  jobId: number;
  /**
   * The length of the content or -1 if it is not known.
   */
  contentLength: number;
  /**
   * The number of bytes that got downloaded thus far.
   */
  bytesWritten: number;
}