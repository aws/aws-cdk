/**
 * Class that keeps track of the logical IDs that are assigned to resources
 *
 * Supports renaming the generated IDs.
 */
export declare class LogicalIDs {
    /**
     * The rename table (old to new)
     */
    private readonly renames;
    /**
     * All assigned names (new to old, may be identical)
     *
     * This is used to ensure that:
     *
     * - No 2 resources end up with the same final logical ID, unless they were the same to begin with.
     * - All renames have been used at the end of renaming.
     */
    private readonly reverse;
    /**
     * Rename a logical ID from an old ID to a new ID
     */
    addRename(oldId: string, newId: string): void;
    /**
     * Return the renamed version of an ID or the original ID.
     */
    applyRename(oldId: string): string;
    /**
     * Throw an error if not all renames have been used
     *
     * This is to assure that users didn't make typoes when registering renames.
     */
    assertAllRenamesApplied(): void;
}
