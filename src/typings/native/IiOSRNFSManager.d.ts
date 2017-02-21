import { NativeModules } from 'react-native';
declare module "react-native" {
  namespace NativeModules {
    export interface IiOSRNFSManager extends IRNFSManager {
      RNFSMainBundlePath: string;
      RNFSLibraryDirectoryPath: string;

      /**
       * Retrieve the path of a given bundle.
       * @param {string} bundledName The name of a bundle.
       * @returns {Promise<string>} The bundle's path.
       */
      pathForBundle(bundledName: string): Promise<string>;

      /**
       * Upload files.
       * @param {native.iOS.UploadOptions} options The options of the upload.
       * @returns {JobTicket<native.iOS.UploadResult>} The jobId and an uploadresult wrapped in a promise.
       */
      uploadFiles(options: native.iOS.UploadOptions): Promise<native.iOS.UploadResult>;

      /**
       * Stop an upload job.
       * @param {number} jobId The identifier of the upload job.
       */
      stopUpload(jobId: number): void;

      /**
       * Create a directory.
       * @param {string} filePath The (unix style) path to the directory.
       * @param {DirectoryOptions} options Options for this directory.
       * @returns {Promise<null>} A promise containing null if the operation was succesfull.
       */
      mkdir(filePath: string, options?: native.iOS.DirectoryOptions): Promise<null>;
    }
  }
}