import { NativeModules } from 'react-native';
import { FileSystem } from './FileSystem';
import { EncodingEnum } from './EncodingEnum';
import { IFileSystemAndroid } from './interfaces/rnfs/IAndroidFileSystem';
import { IFileSystemInfo } from './interfaces/native/IFileSystemInfo';
import { IFilePathInfo } from './interfaces/native/IFilePathInfo';
export declare class FileSystemAndroid extends FileSystem implements IFileSystemAndroid {
    DocumentDirectory: string;
    PicturesDirectoryPath: string;
    protected RNFSManager: NativeModules.IAndroidRNFSManager;
    constructor();
    getFSInfo(filePath?: string): Promise<IFileSystemInfo>;
    readDirAssets(dirPath: string): Promise<IFilePathInfo[]>;
    existsAssets(filePath: string): Promise<boolean>;
    readFileAssets(filePath: string, encoding?: EncodingEnum): Promise<string>;
    copyFileAssets(filePath: string, destPath: string): Promise<null>;
}
