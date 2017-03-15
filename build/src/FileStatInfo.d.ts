import * as rnfs from './interfaces/rnfs/IFileStatInfo';
import * as native from './interfaces/native/IFileStatInfo';
export declare class FileStatInfo implements rnfs.IFileStatInfo {
    private size;
    private isDirectory;
    private parent;
    private modifiedTime;
    /**
    * The length, in bytes, of the file denoted by this abstract pathname,
    * or 0L if the file does not exist.
    * Some operating systems may return 0L for pathnames denoting
    * system-dependent entities such as devices or pipes.
    */
    readonly Size: number;
    /**
     * Is true if the file exists and is marked as a directory, is false otherwise.
     */
    readonly IsDirectory: boolean;
    /**
     * The pathname string of the parent directory named by
     * this abstract pathname, or null if this pathname does not name a parent
     */
    readonly Parent: string;
    /**
     * A value representing the time the file was last modified,
     * measured in milliseconds since the epoch (00:00:00 GMT, January 1, 1970),
     * or 0L if the file does not exist or if an I/O error occurs
     */
    readonly ModifiedTime: Date;
    private constructor(size, isDirectory, parent, modifiedTime);
    static FromNativeFileStatInfo(input: native.IFileStatInfo): FileStatInfo;
}
