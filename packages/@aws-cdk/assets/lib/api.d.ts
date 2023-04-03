/**
 * Common interface for all assets.
 *
 * @deprecated use `core.IAsset`
 */
export interface IAsset {
    /**
     * A hash of the source of this asset, which is available at construction time. As this is a plain
     * string, it can be used in construct IDs in order to enforce creation of a new resource when
     * the content hash has changed.
     */
    readonly sourceHash: string;
}
