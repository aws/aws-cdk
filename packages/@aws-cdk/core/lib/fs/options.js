"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnoreMode = exports.SymlinkFollowMode = void 0;
/**
 * Determines how symlinks are followed.
 */
var SymlinkFollowMode;
(function (SymlinkFollowMode) {
    /**
     * Never follow symlinks.
     */
    SymlinkFollowMode["NEVER"] = "never";
    /**
     * Materialize all symlinks, whether they are internal or external to the source directory.
     */
    SymlinkFollowMode["ALWAYS"] = "always";
    /**
     * Only follows symlinks that are external to the source directory.
     */
    SymlinkFollowMode["EXTERNAL"] = "external";
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
    SymlinkFollowMode["BLOCK_EXTERNAL"] = "internal-only";
})(SymlinkFollowMode = exports.SymlinkFollowMode || (exports.SymlinkFollowMode = {}));
/**
 * Determines the ignore behavior to use.
 */
var IgnoreMode;
(function (IgnoreMode) {
    /**
     * Ignores file paths based on simple glob patterns.
     *
     * This is the default for file assets.
     *
     * It is also the default for Docker image assets, unless the '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport'
     * context flag is set.
     */
    IgnoreMode["GLOB"] = "glob";
    /**
     * Ignores file paths based on the [`.gitignore specification`](https://git-scm.com/docs/gitignore).
     */
    IgnoreMode["GIT"] = "git";
    /**
     * Ignores file paths based on the [`.dockerignore specification`](https://docs.docker.com/engine/reference/builder/#dockerignore-file).
     *
     * This is the default for Docker image assets if the '@aws-cdk/aws-ecr-assets:dockerIgnoreSupport'
     * context flag is set.
     */
    IgnoreMode["DOCKER"] = "docker";
})(IgnoreMode = exports.IgnoreMode || (exports.IgnoreMode = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3B0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9wdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxJQUFZLGlCQTJCWDtBQTNCRCxXQUFZLGlCQUFpQjtJQUMzQjs7T0FFRztJQUNILG9DQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILHNDQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsMENBQXFCLENBQUE7SUFFckI7Ozs7Ozs7OztPQVNHO0lBQ0gscURBQWdDLENBQUE7QUFDbEMsQ0FBQyxFQTNCVyxpQkFBaUIsR0FBakIseUJBQWlCLEtBQWpCLHlCQUFpQixRQTJCNUI7QUFFRDs7R0FFRztBQUNILElBQVksVUF1Qlg7QUF2QkQsV0FBWSxVQUFVO0lBQ3BCOzs7Ozs7O09BT0c7SUFDSCwyQkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCx5QkFBVyxDQUFBO0lBRVg7Ozs7O09BS0c7SUFDSCwrQkFBaUIsQ0FBQTtBQUNuQixDQUFDLEVBdkJXLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBdUJyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRGV0ZXJtaW5lcyBob3cgc3ltbGlua3MgYXJlIGZvbGxvd2VkLlxuICovXG5leHBvcnQgZW51bSBTeW1saW5rRm9sbG93TW9kZSB7XG4gIC8qKlxuICAgKiBOZXZlciBmb2xsb3cgc3ltbGlua3MuXG4gICAqL1xuICBORVZFUiA9ICduZXZlcicsXG5cbiAgLyoqXG4gICAqIE1hdGVyaWFsaXplIGFsbCBzeW1saW5rcywgd2hldGhlciB0aGV5IGFyZSBpbnRlcm5hbCBvciBleHRlcm5hbCB0byB0aGUgc291cmNlIGRpcmVjdG9yeS5cbiAgICovXG4gIEFMV0FZUyA9ICdhbHdheXMnLFxuXG4gIC8qKlxuICAgKiBPbmx5IGZvbGxvd3Mgc3ltbGlua3MgdGhhdCBhcmUgZXh0ZXJuYWwgdG8gdGhlIHNvdXJjZSBkaXJlY3RvcnkuXG4gICAqL1xuICBFWFRFUk5BTCA9ICdleHRlcm5hbCcsXG5cbiAgLyoqXG4gICAqIEZvcmJpZHMgc291cmNlIGZyb20gaGF2aW5nIGFueSBzeW1saW5rcyBwb2ludGluZyBvdXRzaWRlIG9mIHRoZSBzb3VyY2VcbiAgICogdHJlZS5cbiAgICpcbiAgICogVGhpcyBpcyB0aGUgc2FmZXN0IG1vZGUgb2Ygb3BlcmF0aW9uIGFzIGl0IGVuc3VyZXMgdGhhdCBjb3B5IG9wZXJhdGlvbnNcbiAgICogd29uJ3QgbWF0ZXJpYWxpemUgZmlsZXMgZnJvbSB0aGUgdXNlcidzIGZpbGUgc3lzdGVtLiBJbnRlcm5hbCBzeW1saW5rcyBhcmVcbiAgICogbm90IGZvbGxvd2VkLlxuICAgKlxuICAgKiBJZiB0aGUgY29weSBvcGVyYXRpb24gcnVucyBpbnRvIGFuIGV4dGVybmFsIHN5bWxpbmssIGl0IHdpbGwgZmFpbC5cbiAgICovXG4gIEJMT0NLX0VYVEVSTkFMID0gJ2ludGVybmFsLW9ubHknLFxufVxuXG4vKipcbiAqIERldGVybWluZXMgdGhlIGlnbm9yZSBiZWhhdmlvciB0byB1c2UuXG4gKi9cbmV4cG9ydCBlbnVtIElnbm9yZU1vZGUge1xuICAvKipcbiAgICogSWdub3JlcyBmaWxlIHBhdGhzIGJhc2VkIG9uIHNpbXBsZSBnbG9iIHBhdHRlcm5zLlxuICAgKlxuICAgKiBUaGlzIGlzIHRoZSBkZWZhdWx0IGZvciBmaWxlIGFzc2V0cy5cbiAgICpcbiAgICogSXQgaXMgYWxzbyB0aGUgZGVmYXVsdCBmb3IgRG9ja2VyIGltYWdlIGFzc2V0cywgdW5sZXNzIHRoZSAnQGF3cy1jZGsvYXdzLWVjci1hc3NldHM6ZG9ja2VySWdub3JlU3VwcG9ydCdcbiAgICogY29udGV4dCBmbGFnIGlzIHNldC5cbiAgICovXG4gIEdMT0IgPSAnZ2xvYicsXG5cbiAgLyoqXG4gICAqIElnbm9yZXMgZmlsZSBwYXRocyBiYXNlZCBvbiB0aGUgW2AuZ2l0aWdub3JlIHNwZWNpZmljYXRpb25gXShodHRwczovL2dpdC1zY20uY29tL2RvY3MvZ2l0aWdub3JlKS5cbiAgICovXG4gIEdJVCA9ICdnaXQnLFxuXG4gIC8qKlxuICAgKiBJZ25vcmVzIGZpbGUgcGF0aHMgYmFzZWQgb24gdGhlIFtgLmRvY2tlcmlnbm9yZSBzcGVjaWZpY2F0aW9uYF0oaHR0cHM6Ly9kb2NzLmRvY2tlci5jb20vZW5naW5lL3JlZmVyZW5jZS9idWlsZGVyLyNkb2NrZXJpZ25vcmUtZmlsZSkuXG4gICAqXG4gICAqIFRoaXMgaXMgdGhlIGRlZmF1bHQgZm9yIERvY2tlciBpbWFnZSBhc3NldHMgaWYgdGhlICdAYXdzLWNkay9hd3MtZWNyLWFzc2V0czpkb2NrZXJJZ25vcmVTdXBwb3J0J1xuICAgKiBjb250ZXh0IGZsYWcgaXMgc2V0LlxuICAgKi9cbiAgRE9DS0VSID0gJ2RvY2tlcidcbn1cblxuaW50ZXJmYWNlIEZpbGVPcHRpb25zIHtcbiAgLyoqXG4gICAqIEZpbGUgcGF0aHMgbWF0Y2hpbmcgdGhlIHBhdHRlcm5zIHdpbGwgYmUgZXhjbHVkZWQuIFNlZSBgaWdub3JlTW9kZWAgdG8gc2V0IHRoZSBtYXRjaGluZyBiZWhhdmlvci5cbiAgICogSGFzIG5vIGVmZmVjdCBvbiBBc3NldHMgYnVuZGxlZCB1c2luZyB0aGUgYGJ1bmRsaW5nYCBwcm9wZXJ0eS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSBub3RoaW5nIGlzIGV4Y2x1ZGVkXG4gICAqL1xuICByZWFkb25seSBleGNsdWRlPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIFRoZSBpZ25vcmUgYmVoYXZpb3IgdG8gdXNlIGZvciBgZXhjbHVkZWAgcGF0dGVybnMuXG4gICAqXG4gICAqIEBkZWZhdWx0IElnbm9yZU1vZGUuR0xPQlxuICAgKi9cbiAgcmVhZG9ubHkgaWdub3JlTW9kZT86IElnbm9yZU1vZGU7XG59XG5cbi8qKlxuICogT3B0aW9ucyBhcHBsaWVkIHdoZW4gY29weWluZyBkaXJlY3Rvcmllc1xuICovXG5leHBvcnQgaW50ZXJmYWNlIENvcHlPcHRpb25zIGV4dGVuZHMgRmlsZU9wdGlvbnMge1xuICAvKipcbiAgICogQSBzdHJhdGVneSBmb3IgaG93IHRvIGhhbmRsZSBzeW1saW5rcy5cbiAgICpcbiAgICogQGRlZmF1bHQgU3ltbGlua0ZvbGxvd01vZGUuTkVWRVJcbiAgICovXG4gIHJlYWRvbmx5IGZvbGxvdz86IFN5bWxpbmtGb2xsb3dNb2RlO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgYXBwbGllZCB3aGVuIGNvcHlpbmcgZGlyZWN0b3JpZXMgaW50byB0aGUgc3RhZ2luZyBsb2NhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaWxlQ29weU9wdGlvbnMgZXh0ZW5kcyBGaWxlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBBIHN0cmF0ZWd5IGZvciBob3cgdG8gaGFuZGxlIHN5bWxpbmtzLlxuICAgKlxuICAgKiBAZGVmYXVsdCBTeW1saW5rRm9sbG93TW9kZS5ORVZFUlxuICAgKi9cbiAgcmVhZG9ubHkgZm9sbG93U3ltbGlua3M/OiBTeW1saW5rRm9sbG93TW9kZTtcbn1cblxuaW50ZXJmYWNlIEV4dHJhSGFzaE9wdGlvbnMge1xuICAvKipcbiAgICogRXh0cmEgaW5mb3JtYXRpb24gdG8gZW5jb2RlIGludG8gdGhlIGZpbmdlcnByaW50IChlLmcuIGJ1aWxkIGluc3RydWN0aW9uc1xuICAgKiBhbmQgb3RoZXIgaW5wdXRzKVxuICAgKlxuICAgKiBAZGVmYXVsdCAtIGhhc2ggaXMgb25seSBiYXNlZCBvbiBzb3VyY2UgY29udGVudFxuICAgKi9cbiAgcmVhZG9ubHkgZXh0cmFIYXNoPzogc3RyaW5nO1xufVxuXG4vKipcbiAqIE9wdGlvbnMgcmVsYXRlZCB0byBjYWxjdWxhdGluZyBzb3VyY2UgaGFzaC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBGaW5nZXJwcmludE9wdGlvbnMgZXh0ZW5kcyBDb3B5T3B0aW9ucywgRXh0cmFIYXNoT3B0aW9ucyB7XG59XG5cbi8qKlxuICogT3B0aW9ucyByZWxhdGVkIHRvIGNhbGN1bGF0aW5nIHNvdXJjZSBoYXNoLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEZpbGVGaW5nZXJwcmludE9wdGlvbnMgZXh0ZW5kcyBGaWxlQ29weU9wdGlvbnMsIEV4dHJhSGFzaE9wdGlvbnMge1xufVxuIl19