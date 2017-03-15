/**
 * TypeScript representation of a filesystem object.
 */
export interface IFileSystemInfo {
  /**
   * The total disk space.
   */
  totalSpace: number;
  /**
   * The total free space.
   */
  freeSpace: number;
}