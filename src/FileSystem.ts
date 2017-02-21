import { NativeModules, NativeAppEventEmitter } from 'react-native';
import * as base64 from 'base-64';
import * as utf8 from 'utf8';
import * as rnfsEnum from './EncodingEnum';
import { Check } from './Check';
import { FileStatInfo } from './FileStatInfo';
import { EncodingEnum } from './EncodingEnum';

export class FileSystem implements rnfs.IFileSystem {
  CachesDirectoryPath: string;
  DocumentDirectoryPath: string;
  ExternalDirectoryPath: string;
  ExternalStorageDirectoryPath: string;
  TemporaryDirectoryPath: string;

  protected RNFSManager: NativeModules.IiOSRNFSManager | NativeModules.IAndroidRNFSManager;

  private _jobId = -1;
  protected get jobId(): number {
    this._jobId++;
    return this._jobId;
  }

  constructor() {
    this.RNFSManager = NativeModules.RNFSManager;
    this.CachesDirectoryPath = this.RNFSManager.RNFSCachesDirectoryPath;
    this.DocumentDirectoryPath = this.RNFSManager.RNFSDocumentDirectoryPath;
    this.ExternalDirectoryPath = this.RNFSManager.RNFSExternalDirectoryPath;
    this.ExternalStorageDirectoryPath = this.RNFSManager.RNFSExternalStorageDirectoryPath;
    this.TemporaryDirectoryPath = this.RNFSManager.RNFSTemporaryDirectoryPath;
  }

  /**
   * Normalizes, i.e. removes "file:///" from a file path string.
   * @param {string} path The input path.
   * @returns {string} The normalized input path.
   */
  static normalizeFilePath(path: string): string {
    return path.startsWith('file://') ? path.slice(7) : path;
  }

  /**
    * Decode the given base64 string.
    * @param {string} base64String A string encoded with base64 encoding.
    * @param {EncodingEnum} targetEncoding An encoding to which the string
    * is converted.
    * @returns {string} The converted string.
    */
  protected static decodeString(base64String: string, targetEncoding: rnfs.EncodingEnum): string {
    switch (targetEncoding) {
      case rnfs.EncodingEnum.ascii:
        return base64.decode(base64String);
      case rnfs.EncodingEnum.base64:
        return base64String;
      case rnfs.EncodingEnum.utf8:
        return utf8.decode(base64.decode(base64String));
    }
    return Check.assertUnreachable(targetEncoding);
  }

  /**
   * Encode the given string, giving it a base64 encoding plus an internal content encoding.
   * @param {string} input The input string.
   * @param {EncodingEnum} contentEncoding The encoding of the content.
   * @returns {string} The converted string.
   */
  protected static encodeString(input: string, contentEncoding: rnfs.EncodingEnum): string {
    switch (contentEncoding) {
      case rnfs.EncodingEnum.ascii:
        return base64.encode(input);
      case rnfs.EncodingEnum.base64:
        return input;
      case rnfs.EncodingEnum.utf8:
        return base64.encode(utf8.encode(input));
    }
    return Check.assertUnreachable(contentEncoding);
  }

  readDir(dirPath: string): Promise<native.FilePathInfo[]> {
    return this.RNFSManager.readDir(dirPath);
  }

  readdir(dirpath: string): Promise<string[]> {
    return this.RNFSManager.readDir(FileSystem.normalizeFilePath(dirpath))
      .then(files => {
        return files.map(file => file.name);
      });
  }

  mkdir(dirPath: string): Promise<void> {
    return this.RNFSManager.mkdir(FileSystem.normalizeFilePath(dirPath));
  }

  moveFile(inputPath: string, destPath: string): Promise<boolean> {
    return this.RNFSManager.moveFile(FileSystem.normalizeFilePath(inputPath), FileSystem.normalizeFilePath(destPath));
  }

  writeFile(filePath: string, contents: string, targetEncoding: rnfs.EncodingEnum): Promise<null | { filePath: string, exception: Error }> {
    return this.RNFSManager.writeFile(
      FileSystem.normalizeFilePath(filePath),
      FileSystem.encodeString(contents, targetEncoding));
  }

  appendFile(filePath: string, contents: string, targetEncoding: rnfs.EncodingEnum): Promise<null> {
    return this.RNFSManager.appendFile(
      FileSystem.normalizeFilePath(filePath),
      FileSystem.encodeString(contents, targetEncoding));
  }

  exists(path: string): Promise<boolean> {
    return this.RNFSManager.exists(FileSystem.normalizeFilePath(path));
  }

  readFile(filePath: string, encoding: rnfs.EncodingEnum = (EncodingEnum.utf8 as any as rnfs.EncodingEnum)): Promise<string> {
    return this.RNFSManager.readFile(filePath)
      .then((base64Content: string) => FileSystem.decodeString(base64Content, encoding));
  }

  hash(filepath: string, algorithm: native.HashAlgorithm): Promise<string> {
    return this.RNFSManager.hash(filepath, algorithm);
  }

  copyFile(inputPath: string, destPath: string): Promise<null> {
    return this.RNFSManager.copyFile(FileSystem.normalizeFilePath(inputPath), FileSystem.normalizeFilePath(destPath));
  }

  stat(filePath: string): Promise<FileStatInfo> {
    return this.RNFSManager.stat(FileSystem.normalizeFilePath(filePath))
      .then(FileStatInfo.FromNativeFileStatInfo);
  }

  unlink(path: string): Promise<null> {
    return this.RNFSManager.unlink(FileSystem.normalizeFilePath(path));
  }

    downloadFile(options: native.DownloadOptions,
  downloadBeginCbFn?: (result: native.DownloadBegin) => void,
  downloadProgressCbFn?: (result: native.DownloadProgress) => void): native.JobTicket<native.DownloadResult> {
    let jobId = this.jobId;
    let subscriptions: React.EmitterSubscription[] = [];

    if (downloadBeginCbFn) {
      subscriptions.push(NativeAppEventEmitter.addListener(`DownloadBegin-${jobId}`, downloadBeginCbFn));
    }

    if (downloadProgressCbFn) {
      subscriptions.push(NativeAppEventEmitter.addListener(`DownloadProgress-${jobId}`, downloadProgressCbFn));
    }

    let bridgeOptions = {
      jobId: jobId,
      fromUrl: options.fromUrl,
      toFile: FileSystem.normalizeFilePath(options.toFile),
      headers: options.headers || {},
      // background: !!options.background,
      progressDivider: options.progressDivider || 0
    };

    return {
      jobId: jobId,
      promise: this.RNFSManager.downloadFile(bridgeOptions)
      .then(res => {
        subscriptions.forEach(sub => sub.remove());
        return res;
      })
    };
  }

  stopDownload(jobId: number): void {
    this.RNFSManager.stopDownload(jobId);
  }

  getFSInfo(): Promise<native.FileSystemInfo> {
    return this.RNFSManager.getFSInfo();
  }
}