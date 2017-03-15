export class FileStatInfo {
    constructor(size, isDirectory, parent, modifiedTime) {
        this.size = size;
        this.isDirectory = isDirectory;
        this.parent = parent;
        this.modifiedTime = modifiedTime;
    }
    /**
    * The length, in bytes, of the file denoted by this abstract pathname,
    * or 0L if the file does not exist.
    * Some operating systems may return 0L for pathnames denoting
    * system-dependent entities such as devices or pipes.
    */
    get Size() {
        return this.size;
    }
    /**
     * Is true if the file exists and is marked as a directory, is false otherwise.
     */
    get IsDirectory() {
        return this.isDirectory;
    }
    /**
     * The pathname string of the parent directory named by
     * this abstract pathname, or null if this pathname does not name a parent
     */
    get Parent() {
        return this.parent;
    }
    /**
     * A value representing the time the file was last modified,
     * measured in milliseconds since the epoch (00:00:00 GMT, January 1, 1970),
     * or 0L if the file does not exist or if an I/O error occurs
     */
    get ModifiedTime() {
        return this.modifiedTime;
    }
    static FromNativeFileStatInfo(input) {
        return new FileStatInfo(input.size, input.isdirectory === 1, input.parent, new Date(input.mtime * 1000));
    }
}
