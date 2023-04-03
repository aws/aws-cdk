"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
const jsiiDeprecationWarnings = require("../../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const fs = require("fs");
const os = require("os");
const path = require("path");
const copy_1 = require("./copy");
const fingerprint_1 = require("./fingerprint");
__exportStar(require("./ignore"), exports);
__exportStar(require("./options"), exports);
/**
 * File system utilities.
 */
class FileSystem {
    /**
     * Copies an entire directory structure.
     * @param srcDir Source directory
     * @param destDir Destination directory
     * @param options options
     * @param rootDir Root directory to calculate exclusions from
     */
    static copyDirectory(srcDir, destDir, options = {}, rootDir) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_CopyOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.copyDirectory);
            }
            throw error;
        }
        return copy_1.copyDirectory(srcDir, destDir, options, rootDir);
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
    static fingerprint(fileOrDirectory, options = {}) {
        try {
            jsiiDeprecationWarnings._aws_cdk_core_FingerprintOptions(options);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.fingerprint);
            }
            throw error;
        }
        return fingerprint_1.fingerprint(fileOrDirectory, options);
    }
    /**
     * Checks whether a directory is empty
     *
     * @param dir The directory to check
     */
    static isEmpty(dir) {
        return fs.readdirSync(dir).length === 0;
    }
    /**
     * The real path of the system temp directory
     */
    static get tmpdir() {
        if (FileSystem._tmpdir) {
            return FileSystem._tmpdir;
        }
        FileSystem._tmpdir = fs.realpathSync(os.tmpdir());
        return FileSystem._tmpdir;
    }
    /**
     * Creates a unique temporary directory in the **system temp directory**.
     *
     * @param prefix A prefix for the directory name. Six random characters
     * will be generated and appended behind this prefix.
     */
    static mkdtemp(prefix) {
        return fs.mkdtempSync(path.join(FileSystem.tmpdir, prefix));
    }
}
exports.FileSystem = FileSystem;
_a = JSII_RTTI_SYMBOL_1;
FileSystem[_a] = { fqn: "@aws-cdk/core.FileSystem", version: "0.0.0" };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsaUNBQXVDO0FBQ3ZDLCtDQUE0QztBQUc1QywyQ0FBeUI7QUFDekIsNENBQTBCO0FBRTFCOztHQUVHO0FBQ0gsTUFBYSxVQUFVO0lBQ3JCOzs7Ozs7T0FNRztJQUNJLE1BQU0sQ0FBQyxhQUFhLENBQUMsTUFBYyxFQUFFLE9BQWUsRUFBRSxVQUF1QixFQUFHLEVBQUUsT0FBZ0I7Ozs7Ozs7Ozs7UUFDdkcsT0FBTyxvQkFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3pEO0lBRUQ7Ozs7Ozs7Ozs7T0FVRztJQUNJLE1BQU0sQ0FBQyxXQUFXLENBQUMsZUFBdUIsRUFBRSxVQUE4QixFQUFHOzs7Ozs7Ozs7O1FBQ2xGLE9BQU8seUJBQVcsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDOUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0tBQ3pDO0lBRUQ7O09BRUc7SUFDSSxNQUFNLEtBQUssTUFBTTtRQUN0QixJQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUU7WUFDdEIsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDO1NBQzNCO1FBQ0QsVUFBVSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELE9BQU8sVUFBVSxDQUFDLE9BQU8sQ0FBQztLQUMzQjtJQUVEOzs7OztPQUtHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFjO1FBQ2xDLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztLQUM3RDs7QUF2REgsZ0NBMERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGNvcHlEaXJlY3RvcnkgfSBmcm9tICcuL2NvcHknO1xuaW1wb3J0IHsgZmluZ2VycHJpbnQgfSBmcm9tICcuL2ZpbmdlcnByaW50JztcbmltcG9ydCB7IENvcHlPcHRpb25zLCBGaW5nZXJwcmludE9wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMnO1xuXG5leHBvcnQgKiBmcm9tICcuL2lnbm9yZSc7XG5leHBvcnQgKiBmcm9tICcuL29wdGlvbnMnO1xuXG4vKipcbiAqIEZpbGUgc3lzdGVtIHV0aWxpdGllcy5cbiAqL1xuZXhwb3J0IGNsYXNzIEZpbGVTeXN0ZW0ge1xuICAvKipcbiAgICogQ29waWVzIGFuIGVudGlyZSBkaXJlY3Rvcnkgc3RydWN0dXJlLlxuICAgKiBAcGFyYW0gc3JjRGlyIFNvdXJjZSBkaXJlY3RvcnlcbiAgICogQHBhcmFtIGRlc3REaXIgRGVzdGluYXRpb24gZGlyZWN0b3J5XG4gICAqIEBwYXJhbSBvcHRpb25zIG9wdGlvbnNcbiAgICogQHBhcmFtIHJvb3REaXIgUm9vdCBkaXJlY3RvcnkgdG8gY2FsY3VsYXRlIGV4Y2x1c2lvbnMgZnJvbVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBjb3B5RGlyZWN0b3J5KHNyY0Rpcjogc3RyaW5nLCBkZXN0RGlyOiBzdHJpbmcsIG9wdGlvbnM6IENvcHlPcHRpb25zID0geyB9LCByb290RGlyPzogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGNvcHlEaXJlY3Rvcnkoc3JjRGlyLCBkZXN0RGlyLCBvcHRpb25zLCByb290RGlyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9kdWNlcyBmaW5nZXJwcmludCBiYXNlZCBvbiB0aGUgY29udGVudHMgb2YgYSBzaW5nbGUgZmlsZSBvciBhbiBlbnRpcmUgZGlyZWN0b3J5IHRyZWUuXG4gICAqXG4gICAqIFRoZSBmaW5nZXJwcmludCB3aWxsIGFsc28gaW5jbHVkZTpcbiAgICogMS4gQW4gZXh0cmEgc3RyaW5nIGlmIGRlZmluZWQgaW4gYG9wdGlvbnMuZXh0cmFgLlxuICAgKiAyLiBUaGUgc2V0IG9mIGV4Y2x1ZGUgcGF0dGVybnMsIGlmIGRlZmluZWQgaW4gYG9wdGlvbnMuZXhjbHVkZWBcbiAgICogMy4gVGhlIHN5bWxpbmsgZm9sbG93IG1vZGUgdmFsdWUuXG4gICAqXG4gICAqIEBwYXJhbSBmaWxlT3JEaXJlY3RvcnkgVGhlIGRpcmVjdG9yeSBvciBmaWxlIHRvIGZpbmdlcnByaW50XG4gICAqIEBwYXJhbSBvcHRpb25zIEZpbmdlcnByaW50aW5nIG9wdGlvbnNcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZmluZ2VycHJpbnQoZmlsZU9yRGlyZWN0b3J5OiBzdHJpbmcsIG9wdGlvbnM6IEZpbmdlcnByaW50T3B0aW9ucyA9IHsgfSkge1xuICAgIHJldHVybiBmaW5nZXJwcmludChmaWxlT3JEaXJlY3RvcnksIG9wdGlvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrcyB3aGV0aGVyIGEgZGlyZWN0b3J5IGlzIGVtcHR5XG4gICAqXG4gICAqIEBwYXJhbSBkaXIgVGhlIGRpcmVjdG9yeSB0byBjaGVja1xuICAgKi9cbiAgcHVibGljIHN0YXRpYyBpc0VtcHR5KGRpcjogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZzLnJlYWRkaXJTeW5jKGRpcikubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoZSByZWFsIHBhdGggb2YgdGhlIHN5c3RlbSB0ZW1wIGRpcmVjdG9yeVxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBnZXQgdG1wZGlyKCk6IHN0cmluZyB7XG4gICAgaWYgKEZpbGVTeXN0ZW0uX3RtcGRpcikge1xuICAgICAgcmV0dXJuIEZpbGVTeXN0ZW0uX3RtcGRpcjtcbiAgICB9XG4gICAgRmlsZVN5c3RlbS5fdG1wZGlyID0gZnMucmVhbHBhdGhTeW5jKG9zLnRtcGRpcigpKTtcbiAgICByZXR1cm4gRmlsZVN5c3RlbS5fdG1wZGlyO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSB1bmlxdWUgdGVtcG9yYXJ5IGRpcmVjdG9yeSBpbiB0aGUgKipzeXN0ZW0gdGVtcCBkaXJlY3RvcnkqKi5cbiAgICpcbiAgICogQHBhcmFtIHByZWZpeCBBIHByZWZpeCBmb3IgdGhlIGRpcmVjdG9yeSBuYW1lLiBTaXggcmFuZG9tIGNoYXJhY3RlcnNcbiAgICogd2lsbCBiZSBnZW5lcmF0ZWQgYW5kIGFwcGVuZGVkIGJlaGluZCB0aGlzIHByZWZpeC5cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbWtkdGVtcChwcmVmaXg6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGZzLm1rZHRlbXBTeW5jKHBhdGguam9pbihGaWxlU3lzdGVtLnRtcGRpciwgcHJlZml4KSk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfdG1wZGlyPzogc3RyaW5nO1xufVxuIl19