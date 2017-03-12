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
        this.TemporaryDirectoryPath = this.RNFSManager.RNFSTemporaryDirectoryPath;
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
            case rnfs.EncodingEnum.ascii:
                return base64.decode(base64String);
            case rnfs.EncodingEnum.base64:
                return base64String;
            case rnfs.EncodingEnum.utf8:
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
            case rnfs.EncodingEnum.ascii:
                return base64.encode(input);
            case rnfs.EncodingEnum.base64:
                return input;
            case rnfs.EncodingEnum.utf8:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZVN5c3RlbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWxlU3lzdGVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxhQUFhLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEUsT0FBTyxLQUFLLE1BQU0sTUFBTSxTQUFTLENBQUM7QUFDbEMsT0FBTyxLQUFLLElBQUksTUFBTSxNQUFNLENBQUM7QUFDN0IsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlDLE1BQU07SUFnQko7UUFQUSxXQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFRbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDO1FBQzdDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLHVCQUF1QixDQUFDO1FBQ3BFLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDO1FBQ3hFLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLHlCQUF5QixDQUFDO1FBQ3hFLElBQUksQ0FBQyw0QkFBNEIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGdDQUFnQyxDQUFDO1FBQ3RGLElBQUksQ0FBQyxzQkFBc0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLDBCQUEwQixDQUFDO0lBQzVFLENBQUM7SUFiRCxJQUFjLEtBQUs7UUFDakIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWQsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQVdEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsaUJBQWlCLENBQUMs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