import { NativeAppEventEmitter } from 'react-native';
import { FileSystem } from './FileSystem';
export class FileSystemiOS extends FileSystem {
    constructor() {
        super();
        this.MainBundlePath = this.RNFSManager.RNFSMainBundlePath;
        this.LibraryDirectoryPath = this.RNFSManager.RNFSLibraryDirectoryPath;
        this.TemporaryDirectoryPath = this.RNFSManager.RNFSTemporaryDirectoryPath;
    }
    mkdir(dirPath, options = {}) {
        return this.RNFSManager.mkdir(dirPath, options);
    }
    pathForBundle(bundleName) {
        return this.RNFSManager.pathForBundle(bundleName);
    }
    stopUpload(jobId) {
        this.RNFSManager.stopUpload(jobId);
    }
    uploadFiles(options, uploadBeginCbFn, uploadProgressCbFn) {
        if (!this.RNFSManager.uploadFiles) {
            return {
                jobId: -1,
                promise: Promise.reject(new Error('`uploadFiles` is not supported on this platform'))
            };
        }
        const jobId = this.jobId;
        const subscriptions = [];
        if (uploadBeginCbFn) {
            subscriptions.push(NativeAppEventEmitter.addListener('UploadBegin-' + jobId, uploadBeginCbFn));
        }
        if (uploadProgressCbFn) {
            subscriptions.push(NativeAppEventEmitter.addListener('UploadProgress-' + jobId, uploadProgressCbFn));
        }
        const bridgeOptions = {
            jobId,
            toUrl: options.toUrl,
            files: options.files,
            headers: options.headers || {},
            fields: options.fields || {},
            method: options.method || 'POST'
        };
        return {
            jobId,
            promise: this.RNFSManager.uploadFiles(bridgeOptions).then(res => {
                subscriptions.forEach(sub => sub.remove());
                return res;
            })
        };
    }
}
