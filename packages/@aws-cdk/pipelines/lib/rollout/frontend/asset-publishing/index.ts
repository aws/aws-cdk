import { AssetType } from '../../../types/asset-type';
import { Workflow, RolloutWorkflow } from '../../workflow';

export abstract class AssetPublisher {
  public static prepublishAll(): AssetPublisher {
    return new PrepublishAssets();
  }

  public static jitPublishing(): AssetPublisher {
    throw new Error('Method not implemented.');
  }
  public abstract publishAsset(options: PublishAssetOptions): void;
}

export interface PublishAssetOptions {
  readonly deploymentWorkflow: Workflow;

  readonly workflow: RolloutWorkflow;

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