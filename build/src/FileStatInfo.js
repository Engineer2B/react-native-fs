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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZVN0YXRJbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL0ZpbGVTdGF0SW5mby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxNQUFNO0lBa0NKLFlBQ1UsSUFBWSxFQUNaLFdBQW9CLEVBQ3BCLE1BQWMsRUFDZCxZQUFrQjtRQUhsQixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osZ0JBQVcsR0FBWCxXQUFXLENBQVM7UUFDcEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGlCQUFZLEdBQVosWUFBWSxDQUFNO0lBQzVCLENBQUM7SUF0Q0Q7Ozs7O01BS0U7SUFDRixJQUFJLElBQUk7UUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUNuQixDQUFDO0lBQ0Q7O09BRUc7SUFDSCxJQUFJLFdBQVc7UUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUMxQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxNQUFNO1FBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDckIsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxJQUFJLFlBQVk7UUFDZCxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBU0QsTUFBTSxDQUFDLHNCQUFzQixDQUFDLEtBQTJCO1FBQ3ZELE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FDckIsS0FBSyxDQUFDLElBQUksRUFDVixLQUFLLENBQUMsV0FBVyxLQUFLLENBQUMsRUFDdkIsS0FBSyxDQUFDLE1BQU0sRUFDWixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztDQUNGIn0=