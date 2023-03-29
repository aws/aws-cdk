import { AssetManifest, IManifestEntry } from './asset-manifest';
import { IAws } from './aws';
import { IHandlerHost } from './private/asset-handler';
import { DockerFactory } from './private/docker';
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

  /**
   * Whether to publish in parallel
   *
   * @default false
   */
  readonly publishInParallel?: boolean;

  /**
   * Whether to build assets
   *
   * @default true
   */
  readonly buildAssets?: boolean;

  /**
   * Whether to publish assets
   *
   * @default true
   */
  readonly publishAssets?: boolean;
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
  private readonly handlerHost: IHandlerHost;
  private readonly publishInParallel: boolean;
  private readonly buildAssets: boolean;
  private readonly publishAssets: boolean;
  private readonly startMessagePrefix: string;
  private readonly successMessagePrefix: string;
  private readonly errorMessagePrefix: string;

  constructor(private readonly manifest: AssetManifest, private readonly options: AssetPublishingOptions) {
    this.assets = manifest.entries;
    this.totalOperations = this.assets.length;
    this.publishInParallel = options.publishInParallel ?? false;
    this.buildAssets = options.buildAssets ?? true;
    this.publishAssets = options.publishAssets ?? true;

    const getMessages = () => {
      if (this.buildAssets && this.publishAssets) {
        return {
          startMessagePrefix: 'Building and publishing',
          successMessagePrefix: 'Built and published',
          errorMessagePrefix: 'Error building and publishing',
        };
      } else if (this.buildAssets) {
        return {
          startMessagePrefix: 'Building',
          successMessagePrefix: 'Built',
          errorMessagePrefix: 'Error building',
        };
      } else {
        return {
          startMessagePrefix: 'Publishing',
          successMessagePrefix: 'Published',
          errorMessagePrefix: 'Error publishing',
        };
      }
    };

    const messages = getMessages();

    this.startMessagePrefix = messages.startMessagePrefix;
    this.successMessagePrefix = messages.successMessagePrefix;
    this.errorMessagePrefix = messages.errorMessagePrefix;

    const self = this;
    this.handlerHost = {
      aws: this.options.aws,
      get aborted() { return self.aborted; },
      emitMessage(t, m) { self.progressEvent(t, m); },
      dockerFactory: new DockerFactory(),
    };
  }

  /**
   * Publish all assets from the manifest
   */
  public async publish(): Promise<void> {
    if (this.publishInParallel) {
      await Promise.all(this.assets.map(async (asset) => this.publishAsset(asset)));
    } else {
      for (const asset of this.assets) {
        if (!await this.publishAsset(asset)) {
          break;
        }
      }
    }

    if ((this.options.throwOnError ?? true) && this.failures.length > 0) {
      throw new Error(`${this.errorMessagePrefix}: ${this.failures.map(e => e.error.message)}`);
    }
  }

  /**
   * Publish an asset.
   * @param asset The asset to publish
   * @returns false when publishing should stop
   */
  private async publishAsset(asset: IManifestEntry) {
    try {
      if (this.progressEvent(EventType.START, `${this.startMessagePrefix} ${asset.id}`)) { return false; }

      const handler = makeAssetHandler(this.manifest, asset, this.handlerHost);

      if (this.buildAssets) {
        await handler.build();
      }

      if (this.publishAssets) {
        await handler.publish();
      }

      if (this.aborted) {
        throw new Error('Aborted');
      }

      this.completedOperations++;
      if (this.progressEvent(EventType.SUCCESS, `${this.successMessagePrefix} ${asset.id}`)) { return false; }
    } catch (e: any) {
      this.failures.push({ asset, error: e });
      this.completedOperations++;
      if (this.progressEvent(EventType.FAIL, e.message)) { return false; }
    }

    return true;
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
