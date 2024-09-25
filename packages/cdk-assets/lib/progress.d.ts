import { IManifestEntry } from './asset-manifest';
/**
 * A listener for progress events from the publisher
 */
export interface IPublishProgressListener {
    /**
     * Asset build event
     */
    onPublishEvent(type: EventType, event: IPublishProgress): void;
}
/**
 * A single event for an asset
 */
export declare enum EventType {
    /**
     * Just starting on an asset
     */
    START = "start",
    /**
     * When an asset is successfully finished
     */
    SUCCESS = "success",
    /**
     * When an asset failed
     */
    FAIL = "fail",
    /**
     * Checking whether an asset has already been published
     */
    CHECK = "check",
    /**
     * The asset was already published
     */
    FOUND = "found",
    /**
     * The asset was reused locally from a cached version
     */
    CACHED = "cached",
    /**
     * The asset will be built
     */
    BUILD = "build",
    /**
     * The asset will be uploaded
     */
    UPLOAD = "upload",
    /**
     * Another type of detail message
     */
    DEBUG = "debug"
}
/**
 * Context object for publishing progress
 */
export interface IPublishProgress {
    /**
     * Current event message
     */
    readonly message: string;
    /**
     * Asset currently being packaged (if any)
     */
    readonly currentAsset?: IManifestEntry;
    /**
     * How far along are we?
     */
    readonly percentComplete: number;
    /**
     * Abort the current publishing operation
     */
    abort(): void;
}
