import { AssetManifest as AssetManifestSchema, DockerImageDestination, DockerImageSource, FileDestination, FileSource } from '@aws-cdk/cloud-assembly-schema';
/**
 * A manifest of assets
 */
export declare class AssetManifest {
    private readonly manifest;
    /**
     * The default name of the asset manifest in a cdk.out directory
     */
    static readonly DEFAULT_FILENAME = "assets.json";
    /**
     * Load an asset manifest from the given file
     */
    static fromFile(fileName: string): AssetManifest;
    /**
     * Load an asset manifest from the given file or directory
     *
     * If the argument given is a directoy, the default asset file name will be used.
     */
    static fromPath(filePath: string): AssetManifest;
    /**
     * The directory where the manifest was found
     */
    readonly directory: string;
    constructor(directory: string, manifest: AssetManifestSchema);
    /**
     * Select a subset of assets and destinations from this manifest.
     *
     * Only assets with at least 1 selected destination are retained.
     *
     * If selection is not given, everything is returned.
     */
    select(selection?: DestinationPattern[]): AssetManifest;
    /**
     * Describe the asset manifest as a list of strings
     */
    list(): string[];
    /**
     * List of assets per destination
     *
     * Returns one asset for every publishable destination. Multiple asset
     * destinations may share the same asset source.
     */
    get entries(): IManifestEntry[];
    /**
     * List of file assets, splat out to destinations
     */
    get files(): FileManifestEntry[];
}
/**
 * A single asset from an asset manifest'
 */
export interface IManifestEntry {
    /**
     * The identifier of the asset and its destination
     */
    readonly id: DestinationIdentifier;
    /**
     * The type of asset
     */
    readonly type: string;
    /**
     * Type-dependent source data
     */
    readonly genericSource: unknown;
    /**
     * Type-dependent destination data
     */
    readonly genericDestination: unknown;
}
/**
 * A manifest entry for a file asset
 */
export declare class FileManifestEntry implements IManifestEntry {
    /** Identifier for this asset */
    readonly id: DestinationIdentifier;
    /** Source of the file asset */
    readonly source: FileSource;
    /** Destination for the file asset */
    readonly destination: FileDestination;
    readonly genericSource: unknown;
    readonly genericDestination: unknown;
    readonly type = "file";
    constructor(
    /** Identifier for this asset */
    id: DestinationIdentifier, 
    /** Source of the file asset */
    source: FileSource, 
    /** Destination for the file asset */
    destination: FileDestination);
}
/**
 * A manifest entry for a docker image asset
 */
export declare class DockerImageManifestEntry implements IManifestEntry {
    /** Identifier for this asset */
    readonly id: DestinationIdentifier;
    /** Source of the file asset */
    readonly source: DockerImageSource;
    /** Destination for the file asset */
    readonly destination: DockerImageDestination;
    readonly genericSource: unknown;
    readonly genericDestination: unknown;
    readonly type = "docker-image";
    constructor(
    /** Identifier for this asset */
    id: DestinationIdentifier, 
    /** Source of the file asset */
    source: DockerImageSource, 
    /** Destination for the file asset */
    destination: DockerImageDestination);
}
/**
 * Identify an asset destination in an asset manifest
 *
 * When stringified, this will be a combination of the source
 * and destination IDs.
 */
export declare class DestinationIdentifier {
    /**
     * Identifies the asset, by source.
     *
     * The assetId will be the same between assets that represent
     * the same physical file or image.
     */
    readonly assetId: string;
    /**
     * Identifies the destination where this asset will be published
     */
    readonly destinationId: string;
    constructor(assetId: string, destinationId: string);
    /**
     * Return a string representation for this asset identifier
     */
    toString(): string;
}
/**
 * A filter pattern for an destination identifier
 */
export declare class DestinationPattern {
    /**
     * Parse a ':'-separated string into an asset/destination identifier
     */
    static parse(s: string): DestinationPattern;
    /**
     * Identifies the asset, by source.
     */
    readonly assetId?: string;
    /**
     * Identifies the destination where this asset will be published
     */
    readonly destinationId?: string;
    constructor(assetId?: string, destinationId?: string);
    /**
     * Whether or not this pattern matches the given identifier
     */
    matches(id: DestinationIdentifier): boolean;
    /**
     * Return a string representation for this asset identifier
     */
    toString(): string;
}
