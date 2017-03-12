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
        this.TemporaryDirectoryPath = this.RNFSManager.RNFSTemporaryDirectoryPath;
        this.PicturesDirectoryPath = this.RNFSManager.RNFSPicturesDirectoryPath;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZVN5c3RlbUFuZHJvaWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvRmlsZVN5c3RlbUFuZHJvaWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFOUMsTUFBTSx3QkFBeUIsU0FBUSxVQUFVO0lBTS9DO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUFDUixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyx1QkFBdUIsQ0FBQztRQUNwRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxxQkFBcUIsQ0FBQztRQUNoRSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsQ0FBQztRQUN4RSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsQ0FBQztRQUN4RSxJQUFJLENBQUMsNEJBQTRCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxnQ0FBZ0MsQ0FBQztRQUN0RixJQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQywwQkFBMEIsQ0FBQztRQUMxRSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsQ0FBQztJQUMxRSxDQUFDO0lBRUQsU0FBUyxDQUFDLFdBQW1CLElBQUksQ0FBQyxpQkFBaUI7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCxlQUFlO0lBQ2YsYUFBYSxDQUFDLE9BQWU7UUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELGVBQWU7SUFDZixZQUFZLENBQUMsUUFBZ0I7UUFDM0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELGlCQUFpQjtJQUNqQixjQUFjLENBQUMsUUFBZ0IsRUFBRSxXQUErQixZQUFZLENBQUMsSUFBa0M7UUFDN0csRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO1FBQ3RFLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDO2FBQy9DLElBQUksQ0FBQyxDQUFDLGFBQXFCLEtBQUssVUFBVSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNyRixDQUFDO0lBRUQsaUJBQWlCO0lBQ2pCLGNBQWMsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLE1BQU0sSUFBSSxLQUFLLENBQUMsa0RBQWtELENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdkksQ0FBQztDQUNGIn0=