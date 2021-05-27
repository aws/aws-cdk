import { AssetType } from '../../../types/asset-type';
import { ExecutionGraph, PipelineGraph } from '../../graph';

export abstract class AssetPublishingStrategy {
  public static prepublishAll(): AssetPublishingStrategy {
    return new PrepublishAssets();
  }

  public static jitPublishing(): AssetPublishingStrategy {
    throw new Error('Method not implemented.');
  }
  public abstract publishAsset(options: PublishAssetOptions): void;
}

export interface PublishAssetOptions {
  readonly deploymentGraph: ExecutionGraph;

  readonly pipelineGraph: PipelineGraph;

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

import { PrepublishAssets } from './prepublish-assets';