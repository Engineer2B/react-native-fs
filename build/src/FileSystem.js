import { NativeModules, NativeAppEventEmitter } from 'react-native';
import * as base64 from 'base-64';
import * as utf8 from 'utf8';
import { Check } from './Check';
import { FileStatInfo } from './FileStatInfo';
import { EncodingEnum } from './EncodingEnum';
export class FileSystem {
    constructor() {
        this._jobId = -1;
        this.RNFSManager = NativeModules.RNFSManager;
        this.CachesDirectoryPath = this.RNFSManager.RNFSCachesDirectoryPath;
        this.DocumentDirectoryPath = this.RNFSManager.RNFSDocumentDirectoryPath;
        this.ExternalDirectoryPath = this.RNFSManager.RNFSExternalDirectoryPath;
        this.ExternalStorageDirectoryPath = this.RNFSManager.RNFSExternalStorageDirectoryPath;
    }
    get jobId() {
        this._jobId++;
        return this._jobId;
    }
    /**
     * Normalizes, i.e. removes "file:///" from a file path string.
     * @param {string} path The input path.
     * @returns {string} The normalized input path.
     */
    static normalizeFilePath(path) {
        return path.startsWith('file://') ? path.slice(7) : path;
    }
    /**
      * Decode the given base64 string.
      * @param {string} base64String A string encoded with base64 encoding.
      * @param {EncodingEnum} targetEncoding An encoding to which the string
      * is converted.
      * @returns {string} The converted string.
      */
    static decodeString(base64String, targetEncoding) {
        switch (targetEncoding) {
            case EncodingEnum.ascii:
                return base64.decode(base64String);
            case EncodingEnum.base64:
                return base64String;
            case EncodingEnum.utf8:
                return utf8.decode(base64.decode(base64String));
            default:
                return Check.assertUnreachable(targetEncoding);
        }
    }
    /**
     * Encode the given string, giving it a base64 encoding plus an internal content encoding.
     * @param {string} input The input string.
     * @param {EncodingEnum} contentEncoding The encoding of the content.
     * @returns {string} The converted string.
     */
    static encodeString(input, contentEncoding) {
        switch (contentEncoding) {
            case EncodingEnum.ascii:
                return base64.encode(input);
            case EncodingEnum.base64:
                return input;
            case EncodingEnum.utf8:
                return base64.encode(utf8.encode(input));
            default:
                return Check.assertUnreachable(contentEncoding);
        }
    }
    readDir(dirPath) {
        return this.RNFSManager.readDir(dirPath);
    }
    readdir(dirpath) {
        return this.RNFSManager.readDir(FileSystem.normalizeFilePath(dirpath))
            .then(files => {
            return files.map(file => file.name);
        });
    }
    mkdir(dirPath) {
        return this.RNFSManager.mkdir(FileSystem.normalizeFilePath(dirPath));
    }
    moveFile(inputPath, destPath) {
        return this.RNFSManager.moveFile(FileSystem.normalizeFilePath(inputPath), FileSystem.normalizeFilePath(destPath));
    }
    writeFile(filePath, contents, targetEncoding) {
        return this.RNFSManager.writeFile(FileSystem.normalizeFilePath(filePath), FileSystem.encodeString(contents, targetEncoding));
    }
    appendFile(filePath, contents, targetEncoding) {
        return this.RNFSManager.appendFile(FileSystem.normalizeFilePath(filePath), FileSystem.encodeString(contents, targetEncoding));
    }
    exists(path) {
        return this.RNFSManager.exists(FileSystem.normalizeFilePath(path));
    }
    readFile(filePath, encoding = EncodingEnum.utf8) {
        return this.RNFSManager.readFile(filePath)
            .then((base64Content) => FileSystem.decodeString(base64Content, encoding));
    }
    hash(filepath, algorithm) {
        return this.RNFSManager.hash(filepath, algorithm);
    }
    copyFile(inputPath, destPath) {
        return this.RNFSManager.copyFile(FileSystem.normalizeFilePath(inputPath), FileSystem.normalizeFilePath(destPath));
    }
    stat(filePath) {
        return this.RNFSManager.stat(FileSystem.normalizeFilePath(filePath))
            .then(FileStatInfo.FromNativeFileStatInfo);
    }
    unlink(path) {
        return this.RNFSManager.unlink(FileSystem.normalizeFilePath(path));
    }
    downloadFile(options, downloadBeginCbFn, downloadProgressCbFn) {
        const jobId = this.jobId;
        const subscriptions = [];
        if (downloadBeginCbFn) {
            subscriptions.push(NativeAppEventEmitter.addListener(`DownloadBegin-${jobId}`, downloadBeginCbFn));
        }
        if (downloadProgressCbFn) {
            subscriptions.push(NativeAppEventEmitter.addListener(`DownloadProgress-${jobId}`, downloadProgressCbFn));
        }
        const bridgeOptions = {
            jobId,
            fromUrl: options.fromUrl,
            toFile: FileSystem.normalizeFilePath(options.toFile),
            headers: options.headers || {},
            // background: !!options.background,
            progressDivider: options.progressDivider || 0
        };
        return {
            jobId,
            promise: this.RNFSManager.downloadFile(bridgeOptions)
                .then(res => {
                subscriptions.forEach(sub => sub.remove());
                return res;
            })
        };
    }
    stopDownload(jobId) {
        this.RNFSManager.stopDownload(jobId);
    }
    getFSInfo() {
        return this.RNFSManager.getFSInfo();
    }
}
