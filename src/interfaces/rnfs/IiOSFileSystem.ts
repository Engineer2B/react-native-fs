import { IFileSystem } from './IFileSystem';
import { IDirectoryOptions } from '../iOS/IDirectoryOptions';
import { IUploadOptions } from '../iOS/IUploadOptions';
import { IUploadBegin } from '../iOS/IUploadBegin';
import { IUploadProgress } from '../iOS/IUploadProgress';
import { IJobTicket } from '../native/IJobTicket';
import { IUploadResult } from '../iOS/IUploadResult';
/**
 *  Native iOS file system.
 *
 * ![apple logo](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJcAAACXCAMAAAAvQTlLAAAAbFBMVEX///8jHyAAAAAgHB0UDhAIAAD7+/scFxgaFRb19fX4+Pjw8PAeGRrs7OwPCArV1dWXlpfNzM3Hx8epqKkrKClJRkeHhoehoKBWVFW+vb3b29t1dXVfXl5MS0xBP0C3t7doaGiPjo43Nzd/fX5CAUU4AAADE0lEQVR4nO2a27KiMBBFSSfBKBDuHARGAf//Hwf1eAbQGQ1VdKipXo/44K6ks/uSOA5BEARBEARBEARBEMT/ymFvW8ELvGNRlp5tFXO8qBdanwLbOqa4KQPOmNrYeu1b7bMB1W4qwIITsBu6sC1ljJfruywmU9taRrjt92oxBlsKr1Q+ZMnWtpYRgebfsrgIbYsZUfzsoq5d22L+EGSP5fLZlkz1/DiLHM62tYxwa/2QtSWPcPa5usnawZdtKROCe9RDn9hWMmXQxZWES2VbyIwARNZEWzqId9wwrLZQQ1TJ16Up2yiZb1x1LnImRFZ2R/w9TepeghRCA/T12K7SNgOpfM59AZC1uE6W5CB89pMMAYrwWj948QVAPVz/+pOC/oimyu2kYBM48LKIilIBZzMUdEi5MmAw//NB2U5LvXv+fnM0lFos6MXLv/87EqMHCUAZyhpWrFx9K/eNfq9jjoDVDaN4EVvvkOXqWSBYIAt+rR9erWnMDzU1Qocb7p786R1KIyTNWr4XMoXvMDqjZzt/h8SYByTGUc8Bo/TpjLdRXhBkuY2x1WuM6Apy/72SCbtfGHV1lZmGvagRZDmxcWrUHYYu8+MoUVpcc104E4EFuja6XluNL4Fhq05sbPeqwUhDITP1L55hdNxVb1xOoBzIffm6QfwHqkfQ5dTmVTRgjAEi864DJXObG8WwYAip+7BAF0ro5+YzAJTk/bVkwThEa48nQmXsYFegXNlePXMHuyGyy7qzgAVOcYOvPNHxFuraZavKcpwl4y+GYBbJIl3r1xUH896WoUwpjos8HyFJnhYUFRjldGI+A0OpWp3CVBjSBe4ezMYniqHIGl38fwTOJPOG0ZgVUHrbO/3nJiZOeLKcWHxa7/gM9aXOp+7KIcaU9XxPxH0lhFDzkwoRrqxrST3aSh/8vK0vdZur6WcLL2Kix0UkF+BHYXCt4d0gLn5uuIfvVl7EVI0Ara+X/tOeOm04gARgraVHHoe4a5vi/JT8DmHaXbp0aw9iCIIgCIIgCIIgCIIgCIIgCIIgCIJYld/D0SXte+A4dAAAAABJRU5ErkJggg==)
 */
export interface IFileSystemiOS extends IFileSystem {
  LibraryDirectoryPath: string;
  MainBundlePath: string;

  /**
   * Create a new directory.
   * @param {string} dirPath The path to the directory.
   * @param {DirectoryOptions} options Options for this directory.
   * @returns {Promise<void>} A promise indicating if the directory was successfuly created.
   */
  mkdir(dirPath: string, options?: IDirectoryOptions): Promise<void>;

  /**
   * Retrieve the path of a given bundle.
   * @param {string} bundledName The name of a bundle.
   * @returns {Promise<string>} The bundle's path.
   */
  pathForBundle(bundleNamed: string): Promise<string>;

  /**
   * Stop an upload job.
   * @param {number} jobId The identifier of the upload job.
   */
  stopUpload(jobId: number): void;

  /**
   * Upload a file.
   * 
   * @param {IUploadOptions} options 
   * @param {(result: IUploadBegin) => void} [downloadBeginCbFn] 
   * @param {(result: IUploadProgress) => void} [downloadProgressCbFn] 
   * @returns {IJobTicket<IUploadResult>} 
   * 
   * @memberOf IFileSystemiOS
   */
  uploadFiles(options: IUploadOptions, 
    downloadBeginCbFn?: (result: IUploadBegin) => void,
    downloadProgressCbFn?: (result: IUploadProgress) => void): IJobTicket<IUploadResult>;
}