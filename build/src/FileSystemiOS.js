import { NativeAppEventEmitter } from 'react-native';
import { FileSystem } from './FileSystem';
export class FileSystemiOS extends FileSystem {
    constructor() {
        super();
        this.MainBundlePath = this.RNFSManager.RNFSMainBundlePath;
        this.LibraryDirectoryPath = this.RNFSManager.RNFSLibraryDirectoryPath;
    }
    mkdir(dirPath, options = {}) {
        return this.RNFSManager.mkdir(dirPath, options);
    }
    pathForBundle(bundleName) {
        return this.RNFSManager.pathForBundle(bundleName);
    }
    stopUpload(jobId) {
        this.RNFSManager.stopUpload(jobId);
    }
    uploadFiles(options, uploadBeginCbFn, uploadProgressCbFn) {
        if (!this.RNFSManager.uploadFiles) {
            return {
                jobId: -1,
                promise: Promise.reject(new Error('`uploadFiles` is not supported on this platform'))
            };
        }
        const jobId = this.jobId;
        const subscriptions = [];
        if (uploadBeginCbFn) {
            subscriptions.push(NativeAppEventEmitter.addListener('UploadBegin-' + jobId, uploadBeginCbFn));
        }
        if (uploadProgressCbFn) {
            subscriptions.push(NativeAppEventEmitter.addListener('UploadProgress-' + jobId, uploadProgressCbFn));
        }
        const bridgeOptions = {
            jobId,
            toUrl: options.toUrl,
            files: options.files,
            headers: options.headers || {},
            fields: options.fields || {},
            method: options.method || 'POST'
        };
        return {
            jobId,
            promise: this.RNFSManager.uploadFiles(bridgeOptions).then(res => {
                subscriptions.forEach(sub => sub.remove());
                return res;
            })
        };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRmlsZVN5c3RlbWlPUy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWxlU3lzdGVtaU9TLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBaUIscUJBQXFCLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxQyxNQUFNLG9CQUFxQixTQUFRLFVBQVU7SUFNM0M7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQUNSLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQztRQUMxRCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyx3QkFBd0IsQ0FBQztJQUN4RSxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQWUsRUFBRSxVQUF1QyxFQUFFO1FBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELGFBQWEsQ0FBQyxVQUFrQjtRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELFVBQVUsQ0FBQyxLQUFhO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBaUMsRUFDM0MsZUFBMEQsRUFDMUQsa0JBQWdFO1FBRWhFLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sQ0FBQztnQkFDTCxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNULE9BQU8sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7YUFDdEYsQ0FBQztRQUNKLENBQUM7UUFFRCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLE1BQU0sYUFBYSxHQUFnQyxFQUFFLENBQUM7UUFFdEQsRUFBRSxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNwQixhQUFhLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxjQUFjLEdBQUcsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFDakcsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUMsQ0FBQztZQUN2QixhQUFhLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFdBQVcsQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1FBQ3ZHLENBQUM7UUFFRCxNQUFNLGFBQWEsR0FBRztZQUNwQixLQUFLO1lBQ0wsS0FBSyxFQUFFLE9BQU8sQ0FBQyxLQUFLO1lBQ3BCLEtBQUssRUFBRSxPQUFPLENBQUMsS0FBSztZQUNwQixPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU8sSUFBSSxFQUFFO1lBQzlCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUU7WUFDNUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTTtTQUNqQyxDQUFDO1FBRUYsTUFBTSxDQUFDO1lBQ0wsS0FBSztZQUNMLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRztnQkFDM0QsYUFBYSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0JBRTNDLE1BQU0sQ0FBQyxHQUFHLENBQUM7WUFDYixDQUFDLENBQUM7U0FDSCxDQUFDO0lBQ0osQ0FBQztDQUNGIn0=