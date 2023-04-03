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
            if (utils_1.shouldFollow(follow, rootDirectory, resolvedLinkTarget)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZ2VycHJpbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmaW5nZXJwcmludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpQ0FBaUM7QUFDakMseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUM3QixxQ0FBMEM7QUFDMUMsdUNBQThFO0FBQzlFLG1DQUF1QztBQUN2Qyw0Q0FBeUM7QUFFekMsTUFBTSxXQUFXLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztBQUM3QixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUM7QUFDeEIsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQztBQUN4QixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDaEIsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLE1BQU0sSUFBSSxHQUFHLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxDQUFDO0FBRTFCLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxhQUFLLEVBQVUsQ0FBQztBQUU3Qzs7OztHQUlHO0FBQ0gsU0FBZ0IsOEJBQThCO0lBQzVDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0FBQzNCLENBQUM7QUFGRCx3RUFFQztBQUVEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFDLGVBQXVCLEVBQUUsVUFBOEIsRUFBRztJQUNwRixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFLE9BQU8sQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDLENBQUM7SUFDM0QsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSwyQkFBaUIsQ0FBQyxRQUFRLENBQUM7SUFDNUQsVUFBVSxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUUzQyx3RUFBd0U7SUFDeEUs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SSxVQUFVLENBQUMsTUFBTSxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDekI7UUFFRCxJQUFJLE9BQU8sRUFBRTtZQUNYLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ25DO0tBQ0Y7WUFBUztRQUNSLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7S0FDbEI7SUFDRCxPQUFPLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztBQUN6QyxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsSUFBaUIsRUFBRSxNQUFjLEVBQUUsS0FBaUM7SUFDdEYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNyeXB0byBmcm9tICdjcnlwdG8nO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IElnbm9yZVN0cmF0ZWd5IH0gZnJvbSAnLi9pZ25vcmUnO1xuaW1wb3J0IHsgRmluZ2VycHJpbnRPcHRpb25zLCBJZ25vcmVNb2RlLCBTeW1saW5rRm9sbG93TW9kZSB9IGZyb20gJy4vb3B0aW9ucyc7XG5pbXBvcnQgeyBzaG91bGRGb2xsb3cgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IENhY2hlIH0gZnJvbSAnLi4vcHJpdmF0ZS9jYWNoZSc7XG5cbmNvbnN0IEJVRkZFUl9TSVpFID0gOCAqIDEwMjQ7XG5jb25zdCBDVFJMX1NPSCA9ICdcXHgwMSc7XG5jb25zdCBDVFJMX1NPVCA9ICdcXHgwMic7XG5jb25zdCBDVFJMX0VUWCA9ICdcXHgwMyc7XG5jb25zdCBDUiA9ICdcXHInO1xuY29uc3QgTEYgPSAnXFxuJztcbmNvbnN0IENSTEYgPSBgJHtDUn0ke0xGfWA7XG5cbmNvbnN0IGZpbmdlcnByaW50Q2FjaGUgPSBuZXcgQ2FjaGU8c3RyaW5nPigpO1xuXG4vKipcbiAqIEZpbGVzIGFyZSBmaW5nZXJwcmludGVkIG9ubHkgdGhlIGZpcnN0IHRpbWUgdGhleSBhcmUgZW5jb3VudGVyZWQsIHRvIHNhdmVcbiAqIHRpbWUgaGFzaGluZyBsYXJnZSBmaWxlcy4gVGhpcyBmdW5jdGlvbiBjbGVhcnMgdGhpcyBjYWNoZSwgc2hvdWxkIGl0IGJlXG4gKiBuZWNlc3NhcnkgZm9yIHNvbWUgcmVhc29uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJMYXJnZUZpbGVGaW5nZXJwcmludENhY2hlKCkge1xuICBmaW5nZXJwcmludENhY2hlLmNsZWFyKCk7XG59XG5cbi8qKlxuICogUHJvZHVjZXMgZmluZ2VycHJpbnQgYmFzZWQgb24gdGhlIGNvbnRlbnRzIG9mIGEgc2luZ2xlIGZpbGUgb3IgYW4gZW50aXJlIGRpcmVjdG9yeSB0cmVlLlxuICpcbiAqIExpbmUgZW5kaW5ncyBhcmUgY29udmVydGVkIGZyb20gQ1JMRiB0byBMRi5cbiAqXG4gKiBUaGUgZmluZ2VycHJpbnQgd2lsbCBhbHNvIGluY2x1ZGU6XG4gKiAxLiBBbiBleHRyYSBzdHJpbmcgaWYgZGVmaW5lZCBpbiBgb3B0aW9ucy5leHRyYWAuXG4gKiAyLiBUaGUgc3ltbGluayBmb2xsb3cgbW9kZSB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0gZmlsZU9yRGlyZWN0b3J5IFRoZSBkaXJlY3Rvcnkgb3IgZmlsZSB0byBmaW5nZXJwcmludFxuICogQHBhcmFtIG9wdGlvbnMgRmluZ2VycHJpbnRpbmcgb3B0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZ2VycHJpbnQoZmlsZU9yRGlyZWN0b3J5OiBzdHJpbmcsIG9wdGlvbnM6IEZpbmdlcnByaW50T3B0aW9ucyA9IHsgfSkge1xuICBjb25zdCBoYXNoID0gY3J5cHRvLmNyZWF0ZUhhc2goJ3NoYTI1NicpO1xuICBfaGFzaEZpZWxkKGhhc2gsICdvcHRpb25zLmV4dHJhJywgb3B0aW9ucy5leHRyYUhhc2ggfHwgJycpO1xuICBjb25zdCBmb2xsb3cgPSBvcHRpb25zLmZvbGxvdyB8fCBTeW1saW5rRm9sbG93TW9kZS5FWFRFUk5BTDtcbiAgX2hhc2hGaWVsZChoYXNoLCAnb3B0aW9ucy5mb2xsb3cnLCBmb2xsb3cpO1xuXG4gIC8vIFJlc29sdmUgc3ltbGlua3MgaW4gdGhlIGluaXRpYWwgcGF0aCAoZm9yIGV4YW1wbGUsIHRoZSByb290IGRpcmVjdG9yeVxuICAvLyBtaWdodCBiZSBzeW1saW5rZWQpLiBJdCdzIGltcG9ydGFudCB0aGF0IHdlIGtub3cgdGhlIGFic29sdXRlIHBhdGgsIHNvIHdlXG4gIC8vIGNhbiBqdWRnZSBpZiBmdXJ0aGVyIHN5bWxpbmtzIGluc2lkZSB0aGUgdGFyZ2V0IGRpcmVjdG9yeSBhcmUgd2l0aGluIHRoZVxuICAvLyB0YXJnZXQgb3Igbm90IChpZiB3ZSBkb24ndCByZXNvbHZlLCB3ZSB3b3VsZCB0ZXN0IHcuci50LiB0aGUgd3JvbmcgcGF0aCkuXG4gIGZpbGVPckRpcmVjdG9yeSA9IGZzLnJlYWxwYXRoU3luYyhmaWxlT3JEaXJlY3RvcnkpO1xuXG4gIGNvbnN0IGlzRGlyID0gZnMuc3RhdFN5bmMoZmlsZU9yRGlyZWN0b3J5KS5pc0RpcmVjdG9yeSgpO1xuICBjb25zdCByb290RGlyZWN0b3J5ID0gaXNEaXJcbiAgICA/IGZpbGVPckRpcmVjdG9yeVxuICAgIDogcGF0aC5kaXJuYW1lKGZpbGVPckRpcmVjdG9yeSk7XG5cbiAgY29uc3QgaWdub3JlTW9kZSA9IG9wdGlvbnMuaWdub3JlTW9kZSB8fCBJZ25vcmVNb2RlLkdMT0I7XG4gIGlmIChpZ25vcmVNb2RlICE9IElnbm9yZU1vZGUuR0xPQikge1xuICAgIF9oYXNoRmllbGQoaGFzaCwgJ29wdGlvbnMuaWdub3JlTW9kZScsIGlnbm9yZU1vZGUpO1xuICB9XG5cbiAgY29uc3QgaWdub3JlU3RyYXRlZ3kgPSBJZ25vcmVTdHJhdGVneS5mcm9tQ29weU9wdGlvbnMob3B0aW9ucywgZmlsZU9yRGlyZWN0b3J5KTtcbiAgX3Byb2Nlc3NGaWxlT3JEaXJlY3RvcnkoZmlsZU9yRGlyZWN0b3J5LCBpc0Rpcik7XG5cbiAgcmV0dXJuIGhhc2guZGlnZXN0KCdoZXgnKTtcblxuICBmdW5jdGlvbiBfcHJvY2Vzc0ZpbGVPckRpcmVjdG9yeShzeW1ib2xpY1BhdGg6IHN0cmluZywgaXNSb290RGlyOiBib29sZWFuID0gZmFsc2UsIHJlYWxQYXRoID0gc3ltYm9saWNQYXRoKSB7XG4gICAgaWYgKCFpc1Jvb3REaXIgJiYgaWdub3JlU3RyYXRlZ3kuaWdub3JlcyhzeW1ib2xpY1BhdGgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhdCA9IGZzLmxzdGF0U3luYyhyZWFsUGF0aCk7XG5cbiAgICAvLyBVc2UgcmVsYXRpdmUgcGF0aCBhcyBoYXNoIGNvbXBvbmVudC4gTm9ybWFsaXplIGl0IHdpdGggZm9yd2FyZCBzbGFzaGVzIHRvIGVuc3VyZVxuICAgIC8vIHNhbWUgaGFzaCBvbiBXaW5kb3dzIGFuZCBMaW51eC5cbiAgICBjb25zdCBoYXNoQ29tcG9uZW50ID0gcGF0aC5yZWxhdGl2ZShmaWxlT3JEaXJlY3RvcnksIHN5bWJvbGljUGF0aCkucmVwbGFjZSgvXFxcXC9nLCAnLycpO1xuXG4gICAgaWYgKHN0YXQuaXNTeW1ib2xpY0xpbmsoKSkge1xuICAgICAgY29uc3QgbGlua1RhcmdldCA9IGZzLnJlYWRsaW5rU3luYyhyZWFsUGF0aCk7XG4gICAgICBjb25zdCByZXNvbHZlZExpbmtUYXJnZXQgPSBwYXRoLnJlc29sdmUocGF0aC5kaXJuYW1lKHJlYWxQYXRoKSwgbGlua1RhcmdldCk7XG4gICAgICBpZiAoc2hvdWxkRm9sbG93KGZvbGxvdywgcm9vdERpcmVjdG9yeSwgcmVzb2x2ZWRMaW5rVGFyZ2V0KSkge1xuICAgICAgICBfcHJvY2Vzc0ZpbGVPckRpcmVjdG9yeShzeW1ib2xpY1BhdGgsIGZhbHNlLCByZXNvbHZlZExpbmtUYXJnZXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX2hhc2hGaWVsZChoYXNoLCBgbGluazoke2hhc2hDb21wb25lbnR9YCwgbGlua1RhcmdldCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChzdGF0LmlzRmlsZSgpKSB7XG4gICAgICBfaGFzaEZpZWxkKGhhc2gsIGBmaWxlOiR7aGFzaENvbXBvbmVudH1gLCBjb250ZW50RmluZ2VycHJpbnQocmVhbFBhdGgpKTtcbiAgICB9IGVsc2UgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgZm9yIChjb25zdCBpdGVtIG9mIGZzLnJlYWRkaXJTeW5jKHJlYWxQYXRoKS5zb3J0KCkpIHtcbiAgICAgICAgX3Byb2Nlc3NGaWxlT3JEaXJlY3RvcnkocGF0aC5qb2luKHN5bWJvbGljUGF0aCwgaXRlbSksIGZhbHNlLCBwYXRoLmpvaW4ocmVhbFBhdGgsIGl0ZW0pKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gaGFzaCAke3N5bWJvbGljUGF0aH06IGl0IGlzIG5laXRoZXIgYSBmaWxlIG5vciBhIGRpcmVjdG9yeWApO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udGVudEZpbmdlcnByaW50KGZpbGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIE9uIHdpbmRvd3MgaXQncyBwYXJ0aWN1bGFybHkgaW1wb3J0YW50IHRvIHBhc3MgYmlnaW50OiB0cnVlIHRvIGVuc3VyZSB0aGF0XG4gIC8vIGZsb2F0aW5nLXBvaW50IGluYWNjdXJhY2llcyBkb24ndCByZXN1bHQgaW4gZmFsc2UgbWF0Y2hlcy4gKCBzZWVcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL25vZGVqcy9ub2RlL2lzc3Vlcy8xMjExNSNpc3N1ZWNvbW1lbnQtNDM4NzQxMjEyIClcbiAgLy9cbiAgLy8gTm90ZSB0aGF0IGV2ZW4gaWYgd2UgZG8gZ2V0IGEgaW5vZGUgY29sbGlzaW9uIHNvbWVob3csIGl0J3MgdW5saWtlbHkgdGhhdFxuICAvLyBib3RoIG10aW1lIGFuZCBzaXplIHdvdWxkIGhhdmUgYSBmYWxzZS1wb3NpdGl2ZSBhcyB3ZWxsLlxuXG4gIC8vIFdlIGFsc28gbXVzdCBzdXBwcmVzcyB0eXBlc2NyaXB0IHR5cGVjaGVja3MgYXMgd2UgYXJlIHVzaW5nIGEgdmVyc2lvbiBvZlxuICAvLyBAdHlwZXMvbm9kZSB0aGF0IG9ubHkgc3VwcG9ydHMgbm9kZSAxMCBkZWNsYXJhdGlvbnMuXG4gIGNvbnN0IHN0YXRzID0gZnMuc3RhdFN5bmMoZmlsZSwgeyBiaWdpbnQ6IHRydWUgfSk7XG4gIGNvbnN0IGNhY2hlS2V5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgIG10aW1lX3VuaXg6IHN0YXRzLm10aW1lLnRvVVRDU3RyaW5nKCksXG4gICAgbXRpbWVfbXM6IHN0YXRzLm10aW1lTXMudG9TdHJpbmcoKSxcbiAgICBpbm9kZTogc3RhdHMuaW5vLnRvU3RyaW5nKCksXG4gICAgc2l6ZTogc3RhdHMuc2l6ZS50b1N0cmluZygpLFxuICB9KTtcblxuICByZXR1cm4gZmluZ2VycHJpbnRDYWNoZS5vYnRhaW4oY2FjaGVLZXksICgpID0+IGNvbnRlbnRGaW5nZXJwcmludE1pc3MoZmlsZSkpO1xufVxuXG5mdW5jdGlvbiBjb250ZW50RmluZ2VycHJpbnRNaXNzKGZpbGU6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGhhc2ggPSBjcnlwdG8uY3JlYXRlSGFzaCgnc2hhMjU2Jyk7XG4gIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5hbGxvYyhCVUZGRVJfU0laRSk7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1iaXR3aXNlXG4gIGNvbnN0IGZkID0gZnMub3BlblN5bmMoZmlsZSwgZnMuY29uc3RhbnRzLk9fRFNZTkMgfCBmcy5jb25zdGFudHMuT19SRE9OTFkgfCBmcy5jb25zdGFudHMuT19TWU5DKTtcbiAgbGV0IHNpemUgPSAwO1xuICBsZXQgaXNCaW5hcnkgPSBmYWxzZTtcbiAgbGV0IGxhc3RTdHIgPSAnJztcbiAgbGV0IHJlYWQgPSAwO1xuICB0cnkge1xuICAgIHdoaWxlICgocmVhZCA9IGZzLnJlYWRTeW5jKGZkLCBidWZmZXIsIDAsIEJVRkZFUl9TSVpFLCBudWxsKSkgIT09IDApIHtcbiAgICAgIGNvbnN0IHNsaWNlZEJ1ZmZlciA9IGJ1ZmZlci5zbGljZSgwLCByZWFkKTtcblxuICAgICAgLy8gRGV0ZWN0IGlmIGZpbGUgaXMgYmluYXJ5IGJ5IGNoZWNraW5nIHRoZSBmaXJzdCA4ayBieXRlcyBmb3IgdGhlXG4gICAgICAvLyBudWxsIGNoYXJhY3RlciAoZ2l0IGxpa2UgaW1wbGVtZW50YXRpb24pXG4gICAgICBpZiAoc2l6ZSA9PT0gMCkge1xuICAgICAgICBpc0JpbmFyeSA9IHNsaWNlZEJ1ZmZlci5pbmRleE9mKDApICE9PSAtMTtcbiAgICAgIH1cblxuICAgICAgbGV0IGRhdGFCdWZmZXIgPSBzbGljZWRCdWZmZXI7XG4gICAgICBpZiAoIWlzQmluYXJ5KSB7IC8vIExpbmUgZW5kaW5ncyBub3JtYWxpemF0aW9uIChDUkxGIC0+IExGKVxuICAgICAgICBjb25zdCBzdHIgPSBidWZmZXIuc2xpY2UoMCwgcmVhZCkudG9TdHJpbmcoKTtcblxuICAgICAgICAvLyBXZSBhcmUgZ29pbmcgdG8gbm9ybWFsaXplIGxpbmUgZW5kaW5ncyB0byBMRi4gU28gaWYgdGhlIGN1cnJlbnRcbiAgICAgICAgLy8gYnVmZmVyIGVuZHMgd2l0aCBDUiwgaXQgY291bGQgYmUgdGhhdCB0aGUgbmV4dCBvbmUgc3RhcnRzIHdpdGhcbiAgICAgICAgLy8gTEYgc28gd2UgbmVlZCB0byBzYXZlIGl0IGZvciBsYXRlciB1c2UuXG4gICAgICAgIGlmIChuZXcgUmVnRXhwKGAke0NSfSRgKS50ZXN0KHN0cikpIHtcbiAgICAgICAgICBsYXN0U3RyICs9IHN0cjtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGEgPSBsYXN0U3RyICsgc3RyO1xuICAgICAgICBjb25zdCBub3JtYWxpemVkRGF0YSA9IGRhdGEucmVwbGFjZShuZXcgUmVnRXhwKENSTEYsICdnJyksIExGKTtcbiAgICAgICAgZGF0YUJ1ZmZlciA9IEJ1ZmZlci5mcm9tKG5vcm1hbGl6ZWREYXRhKTtcbiAgICAgICAgbGFzdFN0ciA9ICcnO1xuICAgICAgfVxuXG4gICAgICBzaXplICs9IGRhdGFCdWZmZXIubGVuZ3RoO1xuICAgICAgaGFzaC51cGRhdGUoZGF0YUJ1ZmZlcik7XG4gICAgfVxuXG4gICAgaWYgKGxhc3RTdHIpIHtcbiAgICAgIGhhc2gudXBkYXRlKEJ1ZmZlci5mcm9tKGxhc3RTdHIpKTtcbiAgICB9XG4gIH0gZmluYWxseSB7XG4gICAgZnMuY2xvc2VTeW5jKGZkKTtcbiAgfVxuICByZXR1cm4gYCR7c2l6ZX06JHtoYXNoLmRpZ2VzdCgnaGV4Jyl9YDtcbn1cblxuZnVuY3Rpb24gX2hhc2hGaWVsZChoYXNoOiBjcnlwdG8uSGFzaCwgaGVhZGVyOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcgfCBCdWZmZXIgfCBEYXRhVmlldykge1xuICBoYXNoLnVwZGF0ZShDVFJMX1NPSCkudXBkYXRlKGhlYWRlcikudXBkYXRlKENUUkxfU09UKS51cGRhdGUodmFsdWUpLnVwZGF0ZShDVFJMX0VUWCk7XG59XG4iXX0=