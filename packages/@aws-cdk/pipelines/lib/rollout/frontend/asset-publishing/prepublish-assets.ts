import { AssetPublisher, PublishAssetOptions } from './index';

export class PrepublishAssets extends AssetPublisher {
  public publishAsset(_options: PublishAssetOptions): void {
    throw new Error('Cannot publish assets yet.');
  }
}