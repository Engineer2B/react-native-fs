import { FileSystem } from './FileSystem';
import { EncodingEnum } from './EncodingEnum';
export class FileSystemAndroid extends FileSystem {
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
    getFSInfo(filePath = this.DocumentDirectory) {
        return this.RNFSManager.getFSInfo(filePath);
    }
    // Android-only
    readDirAssets(dirPath) {
        if (!this.RNFSManager.readDirAssets) {
            throw new Error('readDirAssets is not available on this platform');
        }
        return this.RNFSManager.readDirAssets(dirPath);
    }
    // Android-only
    existsAssets(filePath) {
        if (!this.RNFSManager.existsAssets) {
            throw new Error('existsAssets is not available on this platform');
        }
        return this.RNFSManager.existsAssets(filePath);
    }
    // * Android only
    readFileAssets(filePath, encoding = EncodingEnum.utf8) {
        if (!this.RNFSManager.readFileAssets) {
            throw new Error('readFileAssets is not available on this platform');
        }
        return this.RNFSManager.readFileAssets(filePath)
            .then((base64Content) => FileSystem.decodeString(base64Content, encoding));
    }
    // * Android only
    copyFileAssets(filePath, destPath) {
        if (!this.RNFSManager.copyFileAssets) {
            throw new Error('copyFileAssets is not available on this platform');
        }
        return this.RNFSManager.copyFileAssets(FileSystemAndroid.normalizeFilePath(filePath), FileSystemAndroid.normalizeFilePath(destPath));
    }
}
