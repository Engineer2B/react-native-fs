/**
 * iOS specific directory options.
 */
export interface IDirectoryOptions {
    /**
     * Determines whether the resource is excluded from all backups of app data, returned as a Boolean NSNumber object (read-write).
     * You can use this property to exclude cache and other app support files which are not needed in a backup.
     * Some operations commonly made to user documents cause this property to be reset to false; consequently, do not use this property on user documents.
     */
    NSURLIsExcludedFromBackupKey?: boolean;
}
