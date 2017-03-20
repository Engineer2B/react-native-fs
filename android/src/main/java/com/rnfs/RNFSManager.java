package com.rnfs;

import android.content.res.AssetFileDescriptor;
import android.content.res.AssetManager;
import android.os.Environment;
import android.os.StatFs;
import android.support.annotation.Nullable;
import android.util.Base64;
import android.util.SparseArray;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.URL;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

public class RNFSManager extends ReactContextBaseJavaModule {

  private static final String RNFSDocumentDirectoryPath = "RNFSDocumentDirectoryPath";
  private static final String RNFSExternalDirectoryPath = "RNFSExternalDirectoryPath";
  private static final String RNFSExternalStorageDirectoryPath = "RNFSExternalStorageDirectoryPath";
  private static final String RNFSPicturesDirectoryPath = "RNFSPicturesDirectoryPath";
  private static final String RNFSCachesDirectoryPath = "RNFSCachesDirectoryPath";
  private static final String RNFSDocumentDirectory = "RNFSDocumentDirectory";
  private static final String RNFSFileTypeRegular = "RNFSFileTypeRegular";
  private static final String RNFSFileTypeDirectory = "RNFSFileTypeDirectory";

  private SparseArray<Downloader> downloaders = new SparseArray<Downloader>();

  public RNFSManager(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "RNFSManager";
  }

  @ReactMethod
  public void writeFile(String filePath, String base64Content, Promise promise) {
    try {
      byte[] bytes = Base64.decode(base64Content, Base64.DEFAULT);

      FileOutputStream outputStream = new FileOutputStream(filePath, false);
      outputStream.write(bytes);
      outputStream.close();

      promise.resolve(null);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  @ReactMethod
  public void appendFile(String filePath, String base64Content, Promise promise) {
    try {
      byte[] bytes = Base64.decode(base64Content, Base64.DEFAULT);

      FileOutputStream outputStream = new FileOutputStream(filePath, true);
      outputStream.write(bytes);
      outputStream.close();

      promise.resolve(null);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  @ReactMethod
  public void exists(String filePath, Promise promise) {
    try {
      File file = new File(filePath);
      promise.resolve(file.exists());
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  @ReactMethod
  public void readFile(String filePath, Promise promise) {
    try {
      File file = new File(filePath);

      if (file.isDirectory()) {
        rejectFileIsDirectory(promise);
        return;
      }

      if (!file.exists()) {
        rejectFileNotFound(promise, filePath);
        return;
      }

      FileInputStream inputStream = new FileInputStream(filePath);
      byte[] buffer = new byte[(int)file.length()];
      inputStream.read(buffer);

      String base64Content = Base64.encodeToString(buffer, Base64.NO_WRAP);

      promise.resolve(base64Content);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  @ReactMethod
  public void readFileAssets(String path, Promise promise) {
    InputStream stream = null;
    try {
      // ensure isn't a directory
      AssetManager assetManager = getReactApplicationContext().getAssets();
      stream = assetManager.open(path, 0);
      if (stream == null) {
        reject(promise, path, new Exception("Failed to open file"));
        return;
      }

      byte[] buffer = new byte[stream.available()];
      stream.read(buffer);
      String base64Content = Base64.encodeToString(buffer, Base64.NO_WRAP);
      promise.resolve(base64Content);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, path, ex);
    } finally {
      if (stream != null) {
        try {
          stream.close();
        } catch (IOException ignored) {
        }
      }
    }
  }

  @ReactMethod
  public void hash(String filePath, String algorithm, Promise promise) {
    try {
      Map<String, String> algorithms = new HashMap<>();

      algorithms.put("md5", "MD5");
      algorithms.put("sha1", "SHA-1");
      algorithms.put("sha224", "SHA-224");
      algorithms.put("sha256", "SHA-256");
      algorithms.put("sha384", "SHA-384");
      algorithms.put("sha512", "SHA-512");

      if (!algorithms.containsKey(algorithm)) throw new Exception("Invalid hash algorithm");

      File file = new File(filePath);

      if (file.isDirectory()) {
        rejectFileIsDirectory(promise);
        return;
      }

      if (!file.exists()) {
        rejectFileNotFound(promise, filePath);
        return;
      }

      MessageDigest md = MessageDigest.getInstance(algorithms.get(algorithm));

      FileInputStream inputStream = new FileInputStream(filePath);
      byte[] buffer = new byte[(int)file.length()];

      int read;
      while ((read = inputStream.read(buffer)) != -1) {
        md.update(buffer, 0, read);
      }

      StringBuilder hexString = new StringBuilder();
      for (byte digestByte : md.digest())
        hexString.append(String.format("%02x", digestByte));

      promise.resolve(hexString.toString());
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  @ReactMethod
  public void moveFile(String filepath, String destPath, Promise promise) {
    try {
      File inFile = new File(filepath);

      if (!inFile.renameTo(new File(destPath))) {
        copyFile(filepath, destPath);

        inFile.delete();
      }

      promise.resolve(true);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filepath, ex);
    }
  }

  @ReactMethod
  public void copyFile(String filePath, String destPath, Promise promise) {
    try {
      copyFile(filePath, destPath);

      promise.resolve(null);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  private void copyFile(String filepath, String destPath) throws IOException {
    InputStream in = new FileInputStream(filepath);
    OutputStream out = new FileOutputStream(destPath);

    byte[] buffer = new byte[1024];
    int length;
    while ((length = in.read(buffer)) > 0) {
      out.write(buffer, 0, length);
    }
    in.close();
    out.close();
  }

  @ReactMethod
  public void readDir(String dirPath, Promise promise) {
    try {
      File file = new File(dirPath);

      if (!file.exists()) throw new Exception("Folder does not exist");

      File[] files = file.listFiles();

      WritableArray fileMaps = Arguments.createArray();

      for (File childFile : files) {
        WritableMap fileMap = Arguments.createMap();

        fileMap.putString("name", childFile.getName());
        fileMap.putString("path", childFile.getAbsolutePath());
        fileMap.putInt("size", (int)childFile.length());
        fileMap.putInt("isdirectory", childFile.isDirectory() ? 1 : 0);

        fileMaps.pushMap(fileMap);
      }

      promise.resolve(fileMaps);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, dirPath, ex);
    }
  }

  @ReactMethod
  public void readDirAssets(String directory, Promise promise) {
    try {
      AssetManager assetManager = getReactApplicationContext().getAssets();
      String[] list = assetManager.list(directory);

      WritableArray fileMaps = Arguments.createArray();
      for (String childFile : list) {
        WritableMap fileMap = Arguments.createMap();

        fileMap.putString("name", childFile);
        String path = directory.isEmpty() ? childFile : String.format("%s/%s", directory, childFile); // don't allow / at the start when directory is ""
        fileMap.putString("path", path);
        int length = 0;
        boolean isDirectory = false;
        try {
          AssetFileDescriptor assetFileDescriptor = assetManager.openFd(path);
          if (assetFileDescriptor != null) {
            length = (int) assetFileDescriptor.getLength();
            assetFileDescriptor.close();
          }
        } catch (IOException ex) {
          //.. ah.. is a directory!
          isDirectory = true;
        }
        fileMap.putInt("size", length);
        fileMap.putInt("isdirectory", isDirectory ? 1 : 0); // if 0, probably a folder..

        fileMaps.pushMap(fileMap);
      }
      promise.resolve(fileMaps);

    } catch (IOException e) {
      reject(promise, directory, e);
    }
  }

  @ReactMethod
  public void copyFileAssets(String assetPath, String destination, Promise promise) {
    AssetManager assetManager = getReactApplicationContext().getAssets();
    try {
      InputStream in = assetManager.open(assetPath);
      copyInputStream(in, assetPath, destination, promise);
    } catch (IOException e) {
      // Default error message is just asset name, so make a more helpful error here.
      reject(promise, assetPath, new Exception(String.format("Asset '%s' could not be opened", assetPath)));
    }
  }

  @ReactMethod
  public void existsAssets(String filePath, Promise promise) {
    try {
      AssetManager assetManager = getReactApplicationContext().getAssets();

      try {
        String[] list = assetManager.list(filePath);
        if (list != null && list.length > 0) {
          promise.resolve(true);
          return;
        }
      } catch (Exception ignored) {
        //.. probably not a directory then
      }

      // Attempt to open file (win = exists)
      InputStream fileStream = null;
      try {
        fileStream = assetManager.open(filePath);
        promise.resolve(true);
      } catch (Exception ex) {
        promise.resolve(false); // don't throw an error, resolve false
      } finally {
        if (fileStream != null) {
          try {
            fileStream.close();
          } catch (Exception ignored) {
          }
        }
      }
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  /**
   * Internal method for copying that works with any InputStream
   * @param in InputStream from assets or file
   * @param source source path (only used for logging errors)
   * @param destination destination path
   * @param promise React Callback
   */
  private void copyInputStream(InputStream in, String source, String destination, Promise promise) {
    OutputStream out = null;
    try {
      File outFile = new File(destination);
      try {
        out = new FileOutputStream(outFile);
      } catch (FileNotFoundException e) {
        reject(promise, source, e);
        return;
      }

      try {
        byte[] buffer = new byte[1024 * 10]; // 10k buffer
        int read;
        while ((read = in.read(buffer)) != -1) {
          out.write(buffer, 0, read);
        }
      } catch (IOException e) {
        reject(promise, source, new Exception(String.format("Failed to copy '%s' to %s (%s)", source, destination, e.getLocalizedMessage())));
        return;
      }

      // Success!
      promise.resolve(null);
    } finally {
      if (in != null) {
        try {
          in.close();
        } catch (IOException ignored) {
        }
      }
      if (out != null) {
        try {
          out.close();
        } catch (IOException ignored) {
        }
      }
    }
  }

  @ReactMethod
  public void stat(String filePath, Promise promise) {
    try {
      File file = new File(filePath);

      if (!file.exists()) throw new Exception("File does not exist");

      WritableMap statMap = Arguments.createMap();

      statMap.putString("parent", file.getParent());
      statMap.putInt("mtime", (int)(file.lastModified() / 1000));
      statMap.putInt("size", (int)file.length());
      statMap.putInt("type", file.isDirectory() ? 1 : 0);

      promise.resolve(statMap);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  @ReactMethod
  public void unlink(String filePath, Promise promise) {
    try {
      File file = new File(filePath);

      if (!file.exists()) throw new Exception("File does not exist");

      DeleteRecursive(file);

      promise.resolve(null);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  private void DeleteRecursive(File fileOrDirectory) {
    if (fileOrDirectory.isDirectory()) {
      for (File child : fileOrDirectory.listFiles()) {
        DeleteRecursive(child);
      }
    }

    fileOrDirectory.delete();
  }

  @ReactMethod
  public void mkdir(String filePath, Promise promise) {
    try {
      File file = new File(filePath);

      file.mkdirs();

      boolean exists = file.exists();

      if (!exists) throw new Exception("Directory could not be created");

      promise.resolve(null);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, filePath, ex);
    }
  }

  private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
    reactContext
            .getJSModule(RCTNativeAppEventEmitter.class)
            .emit(eventName, params);
  }

  @ReactMethod
  public void downloadFile(final ReadableMap options, final Promise promise) {
    try {
      File file = new File(options.getString("toFile"));
      URL url = new URL(options.getString("fromUrl"));
      final int jobId = options.getInt("jobId");
      ReadableMap headers = options.getMap("headers");
      int progressDivider = options.getInt("progressDivider");

      DownloadParams params = new DownloadParams();

      params.src = url;
      params.dest = file;
      params.headers = headers;
      params.progressDivider = progressDivider;

      params.onTaskCompleted = new DownloadParams.OnTaskCompleted() {
        public void onTaskCompleted(DownloadResult res) {
          if (res.exception == null) {
            WritableMap infoMap = Arguments.createMap();

            infoMap.putInt("jobId", jobId);
            infoMap.putInt("statusCode", res.statusCode);
            infoMap.putDouble("bytesWritten", res.bytesWritten);

            promise.resolve(infoMap);
          } else {
            reject(promise, options.getString("toFile"), res.exception);
          }
        }
      };

      params.onDownloadBegin = new DownloadParams.OnDownloadBegin() {
        public void onDownloadBegin(int statusCode, int contentLength, Map<String, String> headers) {
          WritableMap headersMap = Arguments.createMap();

          for (Map.Entry<String, String> entry : headers.entrySet()) {
            headersMap.putString(entry.getKey(), entry.getValue());
          }

          WritableMap data = Arguments.createMap();

          data.putInt("jobId", jobId);
          data.putInt("statusCode", statusCode);
          data.putInt("contentLength", contentLength);
          data.putMap("headers", headersMap);

          sendEvent(getReactApplicationContext(), "DownloadBegin-" + jobId, data);
        }
      };

      params.onDownloadProgress = new DownloadParams.OnDownloadProgress() {
        public void onDownloadProgress(int contentLength, double bytesWritten) {
          WritableMap data = Arguments.createMap();

          data.putInt("jobId", jobId);
          data.putInt("contentLength", contentLength);
          data.putDouble("bytesWritten", bytesWritten);

          sendEvent(getReactApplicationContext(), "DownloadProgress-" + jobId, data);
        }
      };

      Downloader downloader = new Downloader();

      downloader.execute(params);

      this.downloaders.put(jobId, downloader);
    } catch (Exception ex) {
      ex.printStackTrace();
      reject(promise, options.getString("toFile"), ex);
    }
  }

  @ReactMethod
  public void stopDownload(int jobId) {
    Downloader downloader = this.downloaders.get(jobId);

    if (downloader != null) {
      downloader.stop();
    }
  }

  @ReactMethod
  public void pathForBundle(String bundleNamed, Promise promise) {
    // TODO: Not sure what equilivent would be?
  }

    @ReactMethod
  public void getFSInfo(String filePath, Promise promise) {
    // File path = Environment.getDataDirectory();
    StatFs stat = new StatFs(filePath);
    long totalSpace;
    long freeSpace;
    if (android.os.Build.VERSION.SDK_INT >= 18) {
      totalSpace = stat.getTotalBytes();
      freeSpace = stat.getFreeBytes();
    } else {
      long blockSize = stat.getBlockSize();
      totalSpace = blockSize * stat.getBlockCount();
      freeSpace = blockSize * stat.getAvailableBlocks();
    }
    WritableMap info = Arguments.createMap();
    info.putDouble("totalSpace", (double)totalSpace);   // Int32 too small, must use Double
    info.putDouble("freeSpace", (double)freeSpace);
    promise.resolve(info);
  }

  private void reject(Promise promise, String filepath, Exception ex) {
    if (ex instanceof FileNotFoundException) {
      rejectFileNotFound(promise, filepath);
      return;
    }

    promise.reject(null, ex.getMessage());
  }

  private void rejectFileNotFound(Promise promise, String filepath) {
    promise.reject("ENOENT", "ENOENT: no such file or directory, open '" + filepath + "'");
  }

  private void rejectFileIsDirectory(Promise promise) {
    promise.reject("EISDIR", "EISDIR: illegal operation on a directory, read");
  }



  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();

    constants.put(RNFSDocumentDirectory, Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS).getAbsolutePath());
    constants.put(RNFSDocumentDirectoryPath, this.getReactApplicationContext().getFilesDir().getAbsolutePath());
    constants.put(RNFSPicturesDirectoryPath, Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES).getAbsolutePath());
    constants.put(RNFSCachesDirectoryPath, this.getReactApplicationContext().getCacheDir().getAbsolutePath());
    constants.put(RNFSFileTypeRegular, 0);
    constants.put(RNFSFileTypeDirectory, 1);
    constants.put("RNFSDirectoryAlarms",Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_ALARMS).getAbsolutePath());
    constants.put("RNFSDirectoryDCIM",Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath());
    constants.put("RNFSDirectoryDownloads",Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath());
    constants.put("RNFSDirectoryMovies",Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MOVIES).getAbsolutePath());
    constants.put("RNFSDirectoryMusic",Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_MUSIC).getAbsolutePath());
    constants.put("RNFSDirectoryNotifications",Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_NOTIFICATIONS).getAbsolutePath());
    constants.put("RNFSDirectoryPodcasts",Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PODCASTS).getAbsolutePath());
    constants.put("RNFSDirectoryRingtones",Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_RINGTONES).getAbsolutePath());;
    /**
    public static String	DIRECTORY_ALARMS
    Standard directory in which to place any audio files that should be in the list of alarms that the user can select (not as regular music).
    public static String	DIRECTORY_DCIM
    The traditional location for pictures and videos when mounting the device as a camera.
    public static String	DIRECTORY_DOCUMENTS
    Standard directory in which to place documents that have been created by the user.
    public static String	DIRECTORY_DOWNLOADS
    Standard directory in which to place files that have been downloaded by the user.
    public static String	DIRECTORY_MOVIES
    Standard directory in which to place movies that are available to the user.
    public static String	DIRECTORY_MUSIC
    Standard directory in which to place any audio files that should be in the regular list of music for the user.
    public static String	DIRECTORY_NOTIFICATIONS
    Standard directory in which to place any audio files that should be in the list of notifications that the user can select (not as regular music).
    public static String	DIRECTORY_PICTURES
    Standard directory in which to place pictures that are available to the user.
    public static String	DIRECTORY_PODCASTS
    Standard directory in which to place any audio files that should be in the list of podcasts that the user can select (not as regular music).
    public static String	DIRECTORY_RINGTONES
    Standard directory in which to place any audio files that should be in the list of ringtones that the user can select (not as regular music).
    static File	getDataDirectory()
    Return the user data directory.
    static File	getDownloadCacheDirectory()
    Return the download/cache content directory.
    static File	getExternalStorageDirectory()
    Return the primary shared/external storage directory.
    static File	getExternalStoragePublicDirectory(String type)
    Get a top-level shared/external storage directory for placing files of a particular type.
    static String	getExternalStorageState()
    Returns the current state of the primary shared/external storage media.
    static String	getExternalStorageState(File path)
    Returns the current state of the shared/external storage media at the given path.
    static File	getRootDirectory()
    Return root of the "system" partition holding the core Android OS.
    static String	getStorageState(File path)
    This method was deprecated in API level 21. use getExternalStorageState(File)
    static boolean	isExternalStorageEmulated()
    Returns whether the primary shared/external storage media is emulated.
    static boolean	isExternalStorageEmulated(File path)
    Returns whether the shared/external storage media at the given path is emulated.
    static boolean	isExternalStorageRemovable()
    Returns whether the primary shared/external storage media is physically removable.
    static boolean	isExternalStorageRemovable(File path)
    Returns whether the shared/external storage media at the given path is physically removable.
    https://developer.android.com/reference/android/os/Environment.html
    */

    File externalStorageDirectory = Environment.getExternalStorageDirectory();
    if (externalStorageDirectory != null) {
      constants.put(RNFSExternalStorageDirectoryPath, externalStorageDirectory.getAbsolutePath());
    } else {
      constants.put(RNFSExternalStorageDirectoryPath, null);
    }

    File externalDirectory = this.getReactApplicationContext().getExternalFilesDir(null);
    if (externalDirectory != null) {
      constants.put(RNFSExternalDirectoryPath, externalDirectory.getAbsolutePath());
    } else {
      constants.put(RNFSExternalDirectoryPath, null);
    }

    return constants;
  }
}
