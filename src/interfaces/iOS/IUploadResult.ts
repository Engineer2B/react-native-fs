/**
 * An object generated from an upload job.
 */
export interface IUploadResult {
  /**
   * The upload job ID, required if one wishes to cancel the upload.
   * See `stopUpload`.
   */
  jobId: number;

  /**
   * The HTTP status code.
   */
  statusCode: number;

  /**
   * The HTTP response headers from the server.
   */
  headers: { [name: string]: string };

  /**
   * The HTTP response body.
   */
  body: string;
}