import { AssetManifest, ManifestEntry } from "@aws-cdk/cx-api";
import { IAws } from "./aws-operations";
import { makeAssetHandler } from "./handlers";

export interface IPublishProgressListener {
  onAssetStart(event: IPublishProgress): void;
  onAssetEnd(event: IPublishProgress): void;
  onEvent(event: IPublishProgress): void;
  onError(event: IPublishProgress): void;
}

export interface IPublishProgress {
  readonly message: string;
  readonly currentAsset?: ManifestEntry;
  readonly percentComplete: number;

  /**
   * Abort the current publishing operation
   */
  abort(): void;
}

export interface AssetPublishingOptions {
  /**
   * Manifest containing assets to publish
   */
  readonly manifest: AssetManifest;

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

export class AssetPublishing implements IPublishProgress {
  public message: string = 'Starting';
  public currentAsset?: ManifestEntry;
  public readonly failedAssets = new Array<ManifestEntry>();
  private readonly assets: ManifestEntry[];
  private readonly errors = new Array<Error>();

  private readonly totalOperations: number;
  private completedOperations: number = 0;
  private aborted = false;

  constructor(private readonly options: AssetPublishingOptions) {
    this.assets = this.options.manifest.entries;
    this.totalOperations = this.assets.length;
  }

  public async publish(): Promise<void> {
    for (const asset of this.assets) {
      if (this.aborted) { break; }
      this.currentAsset = asset;

      try {
        if (this.progress('onAssetStart', `Packaging ${asset.id}`)) { break; }

        const handler = makeAssetHandler(this.options.manifest, asset, this.options.aws, m => this.progress('onEvent', m));
        await handler.publish();

        this.completedOperations++;
        if (this.progress('onAssetEnd', `Published ${asset.id}`)) { break; }
      } catch (e) {
        this.errors.push(e);
        this.failedAssets.push(asset);
        this.completedOperations++;
        if (this.progress('onError', e.message)) { break; }
      }
    }

    if ((this.options.throwOnError ?? true) && this.errors.length > 0) {
      throw new Error(`Error publishing: ${this.errors.map(e => e.message)}`);
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
    return this.failedAssets.length > 0;
  }

  /**
   * Publish a progress event to the listener, if present.
   *
   * Returns whether an abort is requested. Helper to get rid of repetitive code in publish().
   */
  private progress<E extends keyof IPublishProgressListener >(event: E, message: string): boolean {
    this.message = message;
    if (this.options.progressListener) { this.options.progressListener[event](this); }
    return this.aborted;
  }
}