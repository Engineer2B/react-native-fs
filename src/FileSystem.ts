import { NativeModules, NativeAppEventEmitter } from 'react-native';
import * as base64 from 'base-64';
import * as utf8 from 'utf8';
import { Check } from './Check';
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

export class FileSystem implements IFileSystem {
  CachesDirectoryPath: string;
  DocumentDirectoryPath: string;
  ExternalDirectoryPath: string;
  ExternalStorageDirectoryPath: string;

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
  protected static decodeString(base64String: string, targetEncoding: EncodingEnum): string {
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
  protected static encodeString(input: string, contentEncoding: EncodingEnum): string {
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

  readDir(dirPath: string): Promise<IFilePathInfo[]> {
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

  writeFile(filePath: string, contents: string, targetEncoding: EncodingEnum): Promise<null | { filePath: string, exception: Error }> {
    return this.RNFSManager.writeFile(
      FileSystem.normalizeFilePath(filePath),
      FileSystem.encodeString(contents, targetEncoding));
  }

  appendFile(filePath: string, contents: string, targetEncoding: EncodingEnum): Promise<null> {
    return this.RNFSManager.appendFile(
      FileSystem.normalizeFilePath(filePath),
      FileSystem.encodeString(contents, targetEncoding));
  }

  exists(path: string): Promise<boolean> {
    return this.RNFSManager.exists(FileSystem.normalizeFilePath(path));
  }

  readFile(filePath: string, encoding: EncodingEnum = (EncodingEnum.utf8 as any as EncodingEnum)): Promise<string> {
    return this.RNFSManager.readFile(filePath)
      .then((base64Content: string) => FileSystem.decodeString(base64Content, encoding));
  }

  hash(filepath: string, algorithm: HashAlgorithm): Promise<string> {
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

  downloadFile(options: IDownloadOptions,
    downloadBeginCbFn?: (result: IDownloadBegin) => void,
    downloadProgressCbFn?: (result: IDownloadProgress) => void): IJobTicket<IDownloadResult> {
    const jobId = this.jobId;
    const subscriptions: React.EmitterSubscription[] = [];

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

  stopDownload(jobId: number): void {
    this.RNFSManager.stopDownload(jobId);
  }

  getFSInfo(): Promise<IFileSystemInfo> {
    return this.RNFSManager.getFSInfo();
  }
}