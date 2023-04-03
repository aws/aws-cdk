"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSystem = void 0;
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
        return (0, copy_1.copyDirectory)(srcDir, destDir, options, rootDir);
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
        return (0, fingerprint_1.fingerprint)(fileOrDirectory, options);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLGlDQUF1QztBQUN2QywrQ0FBNEM7QUFHNUMsMkNBQXlCO0FBQ3pCLDRDQUEwQjtBQUUxQjs7R0FFRztBQUNILE1BQWEsVUFBVTtJQUNyQjs7Ozs7O09BTUc7SUFDSSxNQUFNLENBQUMsYUFBYSxDQUFDLE1BQWMsRUFBRSxPQUFlLEVBQUUsVUFBdUIsRUFBRyxFQUFFLE9BQWdCO1FBQ3ZHLE9BQU8sSUFBQSxvQkFBYSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRDs7Ozs7Ozs7OztPQVVHO0lBQ0ksTUFBTSxDQUFDLFdBQVcsQ0FBQyxlQUF1QixFQUFFLFVBQThCLEVBQUc7UUFDbEYsT0FBTyxJQUFBLHlCQUFXLEVBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQy9CLE9BQU8sRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRDs7T0FFRztJQUNJLE1BQU0sS0FBSyxNQUFNO1FBQ3RCLElBQUksVUFBVSxDQUFDLE9BQU8sRUFBRTtZQUN0QixPQUFPLFVBQVUsQ0FBQyxPQUFPLENBQUM7U0FDM0I7UUFDRCxVQUFVLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDbEQsT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDO0lBQzVCLENBQUM7SUFFRDs7Ozs7T0FLRztJQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBYztRQUNsQyxPQUFPLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztDQUdGO0FBMURELGdDQTBEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBjb3B5RGlyZWN0b3J5IH0gZnJvbSAnLi9jb3B5JztcbmltcG9ydCB7IGZpbmdlcnByaW50IH0gZnJvbSAnLi9maW5nZXJwcmludCc7XG5pbXBvcnQgeyBDb3B5T3B0aW9ucywgRmluZ2VycHJpbnRPcHRpb25zIH0gZnJvbSAnLi9vcHRpb25zJztcblxuZXhwb3J0ICogZnJvbSAnLi9pZ25vcmUnO1xuZXhwb3J0ICogZnJvbSAnLi9vcHRpb25zJztcblxuLyoqXG4gKiBGaWxlIHN5c3RlbSB1dGlsaXRpZXMuXG4gKi9cbmV4cG9ydCBjbGFzcyBGaWxlU3lzdGVtIHtcbiAgLyoqXG4gICAqIENvcGllcyBhbiBlbnRpcmUgZGlyZWN0b3J5IHN0cnVjdHVyZS5cbiAgICogQHBhcmFtIHNyY0RpciBTb3VyY2UgZGlyZWN0b3J5XG4gICAqIEBwYXJhbSBkZXN0RGlyIERlc3RpbmF0aW9uIGRpcmVjdG9yeVxuICAgKiBAcGFyYW0gb3B0aW9ucyBvcHRpb25zXG4gICAqIEBwYXJhbSByb290RGlyIFJvb3QgZGlyZWN0b3J5IHRvIGNhbGN1bGF0ZSBleGNsdXNpb25zIGZyb21cbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY29weURpcmVjdG9yeShzcmNEaXI6IHN0cmluZywgZGVzdERpcjogc3RyaW5nLCBvcHRpb25zOiBDb3B5T3B0aW9ucyA9IHsgfSwgcm9vdERpcj86IHN0cmluZykge1xuICAgIHJldHVybiBjb3B5RGlyZWN0b3J5KHNyY0RpciwgZGVzdERpciwgb3B0aW9ucywgcm9vdERpcik7XG4gIH1cblxuICAvKipcbiAgICogUHJvZHVjZXMgZmluZ2VycHJpbnQgYmFzZWQgb24gdGhlIGNvbnRlbnRzIG9mIGEgc2luZ2xlIGZpbGUgb3IgYW4gZW50aXJlIGRpcmVjdG9yeSB0cmVlLlxuICAgKlxuICAgKiBUaGUgZmluZ2VycHJpbnQgd2lsbCBhbHNvIGluY2x1ZGU6XG4gICAqIDEuIEFuIGV4dHJhIHN0cmluZyBpZiBkZWZpbmVkIGluIGBvcHRpb25zLmV4dHJhYC5cbiAgICogMi4gVGhlIHNldCBvZiBleGNsdWRlIHBhdHRlcm5zLCBpZiBkZWZpbmVkIGluIGBvcHRpb25zLmV4Y2x1ZGVgXG4gICAqIDMuIFRoZSBzeW1saW5rIGZvbGxvdyBtb2RlIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gZmlsZU9yRGlyZWN0b3J5IFRoZSBkaXJlY3Rvcnkgb3IgZmlsZSB0byBmaW5nZXJwcmludFxuICAgKiBAcGFyYW0gb3B0aW9ucyBGaW5nZXJwcmludGluZyBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIGZpbmdlcnByaW50KGZpbGVPckRpcmVjdG9yeTogc3RyaW5nLCBvcHRpb25zOiBGaW5nZXJwcmludE9wdGlvbnMgPSB7IH0pIHtcbiAgICByZXR1cm4gZmluZ2VycHJpbnQoZmlsZU9yRGlyZWN0b3J5LCBvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3Mgd2hldGhlciBhIGRpcmVjdG9yeSBpcyBlbXB0eVxuICAgKlxuICAgKiBAcGFyYW0gZGlyIFRoZSBkaXJlY3RvcnkgdG8gY2hlY2tcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgaXNFbXB0eShkaXI6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBmcy5yZWFkZGlyU3luYyhkaXIpLmxlbmd0aCA9PT0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgcmVhbCBwYXRoIG9mIHRoZSBzeXN0ZW0gdGVtcCBkaXJlY3RvcnlcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgZ2V0IHRtcGRpcigpOiBzdHJpbmcge1xuICAgIGlmIChGaWxlU3lzdGVtLl90bXBkaXIpIHtcbiAgICAgIHJldHVybiBGaWxlU3lzdGVtLl90bXBkaXI7XG4gICAgfVxuICAgIEZpbGVTeXN0ZW0uX3RtcGRpciA9IGZzLnJlYWxwYXRoU3luYyhvcy50bXBkaXIoKSk7XG4gICAgcmV0dXJuIEZpbGVTeXN0ZW0uX3RtcGRpcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgdW5pcXVlIHRlbXBvcmFyeSBkaXJlY3RvcnkgaW4gdGhlICoqc3lzdGVtIHRlbXAgZGlyZWN0b3J5KiouXG4gICAqXG4gICAqIEBwYXJhbSBwcmVmaXggQSBwcmVmaXggZm9yIHRoZSBkaXJlY3RvcnkgbmFtZS4gU2l4IHJhbmRvbSBjaGFyYWN0ZXJzXG4gICAqIHdpbGwgYmUgZ2VuZXJhdGVkIGFuZCBhcHBlbmRlZCBiZWhpbmQgdGhpcyBwcmVmaXguXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG1rZHRlbXAocHJlZml4OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBmcy5ta2R0ZW1wU3luYyhwYXRoLmpvaW4oRmlsZVN5c3RlbS50bXBkaXIsIHByZWZpeCkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX3RtcGRpcj86IHN0cmluZztcbn1cbiJdfQ==