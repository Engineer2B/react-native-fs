import { NativeModules, NativeAppEventEmitter } from 'react-native';
import { FileSystem } from './FileSystem';
export class FileSystemiOS extends FileSystem implements rnfs.IFileSystem {
  LibraryDirectoryPath: string;
  MainBundlePath: string;

  protected RNFSManager: NativeModules.IiOSRNFSManager;

  constructor() {
    super();
    this.MainBundlePath = this.RNFSManager.RNFSMainBundlePath;
    this.LibraryDirectoryPath = this.RNFSManager.RNFSLibraryDirectoryPath;
  }

  mkdir(dirPath: string, options: native.iOS.DirectoryOptions = {}): Promise<void> {
    return this.RNFSManager.mkdir(dirPath, options);
  }

  pathForBundle(bundleName: string): Promise<string> {
    return this.RNFSManager.pathForBundle(bundleName);
  }

  stopUpload(jobId: number): void {
    this.RNFSManager.stopUpload(jobId);
  }

  uploadFiles(options: native.iOS.UploadOptions,
    uploadBeginCbFn?: (result: native.iOS.UploadBegin) => void,
    uploadProgressCbFn?: (result: native.iOS.UploadProgress) => void
  ): native.JobTicket<native.iOS.UploadResult> {
    if (!this.RNFSManager.uploadFiles) {
      return {
        jobId: -1,
        promise: Promise.reject(new Error('`uploadFiles` is not supported on this platform'))
      };
    }

    const jobId = this.jobId;
    const subscriptions: React.EmitterSubscription[] = [];

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