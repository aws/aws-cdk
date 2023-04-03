/**
 * Symlink follow mode.
 * @deprecated see `core.SymlinkFollowMode`
 */
export declare enum FollowMode {
    /**
     * Never follow symlinks.
     */
    NEVER = "never",
    /**
     * Materialize all symlinks, whether they are internal or external to the source directory.
     */
    ALWAYS = "always",
    /**
     * Only follows symlinks that are external to the source directory.
     */
    EXTERNAL = "external",
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
    BLOCK_EXTERNAL = "internal-only"
}
