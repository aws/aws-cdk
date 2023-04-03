"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentFingerprint = exports.fingerprint = exports.clearLargeFileFingerprintCache = void 0;
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const ignore_1 = require("./ignore");
const options_1 = require("./options");
const utils_1 = require("./utils");
const cache_1 = require("../private/cache");
const BUFFER_SIZE = 8 * 1024;
const CTRL_SOH = '\x01';
const CTRL_SOT = '\x02';
const CTRL_ETX = '\x03';
const CR = '\r';
const LF = '\n';
const CRLF = `${CR}${LF}`;
const fingerprintCache = new cache_1.Cache();
/**
 * Files are fingerprinted only the first time they are encountered, to save
 * time hashing large files. This function clears this cache, should it be
 * necessary for some reason.
 */
function clearLargeFileFingerprintCache() {
    fingerprintCache.clear();
}
exports.clearLargeFileFingerprintCache = clearLargeFileFingerprintCache;
/**
 * Produces fingerprint based on the contents of a single file or an entire directory tree.
 *
 * Line endings are converted from CRLF to LF.
 *
 * The fingerprint will also include:
 * 1. An extra string if defined in `options.extra`.
 * 2. The symlink follow mode value.
 *
 * @param fileOrDirectory The directory or file to fingerprint
 * @param options Fingerprinting options
 */
function fingerprint(fileOrDirectory, options = {}) {
    const hash = crypto.createHash('sha256');
    _hashField(hash, 'options.extra', options.extraHash || '');
    const follow = options.follow || options_1.SymlinkFollowMode.EXTERNAL;
    _hashField(hash, 'options.follow', follow);
    // Resolve symlinks in the initial path (for example, the root directory
    // might be symlinked). It's important that we know the absolute path, so we
    // can judge if further symlinks inside the target directory are within the
    // target or not (if we don't resolve, we would test w.r.t. the wrong path).
    fileOrDirectory = fs.realpathSync(fileOrDirectory);
    const isDir = fs.statSync(fileOrDirectory).isDirectory();
    const rootDirectory = isDir
        ? fileOrDirectory
        : path.dirname(fileOrDirectory);
    const ignoreMode = options.ignoreMode || options_1.IgnoreMode.GLOB;
    if (ignoreMode != options_1.IgnoreMode.GLOB) {
        _hashField(hash, 'options.ignoreMode', ignoreMode);
    }
    const ignoreStrategy = ignore_1.IgnoreStrategy.fromCopyOptions(options, fileOrDirectory);
    _processFileOrDirectory(fileOrDirectory, isDir);
    return hash.digest('hex');
    function _processFileOrDirectory(symbolicPath, isRootDir = false, realPath = symbolicPath) {
        if (!isRootDir && ignoreStrategy.ignores(symbolicPath)) {
            return;
        }
        const stat = fs.lstatSync(realPath);
        // Use relative path as hash component. Normalize it with forward slashes to ensure
        // same hash on Windows and Linux.
        const hashComponent = path.relative(fileOrDirectory, symbolicPath).replace(/\\/g, '/');
        if (stat.isSymbolicLink()) {
            const linkTarget = fs.readlinkSync(realPath);
            const resolvedLinkTarget = path.resolve(path.dirname(realPath), linkTarget);
            if ((0, utils_1.shouldFollow)(follow, rootDirectory, resolvedLinkTarget)) {
                _processFileOrDirectory(symbolicPath, false, resolvedLinkTarget);
            }
            else {
                _hashField(hash, `link:${hashComponent}`, linkTarget);
            }
        }
        else if (stat.isFile()) {
            _hashField(hash, `file:${hashComponent}`, contentFingerprint(realPath));
        }
        else if (stat.isDirectory()) {
            for (const item of fs.readdirSync(realPath).sort()) {
                _processFileOrDirectory(path.join(symbolicPath, item), false, path.join(realPath, item));
            }
        }
        else {
            throw new Error(`Unable to hash ${symbolicPath}: it is neither a file nor a directory`);
        }
    }
}
exports.fingerprint = fingerprint;
function contentFingerprint(file) {
    // On windows it's particularly important to pass bigint: true to ensure that
    // floating-point inaccuracies don't result in false matches. ( see
    // https://github.com/nodejs/node/issues/12115#issuecomment-438741212 )
    //
    // Note that even if we do get a inode collision somehow, it's unlikely that
    // both mtime and size would have a false-positive as well.
    // We also must suppress typescript typechecks as we are using a version of
    // @types/node that only supports node 10 declarations.
    const stats = fs.statSync(file, { bigint: true });
    const cacheKey = JSON.stringify({
        mtime_unix: stats.mtime.toUTCString(),
        mtime_ms: stats.mtimeMs.toString(),
        inode: stats.ino.toString(),
        size: stats.size.toString(),
    });
    return fingerprintCache.obtain(cacheKey, () => contentFingerprintMiss(file));
}
exports.contentFingerprint = contentFingerprint;
function contentFingerprintMiss(file) {
    const hash = crypto.createHash('sha256');
    const buffer = Buffer.alloc(BUFFER_SIZE);
    // eslint-disable-next-line no-bitwise
    const fd = fs.openSync(file, fs.constants.O_DSYNC | fs.constants.O_RDONLY | fs.constants.O_SYNC);
    let size = 0;
    let isBinary = false;
    let lastStr = '';
    let read = 0;
    try {
        while ((read = fs.readSync(fd, buffer, 0, BUFFER_SIZE, null)) !== 0) {
            const slicedBuffer = buffer.slice(0, read);
            // Detect if file is binary by checking the first 8k bytes for the
            // null character (git like implementation)
            if (size === 0) {
                isBinary = slicedBuffer.indexOf(0) !== -1;
            }
            let dataBuffer = slicedBuffer;
            if (!isBinary) { // Line endings normalization (CRLF -> LF)
                const str = buffer.slice(0, read).toString();
                // We are going to normalize line endings to LF. So if the current
                // buffer ends with CR, it could be that the next one starts with
                // LF so we need to save it for later use.
                if (new RegExp(`${CR}$`).test(str)) {
                    lastStr += str;
                    continue;
                }
                const data = lastStr + str;
                const normalizedData = data.replace(new RegExp(CRLF, 'g'), LF);
                dataBuffer = Buffer.from(normalizedData);
                lastStr = '';
            }
            size += dataBuffer.length;
            hash.update(dataBuffer);
        }
        if (lastStr) {
            hash.update(Buffer.from(lastStr));
        }
    }
    finally {
        fs.closeSync(fd);
    }
    return `${size}:${hash.digest('hex')}`;
}
function _hashField(hash, header, value) {
    hash.update(CTRL_SOH).update(header).update(CTRL_SOT).update(value).update(CTRL_ETX);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZ2VycHJpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaW5nZXJwcmludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBaUM7QUFDakMseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FBMEM7QUFDMUMsdUNBQThFO0FBQzlFLG1DQUF1QztBQUN2Qyw0Q0FBeUM7QUFFekMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUM3QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDeEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUN4QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDaEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0FBRTFCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxhQUFLLEVBQVUsQ0FBQztBQUU3Qzs7OztHQUlHO0FBQ0gsU0FBZ0IsOEJBQThCO0lBQzVDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzNCLENBQUM7QUFGRCx3RUFFQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLGVBQXVCLEVBQUUsVUFBOEIsRUFBRztJQUNwRixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUM7SUFDM0QsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSwyQkFBaUIsQ0FBQyxRQUFRLENBQUM7SUFDNUQsVUFBVSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUUzQyx3RUFBd0U7SUFDeEUsNEVBQTRFO0lBQzVFLDJFQUEyRTtJQUMzRSw0RUFBNEU7SUFDNUUsZUFBZSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7SUFFbkQsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN6RCxNQUFNLGFBQWEsR0FBRyxLQUFLO1FBQ3pCLENBQUMsQ0FBQyxlQUFlO1FBQ2pCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRWxDLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLElBQUksb0JBQVUsQ0FBQyxJQUFJLENBQUM7SUFDekQsSUFBSSxVQUFVLElBQUksb0JBQVUsQ0FBQyxJQUFJLEVBQUU7UUFDakMsVUFBVSxDQUFDLElBQUksRUFBRSxvQkFBb0IsRUFBRSxVQUFVLENBQUMsQ0FBQztLQUNwRDtJQUVELE1BQU0sY0FBYyxHQUFHLHVCQUFjLENBQUMsZUFBZSxDQUFDLE9BQU8sRUFBRSxlQUFlLENBQUMsQ0FBQztJQUNoRix1QkFBdUIsQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFFaEQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTFCLFNBQVMsdUJBQXVCLENBQUMsWUFBb0IsRUFBRSxZQUFxQixLQUFLLEVBQUUsUUFBUSxHQUFHLFlBQVk7UUFDeEcsSUFBSSxDQUFDLFNBQVMsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3RELE9BQU87U0FDUjtRQUVELE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFFcEMsbUZBQW1GO1FBQ25GLGtDQUFrQztRQUNsQyxNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXZGLElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFO1lBQ3pCLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0MsTUFBTSxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDNUUsSUFBSSxJQUFBLG9CQUFZLEVBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxrQkFBa0IsQ0FBQyxFQUFFO2dCQUMzRCx1QkFBdUIsQ0FBQyxZQUFZLEVBQUUsS0FBSyxFQUFFLGtCQUFrQixDQUFDLENBQUM7YUFDbEU7aUJBQU07Z0JBQ0wsVUFBVSxDQUFDLElBQUksRUFBRSxRQUFRLGFBQWEsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2FBQ3ZEO1NBQ0Y7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN4QixVQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsYUFBYSxFQUFFLEVBQUUsa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUN6RTthQUFNLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQzdCLEtBQUssTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDbEQsdUJBQXVCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDMUY7U0FDRjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsWUFBWSx3Q0FBd0MsQ0FBQyxDQUFDO1NBQ3pGO0lBQ0gsQ0FBQztBQUNILENBQUM7QUF4REQsa0NBd0RDO0FBRUQsU0FBZ0Isa0JBQWtCLENBQUMsSUFBWTtJQUM3Qyw2RUFBNkU7SUFDN0UsbUVBQW1FO0lBQ25FLHVFQUF1RTtJQUN2RSxFQUFFO0lBQ0YsNEVBQTRFO0lBQzVFLDJEQUEyRDtJQUUzRCwyRUFBMkU7SUFDM0UsdURBQXVEO0lBQ3ZELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDbEQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM5QixVQUFVLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUU7UUFDckMsUUFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ2xDLEtBQUssRUFBRSxLQUFLLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRTtRQUMzQixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7S0FDNUIsQ0FBQyxDQUFDO0lBRUgsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDL0UsQ0FBQztBQW5CRCxnREFtQkM7QUFFRCxTQUFTLHNCQUFzQixDQUFDLElBQVk7SUFDMUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN6QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3pDLHNDQUFzQztJQUN0QyxNQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pHLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNiLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztJQUNyQixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDakIsSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ2IsSUFBSTtRQUNGLE9BQU8sQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbkUsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFM0Msa0VBQWtFO1lBQ2xFLDJDQUEyQztZQUMzQyxJQUFJLElBQUksS0FBSyxDQUFDLEVBQUU7Z0JBQ2QsUUFBUSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7YUFDM0M7WUFFRCxJQUFJLFVBQVUsR0FBRyxZQUFZLENBQUM7WUFDOUIsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLDBDQUEwQztnQkFDekQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRTdDLGtFQUFrRTtnQkFDbEUsaUVBQWlFO2dCQUNqRSwwQ0FBMEM7Z0JBQzFDLElBQUksSUFBSSxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDbEMsT0FBTyxJQUFJLEdBQUcsQ0FBQztvQkFDZixTQUFTO2lCQUNWO2dCQUVELE1BQU0sSUFBSSxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUM7Z0JBQzNCLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMvRCxVQUFVLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDekMsT0FBTyxHQUFHLEVBQUUsQ0FBQzthQUNkO1lBRUQsSUFBSSxJQUFJLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUN6QjtRQUVELElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDbkM7S0FDRjtZQUFTO1FBQ1IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztLQUNsQjtJQUNELE9BQU8sR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO0FBQ3pDLENBQUM7QUFFRCxTQUFTLFVBQVUsQ0FBQyxJQUFpQixFQUFFLE1BQWMsRUFBRSxLQUFpQztJQUN0RixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2RixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY3J5cHRvIGZyb20gJ2NyeXB0byc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgSWdub3JlU3RyYXRlZ3kgfSBmcm9tICcuL2lnbm9yZSc7XG5pbXBvcnQgeyBGaW5nZXJwcmludE9wdGlvbnMsIElnbm9yZU1vZGUsIFN5bWxpbmtGb2xsb3dNb2RlIH0gZnJvbSAnLi9vcHRpb25zJztcbmltcG9ydCB7IHNob3VsZEZvbGxvdyB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgQ2FjaGUgfSBmcm9tICcuLi9wcml2YXRlL2NhY2hlJztcblxuY29uc3QgQlVGRkVSX1NJWkUgPSA4ICogMTAyNDtcbmNvbnN0IENUUkxfU09IID0gJ1xceDAxJztcbmNvbnN0IENUUkxfU09UID0gJ1xceDAyJztcbmNvbnN0IENUUkxfRVRYID0gJ1xceDAzJztcbmNvbnN0IENSID0gJ1xccic7XG5jb25zdCBMRiA9ICdcXG4nO1xuY29uc3QgQ1JMRiA9IGAke0NSfSR7TEZ9YDtcblxuY29uc3QgZmluZ2VycHJpbnRDYWNoZSA9IG5ldyBDYWNoZTxzdHJpbmc+KCk7XG5cbi8qKlxuICogRmlsZXMgYXJlIGZpbmdlcnByaW50ZWQgb25seSB0aGUgZmlyc3QgdGltZSB0aGV5IGFyZSBlbmNvdW50ZXJlZCwgdG8gc2F2ZVxuICogdGltZSBoYXNoaW5nIGxhcmdlIGZpbGVzLiBUaGlzIGZ1bmN0aW9uIGNsZWFycyB0aGlzIGNhY2hlLCBzaG91bGQgaXQgYmVcbiAqIG5lY2Vzc2FyeSBmb3Igc29tZSByZWFzb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckxhcmdlRmlsZUZpbmdlcnByaW50Q2FjaGUoKSB7XG4gIGZpbmdlcnByaW50Q2FjaGUuY2xlYXIoKTtcbn1cblxuLyoqXG4gKiBQcm9kdWNlcyBmaW5nZXJwcmludCBiYXNlZCBvbiB0aGUgY29udGVudHMgb2YgYSBzaW5nbGUgZmlsZSBvciBhbiBlbnRpcmUgZGlyZWN0b3J5IHRyZWUuXG4gKlxuICogTGluZSBlbmRpbmdzIGFyZSBjb252ZXJ0ZWQgZnJvbSBDUkxGIHRvIExGLlxuICpcbiAqIFRoZSBmaW5nZXJwcmludCB3aWxsIGFsc28gaW5jbHVkZTpcbiAqIDEuIEFuIGV4dHJhIHN0cmluZyBpZiBkZWZpbmVkIGluIGBvcHRpb25zLmV4dHJhYC5cbiAqIDIuIFRoZSBzeW1saW5rIGZvbGxvdyBtb2RlIHZhbHVlLlxuICpcbiAqIEBwYXJhbSBmaWxlT3JEaXJlY3RvcnkgVGhlIGRpcmVjdG9yeSBvciBmaWxlIHRvIGZpbmdlcnByaW50XG4gKiBAcGFyYW0gb3B0aW9ucyBGaW5nZXJwcmludGluZyBvcHRpb25zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5nZXJwcmludChmaWxlT3JEaXJlY3Rvcnk6IHN0cmluZywgb3B0aW9uczogRmluZ2VycHJpbnRPcHRpb25zID0geyB9KSB7XG4gIGNvbnN0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2Jyk7XG4gIF9oYXNoRmllbGQoaGFzaCwgJ29wdGlvbnMuZXh0cmEnLCBvcHRpb25zLmV4dHJhSGFzaCB8fCAnJyk7XG4gIGNvbnN0IGZvbGxvdyA9IG9wdGlvbnMuZm9sbG93IHx8IFN5bWxpbmtGb2xsb3dNb2RlLkVYVEVSTkFMO1xuICBfaGFzaEZpZWxkKGhhc2gsICdvcHRpb25zLmZvbGxvdycsIGZvbGxvdyk7XG5cbiAgLy8gUmVzb2x2ZSBzeW1saW5rcyBpbiB0aGUgaW5pdGlhbCBwYXRoIChmb3IgZXhhbXBsZSwgdGhlIHJvb3QgZGlyZWN0b3J5XG4gIC8vIG1pZ2h0IGJlIHN5bWxpbmtlZCkuIEl0J3MgaW1wb3J0YW50IHRoYXQgd2Uga25vdyB0aGUgYWJzb2x1dGUgcGF0aCwgc28gd2VcbiAgLy8gY2FuIGp1ZGdlIGlmIGZ1cnRoZXIgc3ltbGlua3MgaW5zaWRlIHRoZSB0YXJnZXQgZGlyZWN0b3J5IGFyZSB3aXRoaW4gdGhlXG4gIC8vIHRhcmdldCBvciBub3QgKGlmIHdlIGRvbid0IHJlc29sdmUsIHdlIHdvdWxkIHRlc3Qgdy5yLnQuIHRoZSB3cm9uZyBwYXRoKS5cbiAgZmlsZU9yRGlyZWN0b3J5ID0gZnMucmVhbHBhdGhTeW5jKGZpbGVPckRpcmVjdG9yeSk7XG5cbiAgY29uc3QgaXNEaXIgPSBmcy5zdGF0U3luYyhmaWxlT3JEaXJlY3RvcnkpLmlzRGlyZWN0b3J5KCk7XG4gIGNvbnN0IHJvb3REaXJlY3RvcnkgPSBpc0RpclxuICAgID8gZmlsZU9yRGlyZWN0b3J5XG4gICAgOiBwYXRoLmRpcm5hbWUoZmlsZU9yRGlyZWN0b3J5KTtcblxuICBjb25zdCBpZ25vcmVNb2RlID0gb3B0aW9ucy5pZ25vcmVNb2RlIHx8IElnbm9yZU1vZGUuR0xPQjtcbiAgaWYgKGlnbm9yZU1vZGUgIT0gSWdub3JlTW9kZS5HTE9CKSB7XG4gICAgX2hhc2hGaWVsZChoYXNoLCAnb3B0aW9ucy5pZ25vcmVNb2RlJywgaWdub3JlTW9kZSk7XG4gIH1cblxuICBjb25zdCBpZ25vcmVTdHJhdGVneSA9IElnbm9yZVN0cmF0ZWd5LmZyb21Db3B5T3B0aW9ucyhvcHRpb25zLCBmaWxlT3JEaXJlY3RvcnkpO1xuICBfcHJvY2Vzc0ZpbGVPckRpcmVjdG9yeShmaWxlT3JEaXJlY3RvcnksIGlzRGlyKTtcblxuICByZXR1cm4gaGFzaC5kaWdlc3QoJ2hleCcpO1xuXG4gIGZ1bmN0aW9uIF9wcm9jZXNzRmlsZU9yRGlyZWN0b3J5KHN5bWJvbGljUGF0aDogc3RyaW5nLCBpc1Jvb3REaXI6IGJvb2xlYW4gPSBmYWxzZSwgcmVhbFBhdGggPSBzeW1ib2xpY1BhdGgpIHtcbiAgICBpZiAoIWlzUm9vdERpciAmJiBpZ25vcmVTdHJhdGVneS5pZ25vcmVzKHN5bWJvbGljUGF0aCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdGF0ID0gZnMubHN0YXRTeW5jKHJlYWxQYXRoKTtcblxuICAgIC8vIFVzZSByZWxhdGl2ZSBwYXRoIGFzIGhhc2ggY29tcG9uZW50LiBOb3JtYWxpemUgaXQgd2l0aCBmb3J3YXJkIHNsYXNoZXMgdG8gZW5zdXJlXG4gICAgLy8gc2FtZSBoYXNoIG9uIFdpbmRvd3MgYW5kIExpbnV4LlxuICAgIGNvbnN0IGhhc2hDb21wb25lbnQgPSBwYXRoLnJlbGF0aXZlKGZpbGVPckRpcmVjdG9yeSwgc3ltYm9saWNQYXRoKS5yZXBsYWNlKC9cXFxcL2csICcvJyk7XG5cbiAgICBpZiAoc3RhdC5pc1N5bWJvbGljTGluaygpKSB7XG4gICAgICBjb25zdCBsaW5rVGFyZ2V0ID0gZnMucmVhZGxpbmtTeW5jKHJlYWxQYXRoKTtcbiAgICAgIGNvbnN0IHJlc29sdmVkTGlua1RhcmdldCA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUocmVhbFBhdGgpLCBsaW5rVGFyZ2V0KTtcbiAgICAgIGlmIChzaG91bGRGb2xsb3coZm9sbG93LCByb290RGlyZWN0b3J5LCByZXNvbHZlZExpbmtUYXJnZXQpKSB7XG4gICAgICAgIF9wcm9jZXNzRmlsZU9yRGlyZWN0b3J5KHN5bWJvbGljUGF0aCwgZmFsc2UsIHJlc29sdmVkTGlua1RhcmdldCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfaGFzaEZpZWxkKGhhc2gsIGBsaW5rOiR7aGFzaENvbXBvbmVudH1gLCBsaW5rVGFyZ2V0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKHN0YXQuaXNGaWxlKCkpIHtcbiAgICAgIF9oYXNoRmllbGQoaGFzaCwgYGZpbGU6JHtoYXNoQ29tcG9uZW50fWAsIGNvbnRlbnRGaW5nZXJwcmludChyZWFsUGF0aCkpO1xuICAgIH0gZWxzZSBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgZnMucmVhZGRpclN5bmMocmVhbFBhdGgpLnNvcnQoKSkge1xuICAgICAgICBfcHJvY2Vzc0ZpbGVPckRpcmVjdG9yeShwYXRoLmpvaW4oc3ltYm9saWNQYXRoLCBpdGVtKSwgZmFsc2UsIHBhdGguam9pbihyZWFsUGF0aCwgaXRlbSkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBoYXNoICR7c3ltYm9saWNQYXRofTogaXQgaXMgbmVpdGhlciBhIGZpbGUgbm9yIGEgZGlyZWN0b3J5YCk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250ZW50RmluZ2VycHJpbnQoZmlsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgLy8gT24gd2luZG93cyBpdCdzIHBhcnRpY3VsYXJseSBpbXBvcnRhbnQgdG8gcGFzcyBiaWdpbnQ6IHRydWUgdG8gZW5zdXJlIHRoYXRcbiAgLy8gZmxvYXRpbmctcG9pbnQgaW5hY2N1cmFjaWVzIGRvbid0IHJlc3VsdCBpbiBmYWxzZSBtYXRjaGVzLiAoIHNlZVxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbm9kZWpzL25vZGUvaXNzdWVzLzEyMTE1I2lzc3VlY29tbWVudC00Mzg3NDEyMTIgKVxuICAvL1xuICAvLyBOb3RlIHRoYXQgZXZlbiBpZiB3ZSBkbyBnZXQgYSBpbm9kZSBjb2xsaXNpb24gc29tZWhvdywgaXQncyB1bmxpa2VseSB0aGF0XG4gIC8vIGJvdGggbXRpbWUgYW5kIHNpemUgd291bGQgaGF2ZSBhIGZhbHNlLXBvc2l0aXZlIGFzIHdlbGwuXG5cbiAgLy8gV2UgYWxzbyBtdXN0IHN1cHByZXNzIHR5cGVzY3JpcHQgdHlwZWNoZWNrcyBhcyB3ZSBhcmUgdXNpbmcgYSB2ZXJzaW9uIG9mXG4gIC8vIEB0eXBlcy9ub2RlIHRoYXQgb25seSBzdXBwb3J0cyBub2RlIDEwIGRlY2xhcmF0aW9ucy5cbiAgY29uc3Qgc3RhdHMgPSBmcy5zdGF0U3luYyhmaWxlLCB7IGJpZ2ludDogdHJ1ZSB9KTtcbiAgY29uc3QgY2FjaGVLZXkgPSBKU09OLnN0cmluZ2lmeSh7XG4gICAgbXRpbWVfdW5peDogc3RhdHMubXRpbWUudG9VVENTdHJpbmcoKSxcbiAgICBtdGltZV9tczogc3RhdHMubXRpbWVNcy50b1N0cmluZygpLFxuICAgIGlub2RlOiBzdGF0cy5pbm8udG9TdHJpbmcoKSxcbiAgICBzaXplOiBzdGF0cy5zaXplLnRvU3RyaW5nKCksXG4gIH0pO1xuXG4gIHJldHVybiBmaW5nZXJwcmludENhY2hlLm9idGFpbihjYWNoZUtleSwgKCkgPT4gY29udGVudEZpbmdlcnByaW50TWlzcyhmaWxlKSk7XG59XG5cbmZ1bmN0aW9uIGNvbnRlbnRGaW5nZXJwcmludE1pc3MoZmlsZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgaGFzaCA9IGNyeXB0by5jcmVhdGVIYXNoKCdzaGEyNTYnKTtcbiAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmFsbG9jKEJVRkZFUl9TSVpFKTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWJpdHdpc2VcbiAgY29uc3QgZmQgPSBmcy5vcGVuU3luYyhmaWxlLCBmcy5jb25zdGFudHMuT19EU1lOQyB8IGZzLmNvbnN0YW50cy5PX1JET05MWSB8IGZzLmNvbnN0YW50cy5PX1NZTkMpO1xuICBsZXQgc2l6ZSA9IDA7XG4gIGxldCBpc0JpbmFyeSA9IGZhbHNlO1xuICBsZXQgbGFzdFN0ciA9ICcnO1xuICBsZXQgcmVhZCA9IDA7XG4gIHRyeSB7XG4gICAgd2hpbGUgKChyZWFkID0gZnMucmVhZFN5bmMoZmQsIGJ1ZmZlciwgMCwgQlVGRkVSX1NJWkUsIG51bGwpKSAhPT0gMCkge1xuICAgICAgY29uc3Qgc2xpY2VkQnVmZmVyID0gYnVmZmVyLnNsaWNlKDAsIHJlYWQpO1xuXG4gICAgICAvLyBEZXRlY3QgaWYgZmlsZSBpcyBiaW5hcnkgYnkgY2hlY2tpbmcgdGhlIGZpcnN0IDhrIGJ5dGVzIGZvciB0aGVcbiAgICAgIC8vIG51bGwgY2hhcmFjdGVyIChnaXQgbGlrZSBpbXBsZW1lbnRhdGlvbilcbiAgICAgIGlmIChzaXplID09PSAwKSB7XG4gICAgICAgIGlzQmluYXJ5ID0gc2xpY2VkQnVmZmVyLmluZGV4T2YoMCkgIT09IC0xO1xuICAgICAgfVxuXG4gICAgICBsZXQgZGF0YUJ1ZmZlciA9IHNsaWNlZEJ1ZmZlcjtcbiAgICAgIGlmICghaXNCaW5hcnkpIHsgLy8gTGluZSBlbmRpbmdzIG5vcm1hbGl6YXRpb24gKENSTEYgLT4gTEYpXG4gICAgICAgIGNvbnN0IHN0ciA9IGJ1ZmZlci5zbGljZSgwLCByZWFkKS50b1N0cmluZygpO1xuXG4gICAgICAgIC8vIFdlIGFyZSBnb2luZyB0byBub3JtYWxpemUgbGluZSBlbmRpbmdzIHRvIExGLiBTbyBpZiB0aGUgY3VycmVudFxuICAgICAgICAvLyBidWZmZXIgZW5kcyB3aXRoIENSLCBpdCBjb3VsZCBiZSB0aGF0IHRoZSBuZXh0IG9uZSBzdGFydHMgd2l0aFxuICAgICAgICAvLyBMRiBzbyB3ZSBuZWVkIHRvIHNhdmUgaXQgZm9yIGxhdGVyIHVzZS5cbiAgICAgICAgaWYgKG5ldyBSZWdFeHAoYCR7Q1J9JGApLnRlc3Qoc3RyKSkge1xuICAgICAgICAgIGxhc3RTdHIgKz0gc3RyO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IGxhc3RTdHIgKyBzdHI7XG4gICAgICAgIGNvbnN0IG5vcm1hbGl6ZWREYXRhID0gZGF0YS5yZXBsYWNlKG5ldyBSZWdFeHAoQ1JMRiwgJ2cnKSwgTEYpO1xuICAgICAgICBkYXRhQnVmZmVyID0gQnVmZmVyLmZyb20obm9ybWFsaXplZERhdGEpO1xuICAgICAgICBsYXN0U3RyID0gJyc7XG4gICAgICB9XG5cbiAgICAgIHNpemUgKz0gZGF0YUJ1ZmZlci5sZW5ndGg7XG4gICAgICBoYXNoLnVwZGF0ZShkYXRhQnVmZmVyKTtcbiAgICB9XG5cbiAgICBpZiAobGFzdFN0cikge1xuICAgICAgaGFzaC51cGRhdGUoQnVmZmVyLmZyb20obGFzdFN0cikpO1xuICAgIH1cbiAgfSBmaW5hbGx5IHtcbiAgICBmcy5jbG9zZVN5bmMoZmQpO1xuICB9XG4gIHJldHVybiBgJHtzaXplfToke2hhc2guZGlnZXN0KCdoZXgnKX1gO1xufVxuXG5mdW5jdGlvbiBfaGFzaEZpZWxkKGhhc2g6IGNyeXB0by5IYXNoLCBoZWFkZXI6IHN0cmluZywgdmFsdWU6IHN0cmluZyB8IEJ1ZmZlciB8IERhdGFWaWV3KSB7XG4gIGhhc2gudXBkYXRlKENUUkxfU09IKS51cGRhdGUoaGVhZGVyKS51cGRhdGUoQ1RSTF9TT1QpLnVwZGF0ZSh2YWx1ZSkudXBkYXRlKENUUkxfRVRYKTtcbn1cbiJdfQ==