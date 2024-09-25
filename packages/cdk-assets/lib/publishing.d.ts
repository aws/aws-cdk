import { AssetManifest, IManifestEntry } from './asset-manifest';
import { IAws } from './aws';
import { IPublishProgress, IPublishProgressListener } from './progress';
export interface AssetPublishingOptions {
    /**
     * Entry point for AWS client
     */
    readonly aws: IAws;
    /**
     * Listener for progress events
     *
     * @default No listener
     */
    readonly progressListener?: IPublishProgressListener;
    /**
     * Whether to throw at the end if there were errors
     *
     * @default true
     */
    readonly throwOnError?: boolean;
    /**
     * Whether to publish in parallel, when 'publish()' is called
     *
     * @default false
     */
    readonly publishInParallel?: boolean;
    /**
     * Whether to build assets, when 'publish()' is called
     *
     * @default true
     */
    readonly buildAssets?: boolean;
    /**
     * Whether to publish assets, when 'publish()' is called
     *
     * @default true
     */
    readonly publishAssets?: boolean;
    /**
     * Whether to print publishing logs
     *
     * @default true
     */
    readonly quiet?: boolean;
}
/**
 * A failure to publish an asset
 */
export interface FailedAsset {
    /**
     * The asset that failed to publish
     */
    readonly asset: IManifestEntry;
    /**
     * The failure that occurred
     */
    readonly error: Error;
}
export declare class AssetPublishing implements IPublishProgress {
    private readonly manifest;
    private readonly options;
    /**
     * The message for the IPublishProgress interface
     */
    message: string;
    /**
     * The current asset for the IPublishProgress interface
     */
    currentAsset?: IManifestEntry;
    readonly failures: FailedAsset[];
    private readonly assets;
    private readonly totalOperations;
    private completedOperations;
    private aborted;
    private readonly handlerHost;
    private readonly publishInParallel;
    private readonly buildAssets;
    private readonly publishAssets;
    private readonly handlerCache;
    constructor(manifest: AssetManifest, options: AssetPublishingOptions);
    /**
     * Publish all assets from the manifest
     */
    publish(): Promise<void>;
    /**
     * Build a single asset from the manifest
     */
    buildEntry(asset: IManifestEntry): Promise<boolean>;
    /**
     * Publish a single asset from the manifest
     */
    publishEntry(asset: IManifestEntry): Promise<boolean>;
    /**
     * Return whether a single asset is published
     */
    isEntryPublished(asset: IManifestEntry): Promise<boolean>;
    /**
     * publish an asset (used by 'publish()')
     * @param asset The asset to publish
     * @returns false when publishing should stop
     */
    private publishAsset;
    get percentComplete(): number;
    abort(): void;
    get hasFailures(): boolean;
    /**
     * Publish a progress event to the listener, if present.
     *
     * Returns whether an abort is requested. Helper to get rid of repetitive code in publish().
     */
    private progressEvent;
    private assetHandler;
}
