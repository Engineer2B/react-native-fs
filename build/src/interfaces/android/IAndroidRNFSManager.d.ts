import { IFilePathInfo } from '../native/IFilePathInfo';
import { IFileSystemInfo } from '../native/IFileSystemInfo';
declare module 'react-native' {
    namespace NativeModules {
        interface IAndroidRNFSManager extends IRNFSManager {
            RNFSDocumentDirectory: string;
            RNFSPicturesDirectoryPath: string;
            /**
             * Read the assets of a file.
             * TODO: clarify what assets are.
             * @param {string} filePath The path to the file.
             * @returns {Promise<string>} A promise that will contain the
             * file's assets in base64 encoding.
             */
            readFileAssets(filePath: string): Promise<string>;
            /**
             * Read the assests of a directory.
             * TODO: clarify what assets are.
             * @param {string} directory The path to the directory.
             * @returns {Promise<FilePathInfo[]>} A promise with a list of FilePathInfo objects.
             */
            readDirAssets(directory: string): Promise<IFilePathInfo[]>;
            /**
             * Copy the assets of a file.
             * TODO: clarify what assets are.
             * @param {string} assetPath The (unix style) path to the file.
             * @param {string} destination The destination path.
             * @returns {Promise<null>} A promise with the value null if the operation succeeded.
             */
            copyFileAssets(assetPath: string, destination: string): Promise<null>;
            /**
             * Checks if the given file path contains an asset.
             * TODO: clarify what assets are.
             * @param {string} filePath The (unix style) path to the file.
             * @returns {Promise<boolean>} A promise with the result.
             */
            existsAssets(filePath: string): Promise<boolean>;
            /**
             * Retrieve the info of the file system at path.
             * @param {string} filePath The (unix style) path to the file or directory.
             * @returns {Promise<FileSystemInfo>} A promise with a FileSystemInfo object containing the statistics of the underlying filesystem.
             */
            getFSInfo(filePath?: string): Promise<IFileSystemInfo>;
        }
    }
}
