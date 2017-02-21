import { NativeModules } from 'react-native';
declare module "react-native" {
  namespace NativeModules {
    interface IRNFSManager {
      RNFSCachesDirectoryPath: string;
      RNFSDocumentDirectoryPath: string;
      RNFSExternalDirectoryPath: string;
      RNFSExternalStorageDirectoryPath: string;
      RNFSTemporaryDirectoryPath: string;


      RNFSFileTypeRegular: string;
      RNFSFileTypeDirectory: string;

      /**
       * Read the contents of a directory.
       * @param {string} dirPath The path to the directory.
       * @returns {Promise<FilePathInfo[]>} A promise with a list of FilePathInfo objects.
       */
      readDir(dirPath: string): Promise<native.FilePathInfo[]>;

      /**
       * Create a directory.
       * @param {string} filePath The (unix style) path to the directory.
       * @returns {Promise<null>} A promise containing null if the operation was succesfull.
       */
      mkdir(filePath: string): Promise<null>;

      /**
       * Move a file from the filePath to the destPath.
       * @param {string} filepath The (unix style) path to the file.
       * @param {string} destPath The destination path to the file.
       * @returns {Promise<boolean>} A promise with a value indicating whether or not the movement was a success.
       */
      moveFile(filepath: string, destPath: string): Promise<boolean>;

      /**
       * Write content to a file.
       * @param {string} filepath The (unix style) path to the file.
       * @param {string} base64Content A string with base64 encoding that will be written to the file.
       * @returns {Promise<null>} A promise which will be null upon success.
       */
      writeFile(filepath: string, base64Content: string): Promise<null | { filePath: string, exception: Error }>;

      /**
       * Append content to a file.
       * @param {string} filePath The (unix style) path to the file.
       * @param {string} base64Content A string with base64 encoding that will be written to the file.
       * @returns {Promise<null>} A promise which will be null upon success.
       */
      appendFile(filePath: string, base64Content: string): Promise<null>;

      /**
       * Check if a file exists.
       * @param {string} filePath The (unix style) path to the file.
       * @returns {Promise<boolean>} A promise with the result.
       */
      exists(filePath: string): Promise<boolean>;

      /**
       * Read the contents of a file. 
       * @param {string} filePath The (unix style) path to the file.
       * @returns {Promise<string>} A promise that will contain the file's content in base64 encoding.
       */
      readFile(filePath: string): Promise<string>;

      /**
			 * Calculate the hash of the file.
			 * @param {string} filePath The (unix style) path to the file.
			 * @param {HashAlgorithm} algorithm The algorithm that is used to determine the hash value of the file. 
			 * @returns {Promise<string>} A promise with the hex string of the hash of the file.
			 */
			hash(filePath: string, algorithm: native.HashAlgorithm): Promise<string>;

      /**
			 * Copy a file from the filePath to the destPath.
			 * @param {string} filePath The (unix style) path to the file.
			 * @param {string} destPath The destination path to the file.
			 * @returns {Promise<null>} A promise with a value of null when the copying succeeded.
			 */
			copyFile(filePath: string, destPath: string): Promise<null>;

      /**
			 * Returns some stats of a given file path.
			 * @param {string} filePath The (unix style) path to the file.
			 * @returns {Promise<FileStatInfo>} A promise containing the stats of the file.
			 */
			stat(filePath: string): Promise<native.FileStatInfo>;

      /**
			 * Recursively deletes a directory or file.
			 * @param {string} filePath The (unix style) path to the file or directory.
			 * @returns {Promise<null>} A promise containing null if the operation was succesfull.
			 */
			unlink(filePath: string): Promise<null>;

      /**
			 * Download a file from a url.
			 * @param {DownloadOptions} options The options of the download.
			 * @returns {Promise<DownloadJob>} promise with a DownloadJob object containing the status of the download.
			 */
			downloadFile(options: native.DownloadOptions): Promise<native.DownloadResult>;

      /**
			 * Cancels a download job.
			 * @param {number} jobId The id of the download job.
			 */
			stopDownload(jobId: number): void;

      /**
			 * Retrieve the info of the file system.
			 * @returns {Promise<FileSystemInfo>} A promise with a FileSystemInfo object containing the statistics of the underlying filesystem.
			 */
			getFSInfo(): Promise<native.FileSystemInfo>;
    }
  }
}