/**
 * An object containing the state of a upload job.
 */
export interface IUploadProgress {
  /**
   * The upload job ID, required if one wishes to cancel the upload.
   */
  jobId: number;

  /**
   *  The total number of bytes that will be sent to the server.
   */
  totalBytesExpectedToSend: number;

  /**
   * The number of bytes sent to the server.
   */
  totalBytesSent: number;
}