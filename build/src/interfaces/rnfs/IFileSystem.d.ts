import { HashAlgorithm } from '../native/FileSystemTypes';
import { EncodingEnum } from '../../EncodingEnum';
import { IFilePathInfo } from '../native/IFilePathInfo';
import { IFileStatInfo } from './IFileStatInfo';
import { IDownloadOptions } from '../native/IDownloadOptions';
import { IDownloadBegin } from '../native/IDownloadBegin';
import { IDownloadProgress } from '../native/IDownloadProgress';
import { IJobTicket } from '../native/IJobTicket';
import { IDownloadResult } from '../native/IDownloadResult';
/**
 * An interface for methods and properties that are common to all file systems.
 */
export interface IFileSystem {
    CachesDirectoryPath: string;
    DocumentDirectoryPath: string;
    ExternalDirectoryPath: string;
    ExternalStorageDirectoryPath: string;
    TemporaryDirectoryPath: string;
    /**
     * Read the contents of a directory.
     * @param {string} dirPath The path to the directory.
     * @returns {Promise} A promise with a list of FilePathInfo objects.
     */
    readDir(dirPath: string): Promise<IFilePathInfo[]>;
    /**
     * Node style version (lowercase d).
     * Returns just the names.
     * @param {string} dirpath The path that is to read.
     * @returns {Promise<string[]>} Just the names of the files in the directory.
     */
    readdir(dirpath: string): Promise<string[]>;
    /**
     * Create a new directory.
     * @param {string} dirPath The path to the directory.
     * @returns {Promise<void>} A promise indicating if the directory was successfuly created.
     */
    mkdir(dirPath: string): Promise<void>;
    /**
     * Move a file from an input file path to a destination path.
     * Note: can be used to move directories.
     * @param {string} inputPath The input file path.
     * @param {string} destPath The destination file path.
     * @returns {Promise<boolean>} A promise with a boolean indicating if the move was succesfully performed.
     */
    moveFile(filepath: string, destPath: string): Promise<boolean>;
    /**
     * Write content to a file.
     * @param {string} filePath The (unix style) path to the file.
     * @param {string} contents A string that will be written to the file.
     * @param {EncodingEnum=} [targetEncoding=UTF8] The targeted encoding of the contents.
     * @returns {(Promise<null | { filePath: string, exception: Error }>)} A promise with the result.
     */
    writeFile(filePath: string, contents: string, targetEncoding?: EncodingEnum): Promise<null | {
        filePath: string;
        exception: Error;
    }>;
    /**
     * Append content to a file.
     * @param {string} filePath The (unix style) path to the file.
     * @param {string} contents A string that will be written to the file.
     * @param {EncodingEnum=} targetEncoding The encoding of the string.
     * @returns {Promise} A promise which will be null upon success.
     */
    appendFile(filePath: string, contents: string, targetEncoding?: EncodingEnum): Promise<void>;
    /**
     * Check if a file or path exists.
     * @param {string} path The (unix style) path to the file.
     * @returns {Promise<boolean>} A promise with the result.
     */
    exists(path: string): Promise<boolean>;
    /**
     * Read the contents of a file.
     * @param {string} filePath The (unix style) path to the file.
     * @param {EncodingEnum} encoding The encoding of the content.
     * @returns {Promise<string>} A promise with the contents of the file.
     */
    readFile(filePath: string, encoding?: EncodingEnum): Promise<string>;
    /**
     * Calculate the hash of the file.
     * @param {string} filePath The (unix style) path to the file.
     * @param {HashAlgorithm} algorithm The algorithm that is used to determine the hash value of the file.
     * @returns {Promise<string>} A promise with the hex string of the hash of the file.
     */
    hash(filePath: string, algorithm: HashAlgorithm): Promise<string>;
    /**
     * Copy a file from an input path to a destination path.
     * @param {string} inputPath The input file path.
     * @param {string} destPath The destination file path.
     * @returns {Promise<null>} A promise with a value of null if the copy action was succesfully performed.
     */
    copyFile(inputPath: string, destPath: string): Promise<null>;
    /**
     * Returns some stats of a given file path.
     * @param {string} filePath The (unix style) path to the file.
     * @returns {Promise<FileStatInfo>} A promise containing the stats of the file.
     */
    stat(filePath: string): Promise<IFileStatInfo>;
    /**
     * Recursively deletes a directory or file.
     * @param {string} path The (unix style) path to the file or directory.
     * @returns {Promise<null>} A promise containing null if the operation was succesfull.
     */
    unlink(path: string): Promise<null>;
    /**
     * Download a file from a url.
     * @param {DownloadOptions} options The options of the download.
     * @param {Function=} downloadBeginCbFn A callback function that gets called when the download has begun.
     * @param {Function=} downloadProgressCbFn A callback function that gets called upon each buffer read.
     * @returns {DownloadResult} An object with information pertaining to the download.
     */
    downloadFile(options: IDownloadOptions, downloadBeginCbFn?: (result: IDownloadBegin) => void, downloadProgressCbFn?: (result: IDownloadProgress) => void): IJobTicket<IDownloadResult>;
    /**
     * Stop a download job.
     * @param {number} jobId The id of the download job.
     */
    stopDownload(jobId: number): void;
}
