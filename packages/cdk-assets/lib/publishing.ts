import { AssetManifest, IManifestEntry } from './asset-manifest';
import { IAws } from './aws';
import { makeAssetHandler } from './private/handlers';
import { EventType, IPublishProgress, IPublishProgressListener } from './progress';

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

export class AssetPublishing implements IPublishProgress {
  /**
   * The message for the IPublishProgress interface
   */
  public message: string = 'Starting';

  /**
   * The current asset for the IPublishProgress interface
   */
  public currentAsset?: IManifestEntry;
  public readonly failures = new Array<FailedAsset>();
  private readonly assets: IManifestEntry[];

  private readonly totalOperations: number;
  private completedOperations: number = 0;
  private aborted = false;

  constructor(private readonly manifest: AssetManifest, private readonly options: AssetPublishingOptions) {
    this.assets = manifest.entries;
    this.totalOperations = this.assets.length;
  }

  /**
   * Publish all assets from the manifest
   */
  public async publish(): Promise<void> {
    const self = this;

    for (const asset of this.assets) {
      if (this.aborted) { break; }
      this.currentAsset = asset;

      try {
        if (this.progressEvent(EventType.START, `Publishing ${asset.id}`)) { break; }

        const handler = makeAssetHandler(this.manifest, asset, {
          aws: this.options.aws,
          get aborted() { return self.aborted; },
          emitMessage(t, m) { self.progressEvent(t, m); },
        });
        await handler.publish();

        if (this.aborted) {
          throw new Error('Aborted');
        }

        this.completedOperations++;
        if (this.progressEvent(EventType.SUCCESS, `Published ${asset.id}`)) { break; }
      } catch (e) {
        this.failures.push({ asset, error: e });
        this.completedOperations++;
        if (this.progressEvent(EventType.FAIL, e.message)) { break; }
      }
    }

    if ((this.options.throwOnError ?? true) && this.failures.length > 0) {
      throw new Error(`Error publishing: ${this.failures.map(e => e.error.message)}`);
    }
  }

  public get percentComplete() {
    if (this.totalOperations === 0) { return 100; }
    return Math.floor((this.completedOperations / this.totalOperations) * 100);
  }

  public abort(): void {
    this.aborted = true;
  }

  public get hasFailures() {
    return this.failures.length > 0;
  }

  /**
   * Publish a progress event to the listener, if present.
   *
   * Returns whether an abort is requested. Helper to get rid of repetitive code in publish().
   */
  private progressEvent(event: EventType, message: string): boolean {
    this.message = message;
    if (this.options.progressListener) { this.options.progressListener.onPublishEvent(event, this); }
    return this.aborted;
  }
}