import { EncodingEnum } from '../../EncodingEnum';
import { IFileSystem } from './IFileSystem';
import { IFileSystemInfo } from '../native/IFileSystemInfo';
import { IFilePathInfo } from '../native/IFilePathInfo';
/**
 * An interface for android only file system methods and properties only.
 */
export interface IFileSystemAndroid extends IFileSystem {
    PicturesDirectoryPath: string;
    DocumentDirectory: string;
    AlarmsDirectory: string;
    DCIMDirectory: string;
    DownloadsDirectory: string;
    MoviesDirectory: string;
    MusicDirectory: string;
    NotificationsDirectory: string;
    PodcastsDirectory: string;
    RingtonesDirectory: string;
    /**
     * Retrieve the info of the file system that contains the given path.
     * @param {string=} filePath The (unix style) path to the file or directory. Will investigate the document directory by default.
     * @returns {Promise<androidRNFS.FileSystemInfo>} A promise with the file system's information.
     */
    getFSInfo(path?: string): Promise<IFileSystemInfo>;
    /**
     * The Android resource system keeps track of all non-code assets
     * associated with an application.
     * You can use this method to access your application's resources.
     * @param {string} filePath The path to the file.
     * @param {EncodingEnum} encoding The encoding of the asset.
     * @returns {Promise<string>} The contents of the asset.
     */
    readFileAssets(filePath: string, encoding: EncodingEnum): Promise<string>;
    /**
     * Read the assets fo a directory.
     * @param {string} dirPath The path to the directory;
     * @returns {Promise<FilePathInfo[]>} The assets of the given path wrapped in a promise.
     */
    readDirAssets(dirPath: string): Promise<IFilePathInfo[]>;
    /**
     * Copy the assets of a file.
     * TODO: clarify what assets are.
     * @param {string} filePath The (unix style) path to the file.
     * @param {string} destination The destination path.
     * @returns {Promise<null>} A promise with the value null if the operation succeeded.
    */
    copyFileAssets(filePath: string, destPath: string): Promise<null>;
    /**
     * Checks if the given file path contains an asset.
     * @param {string} filePath The (unix style) path to the file.
     * @returns {Promise<boolean>} The result wrapped in a promise.
     */
    existsAssets(filePath: string): Promise<boolean>;
}
