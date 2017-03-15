/**
 * Object used in file uploads.
 */
export interface IUploadFileItem {
  /**
   * Name of the file,
   * if not defined then filename is used.
   */
  name: string;

  /**
   * Name of file.
   */
  filename: string;

  /**
   * Path of file.
   */
  filepath: string;

  /**
   * The mimetype of the file to be uploaded,
   * if not defined it will get mimetype
   * from `filepath` extension.
   */
  filetype: string;
}