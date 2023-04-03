import { CopyOptions, FingerprintOptions } from './options';
export * from './ignore';
export * from './options';
/**
 * File system utilities.
 */
export declare class FileSystem {
    /**
     * Copies an entire directory structure.
     * @param srcDir Source directory
     * @param destDir Destination directory
     * @param options options
     * @param rootDir Root directory to calculate exclusions from
     */
    static copyDirectory(srcDir: string, destDir: string, options?: CopyOptions, rootDir?: string): void;
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
    static fingerprint(fileOrDirectory: string, options?: FingerprintOptions): string;
    /**
     * Checks whether a directory is empty
     *
     * @param dir The directory to check
     */
    static isEmpty(dir: string): boolean;
    /**
     * The real path of the system temp directory
     */
    static get tmpdir(): string;
    /**
     * Creates a unique temporary directory in the **system temp directory**.
     *
     * @param prefix A prefix for the directory name. Six random characters
     * will be generated and appended behind this prefix.
     */
    static mkdtemp(prefix: string): string;
    private static _tmpdir?;
}
