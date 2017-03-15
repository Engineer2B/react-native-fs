import * as ReactNativeFS from "react-native-fs";

export = ReactNativeFS;

declare module "react-native-fs" {
	export interface FileSystem extends rnfs.IFileSystem {

	}
}