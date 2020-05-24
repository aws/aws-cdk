import { copyDirectory } from './copy';
import { fingerprint } from './fingerprint';
import { CopyOptions, FingerprintOptions } from './options';

export * from './options';

/**
 * File system utilities.
 */
export class FileSystem {
  /**
   * Copies an entire directory structure.
   * @param srcDir Source directory
   * @param destDir Destination directory
   * @param options options
   * @param rootDir Root directory to calculate exclusions from
   */
  public static copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
    return copyDirectory(srcDir, destDir, options, rootDir);
  }

  /**
   * Produces fingerprint based on the contents of a single file or an entire directory tree.
   *
   * The fingerprint will also include:
   * 1. An extra string if defined in `options.extra`.
   * 2. The set of exclude patterns, if defined in `options.exclude`
   * 3. The symlink follow mode value.
   *
   * @param fileOrDirectory The directory or file to fingerprint
   * @param options Fingerprinting options
   */
  public static fingerprint(fileOrDirectory: string, options: FingerprintOptions = { }) {
    return fingerprint(fileOrDirectory, options);
  }
}