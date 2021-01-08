import { AssetPublishingStrategy, PublishAssetOptions } from './index';

export class PrepublishAssets extends AssetPublishingStrategy {
  public publishAsset(_options: PublishAssetOptions): void {
    throw new Error('Cannot publish assets yet.');
  }
}