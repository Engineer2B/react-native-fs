import { NativeModules } from 'react-native';
import { FileSystem } from './FileSystem';
import { EncodingEnum } from './EncodingEnum';
import { IFileSystemAndroid } from './interfaces/rnfs/IAndroidFileSystem';
import { IFileSystemInfo } from './interfaces/native/IFileSystemInfo';
import { IFilePathInfo } from './interfaces/native/IFilePathInfo';

export class FileSystemAndroid extends FileSystem implements IFileSystemAndroid {
  public AlarmsDirectory: string;
  public DCIMDirectory: string;
  public DownloadsDirectory: string;
  public MoviesDirectory: string;
  public MusicDirectory: string;
  public NotificationsDirectory: string;
  public PodcastsDirectory: string;
  public RingtonesDirectory: string;
  public DocumentDirectory: string;
  public PicturesDirectoryPath: string;

  protected RNFSManager: NativeModules.IAndroidRNFSManager;

  constructor() {
    super();
    this.CachesDirectoryPath = this.RNFSManager.RNFSCachesDirectoryPath;
    this.DocumentDirectory = this.RNFSManager.RNFSDocumentDirectory;
    this.DocumentDirectoryPath = this.RNFSManager.RNFSDocumentDirectoryPath;
    this.ExternalDirectoryPath = this.RNFSManager.RNFSExternalDirectoryPath;
    this.ExternalStorageDirectoryPath = this.RNFSManager.RNFSExternalStorageDirectoryPath;
    this.PicturesDirectoryPath = this.RNFSManager.RNFSPicturesDirectoryPath;
    this.AlarmsDirectory = this.RNFSManager.RNFSDirectoryAlarms;
    this.DCIMDirectory = this.RNFSManager.RNFSDirectoryDCIM;
    this.DownloadsDirectory = this.RNFSManager.RNFSDirectoryDownloads;
    this.MoviesDirectory = this.RNFSManager.RNFSDirectoryMovies;
    this.MusicDirectory = this.RNFSManager.RNFSDirectoryMusic;
    this.NotificationsDirectory = this.RNFSManager.RNFSDirectoryNotifications;
    this.PodcastsDirectory = this.RNFSManager.RNFSDirectoryPodcasts;
    this.RingtonesDirectory = this.RNFSManager.RNFSDirectoryRingtones;
  }

  getFSInfo(filePath: string = this.DocumentDirectory): Promise<IFileSystemInfo> {
    return this.RNFSManager.getFSInfo(filePath);
  }

  // Android-only
  readDirAssets(dirPath: string): Promise<IFilePathInfo[]> {
    if (!this.RNFSManager.readDirAssets) {
      throw new Error('readDirAssets is not available on this platform');
    }

    return this.RNFSManager.readDirAssets(dirPath);
  }

  // Android-only
  existsAssets(filePath: string): Promise<boolean> {
    if (!this.RNFSManager.existsAssets) {
      throw new Error('existsAssets is not available on this platform');
    }

    return this.RNFSManager.existsAssets(filePath);
  }

  // * Android only
  readFileAssets(filePath: string, encoding: EncodingEnum = (EncodingEnum.utf8 as any as EncodingEnum )): Promise<string> {
    if (!this.RNFSManager.readFileAssets) {
      throw new Error('readFileAssets is not available on this platform');
    }

    return this.RNFSManager.readFileAssets(filePath)
    .then((base64Content: string) => FileSystem.decodeString(base64Content, encoding));
  }

  // * Android only
  copyFileAssets(filePath: string, destPath: string): Promise<null> {
    if (!this.RNFSManager.copyFileAssets) {
      throw new Error('copyFileAssets is not available on this platform');
    }

    return this.RNFSManager.copyFileAssets(FileSystemAndroid.normalizeFilePath(filePath), FileSystemAndroid.normalizeFilePath(destPath));
  }
}