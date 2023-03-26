"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowMode = void 0;
/**
 * Symlink follow mode.
 * @deprecated see `core.SymlinkFollowMode`
 */
var FollowMode;
(function (FollowMode) {
    /**
     * Never follow symlinks.
     */
    FollowMode["NEVER"] = "never";
    /**
     * Materialize all symlinks, whether they are internal or external to the source directory.
     */
    FollowMode["ALWAYS"] = "always";
    /**
     * Only follows symlinks that are external to the source directory.
     */
    FollowMode["EXTERNAL"] = "external";
    // ----------------- TODO::::::::::::::::::::::::::::::::::::::::::::
    /**
     * Forbids source from having any symlinks pointing outside of the source
     * tree.
     *
     * This is the safest mode of operation as it ensures that copy operations
     * won't materialize files from the user's file system. Internal symlinks are
     * not followed.
     *
     * If the copy operation runs into an external symlink, it will fail.
     */
    FollowMode["BLOCK_EXTERNAL"] = "internal-only";
})(FollowMode = exports.FollowMode || (exports.FollowMode = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9sbG93LW1vZGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJmb2xsb3ctbW9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQTs7O0dBR0c7QUFDSCxJQUFZLFVBNEJYO0FBNUJELFdBQVksVUFBVTtJQUNwQjs7T0FFRztJQUNILDZCQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILCtCQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsbUNBQXFCLENBQUE7SUFFckIscUVBQXFFO0lBQ3JFOzs7Ozs7Ozs7T0FTRztJQUNILDhDQUFnQyxDQUFBO0FBQ2xDLENBQUMsRUE1QlcsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUE0QnJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBTeW1saW5rIGZvbGxvdyBtb2RlLlxuICogQGRlcHJlY2F0ZWQgc2VlIGBjb3JlLlN5bWxpbmtGb2xsb3dNb2RlYFxuICovXG5leHBvcnQgZW51bSBGb2xsb3dNb2RlIHtcbiAgLyoqXG4gICAqIE5ldmVyIGZvbGxvdyBzeW1saW5rcy5cbiAgICovXG4gIE5FVkVSID0gJ25ldmVyJyxcblxuICAvKipcbiAgICogTWF0ZXJpYWxpemUgYWxsIHN5bWxpbmtzLCB3aGV0aGVyIHRoZXkgYXJlIGludGVybmFsIG9yIGV4dGVybmFsIHRvIHRoZSBzb3VyY2UgZGlyZWN0b3J5LlxuICAgKi9cbiAgQUxXQVlTID0gJ2Fsd2F5cycsXG5cbiAgLyoqXG4gICAqIE9ubHkgZm9sbG93cyBzeW1saW5rcyB0aGF0IGFyZSBleHRlcm5hbCB0byB0aGUgc291cmNlIGRpcmVjdG9yeS5cbiAgICovXG4gIEVYVEVSTkFMID0gJ2V4dGVybmFsJyxcblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLSBUT0RPOjo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6OjpcbiAgLyoqXG4gICAqIEZvcmJpZHMgc291cmNlIGZyb20gaGF2aW5nIGFueSBzeW1saW5rcyBwb2ludGluZyBvdXRzaWRlIG9mIHRoZSBzb3VyY2VcbiAgICogdHJlZS5cbiAgICpcbiAgICogVGhpcyBpcyB0aGUgc2FmZXN0IG1vZGUgb2Ygb3BlcmF0aW9uIGFzIGl0IGVuc3VyZXMgdGhhdCBjb3B5IG9wZXJhdGlvbnNcbiAgICogd29uJ3QgbWF0ZXJpYWxpemUgZmlsZXMgZnJvbSB0aGUgdXNlcidzIGZpbGUgc3lzdGVtLiBJbnRlcm5hbCBzeW1saW5rcyBhcmVcbiAgICogbm90IGZvbGxvd2VkLlxuICAgKlxuICAgKiBJZiB0aGUgY29weSBvcGVyYXRpb24gcnVucyBpbnRvIGFuIGV4dGVybmFsIHN5bWxpbmssIGl0IHdpbGwgZmFpbC5cbiAgICovXG4gIEJMT0NLX0VYVEVSTkFMID0gJ2ludGVybmFsLW9ubHknLFxufVxuIl19