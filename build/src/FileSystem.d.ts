import { NativeModules } from 'react-native';
import { FileStatInfo } from './FileStatInfo';
import { EncodingEnum } from './EncodingEnum';
import { IFileSystem } from './interfaces/rnfs/IFileSystem';
import { IFilePathInfo } from './interfaces/native/IFilePathInfo';
import { HashAlgorithm } from './interfaces/native/FileSystemTypes';
import { IDownloadOptions } from './interfaces/native/IDownloadOptions';
import { IDownloadBegin } from './interfaces/native/IDownloadBegin';
import { IDownloadProgress } from './interfaces/native/IDownloadProgress';
import { IJobTicket } from './interfaces/native/IJobTicket';
import { IDownloadResult } from './interfaces/native/IDownloadResult';
import { IFileSystemInfo } from './interfaces/native/IFileSystemInfo';
export declare class FileSystem implements IFileSystem {
    CachesDirectoryPath: string;
    DocumentDirectoryPath: string;
    ExternalDirectoryPath: string;
    ExternalStorageDirectoryPath: string;
    TemporaryDirectoryPath: string;
    protected RNFSManager: NativeModules.IiOSRNFSManager | NativeModules.IAndroidRNFSManager;
    private _jobId;
    protected readonly jobId: number;
    constructor();
    /**
     * Normalizes, i.e. removes "file:///" from a file path string.
     * @param {string} path The input path.
     * @returns {string} The normalized input path.
     */
    static normalizeFilePath(path: string): string;
    /**
      * Decode the given base64 string.
      * @param {string} base64String A string encoded with base64 encoding.
      * @param {EncodingEnum} targetEncoding An encoding to which the string
      * is converted.
      * @returns {string} The converted string.
      */
    protected static decodeString(base64String: string, targetEncoding: EncodingEnum): string;
    /**
     * Encode the given string, giving it a base64 encoding plus an internal content encoding.
     * @param {string} input The input string.
     * @param {EncodingEnum} contentEncoding The encoding of the content.
     * @returns {string} The converted string.
     */
    protected static encodeString(input: string, contentEncoding: EncodingEnum): string;
    readDir(dirPath: string): Promise<IFilePathInfo[]>;
    readdir(dirpath: string): Promise<string[]>;
    mkdir(dirPath: string): Promise<void>;
    moveFile(inputPath: string, destPath: string): Promise<boolean>;
    writeFile(filePath: string, contents: string, targetEncoding: EncodingEnum): Promise<null | {
        filePath: string;
        exception: Error;
    }>;
    appendFile(filePath: string, contents: string, targetEncoding: EncodingEnum): Promise<null>;
    exists(path: string): Promise<boolean>;
    readFile(filePath: string, encoding?: EncodingEnum): Promise<string>;
    hash(filepath: string, algorithm: HashAlgorithm): Promise<string>;
    copyFile(inputPath: string, destPath: string): Promise<null>;
    stat(filePath: string): Promise<FileStatInfo>;
    unlink(path: string): Promise<null>;
    downloadFile(options: IDownloadOptions, downloadBeginCbFn?: (result: IDownloadBegin) => void, downloadProgressCbFn?: (result: IDownloadProgress) => void): IJobTicket<IDownloadResult>;
    stopDownload(jobId: number): void;
    getFSInfo(): Promise<IFileSystemInfo>;
}
