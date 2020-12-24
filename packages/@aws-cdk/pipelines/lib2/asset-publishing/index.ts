import { AssetType } from '../../lib/actions/publish-assets-action';
import { ExecutionGraph } from '../graph';

export abstract class AssetPublishingStrategy {
  public static prepublishAll(sharedCodeBuild: boolean = false): AssetPublishingStrategy {
    throw new Error('Method not implemented.');
  }

  public static jitPublishing(): AssetPublishingStrategy {
    throw new Error('Method not implemented.');
  }
  public abstract publishAsset(options: PublishAssetOptions): void;
}

export interface PublishAssetOptions {
  readonly deploymentGraph: ExecutionGraph;

  /**
   * Asset manifest path
   */
  readonly assetManifestPath: string;

  /**
   * Asset identifier
   */
  readonly assetId: string;

  /**
   * Asset selector to pass to `cdk-assets`.
   */
  readonly assetSelector: string;

  /**
   * Type of asset to publish
   */
  readonly assetType: AssetType;
}
