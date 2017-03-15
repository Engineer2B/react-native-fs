import { IFileInfo } from './IFileInfo';
export interface IFilePathInfo extends IFileInfo {
  /**
  * The name of the file or directory denoted by this abstract pathname,
  * or the empty string if this pathname's name sequence is empty.
  */
  name: string;
  /**
  * The absolute pathname.
  */
  path: string;
}