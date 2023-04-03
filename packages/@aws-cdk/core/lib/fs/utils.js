"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shouldFollow = void 0;
const fs = require("fs");
const path = require("path");
const options_1 = require("./options");
/**
 * Determines whether a symlink should be followed or not, based on a FollowMode.
 *
 * @param mode       the FollowMode.
 * @param sourceRoot the root of the source tree.
 * @param realPath   the real path of the target of the symlink.
 *
 * @returns true if the link should be followed.
 */
function shouldFollow(mode, sourceRoot, realPath) {
    switch (mode) {
        case options_1.SymlinkFollowMode.ALWAYS:
            return fs.existsSync(realPath);
        case options_1.SymlinkFollowMode.EXTERNAL:
            return !_isInternal() && fs.existsSync(realPath);
        case options_1.SymlinkFollowMode.BLOCK_EXTERNAL:
            return _isInternal() && fs.existsSync(realPath);
        case options_1.SymlinkFollowMode.NEVER:
            return false;
        default:
            throw new Error(`Unsupported FollowMode: ${mode}`);
    }
    function _isInternal() {
        return path.resolve(realPath).startsWith(path.resolve(sourceRoot));
    }
}
exports.shouldFollow = shouldFollow;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ1dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLHVDQUE4QztBQUU5Qzs7Ozs7Ozs7R0FRRztBQUNILFNBQWdCLFlBQVksQ0FBQyxJQUF1QixFQUFFLFVBQWtCLEVBQUUsUUFBZ0I7SUFDeEYsUUFBUSxJQUFJLEVBQUU7UUFDWixLQUFLLDJCQUFpQixDQUFDLE1BQU07WUFDM0IsT0FBTyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLEtBQUssMkJBQWlCLENBQUMsUUFBUTtZQUM3QixPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRCxLQUFLLDJCQUFpQixDQUFDLGNBQWM7WUFDbkMsT0FBTyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2xELEtBQUssMkJBQWlCLENBQUMsS0FBSztZQUMxQixPQUFPLEtBQUssQ0FBQztRQUNmO1lBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUN0RDtJQUVELFNBQVMsV0FBVztRQUNsQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDO0FBQ0gsQ0FBQztBQWpCRCxvQ0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU3ltbGlua0ZvbGxvd01vZGUgfSBmcm9tICcuL29wdGlvbnMnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciBhIHN5bWxpbmsgc2hvdWxkIGJlIGZvbGxvd2VkIG9yIG5vdCwgYmFzZWQgb24gYSBGb2xsb3dNb2RlLlxuICpcbiAqIEBwYXJhbSBtb2RlICAgICAgIHRoZSBGb2xsb3dNb2RlLlxuICogQHBhcmFtIHNvdXJjZVJvb3QgdGhlIHJvb3Qgb2YgdGhlIHNvdXJjZSB0cmVlLlxuICogQHBhcmFtIHJlYWxQYXRoICAgdGhlIHJlYWwgcGF0aCBvZiB0aGUgdGFyZ2V0IG9mIHRoZSBzeW1saW5rLlxuICpcbiAqIEByZXR1cm5zIHRydWUgaWYgdGhlIGxpbmsgc2hvdWxkIGJlIGZvbGxvd2VkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkRm9sbG93KG1vZGU6IFN5bWxpbmtGb2xsb3dNb2RlLCBzb3VyY2VSb290OiBzdHJpbmcsIHJlYWxQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgc3dpdGNoIChtb2RlKSB7XG4gICAgY2FzZSBTeW1saW5rRm9sbG93TW9kZS5BTFdBWVM6XG4gICAgICByZXR1cm4gZnMuZXhpc3RzU3luYyhyZWFsUGF0aCk7XG4gICAgY2FzZSBTeW1saW5rRm9sbG93TW9kZS5FWFRFUk5BTDpcbiAgICAgIHJldHVybiAhX2lzSW50ZXJuYWwoKSAmJiBmcy5leGlzdHNTeW5jKHJlYWxQYXRoKTtcbiAgICBjYXNlIFN5bWxpbmtGb2xsb3dNb2RlLkJMT0NLX0VYVEVSTkFMOlxuICAgICAgcmV0dXJuIF9pc0ludGVybmFsKCkgJiYgZnMuZXhpc3RzU3luYyhyZWFsUGF0aCk7XG4gICAgY2FzZSBTeW1saW5rRm9sbG93TW9kZS5ORVZFUjpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbnN1cHBvcnRlZCBGb2xsb3dNb2RlOiAke21vZGV9YCk7XG4gIH1cblxuICBmdW5jdGlvbiBfaXNJbnRlcm5hbCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHJlYWxQYXRoKS5zdGFydHNXaXRoKHBhdGgucmVzb2x2ZShzb3VyY2VSb290KSk7XG4gIH1cbn1cbiJdfQ==