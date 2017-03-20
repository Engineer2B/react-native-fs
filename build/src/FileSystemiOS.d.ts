import { NativeModules } from 'react-native';
import { FileSystem } from './FileSystem';
import { IUploadProgress } from './interfaces/iOS/IUploadProgress';
import { IUploadOptions } from './interfaces/iOS/IUploadOptions';
import { IUploadBegin } from './interfaces/iOS/IUploadBegin';
import { IUploadResult } from './interfaces/iOS/IUploadResult';
import { IDirectoryOptions } from './interfaces/iOS/IDirectoryOptions';
import { IJobTicket } from './interfaces/native/IJobTicket';
import { IFileSystemiOS } from './interfaces/rnfs/IFileSystemiOS';
export declare class FileSystemiOS extends FileSystem implements IFileSystemiOS {
    LibraryDirectoryPath: string;
    MainBundlePath: string;
    TemporaryDirectoryPath: string;
    protected RNFSManager: NativeModules.IiOSRNFSManager;
    constructor();
    mkdir(dirPath: string, options?: IDirectoryOptions): Promise<void>;
    pathForBundle(bundleName: string): Promise<string>;
    stopUpload(jobId: number): void;
    uploadFiles(options: IUploadOptions, uploadBeginCbFn?: (result: IUploadBegin) => void, uploadProgressCbFn?: (result: IUploadProgress) => void): IJobTicket<IUploadResult>;
}
