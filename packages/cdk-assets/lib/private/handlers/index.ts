import { AssetManifest, DockerImageManifestEntry, FileManifestEntry, IManifestEntry } from '../../asset-manifest';
import { IAssetHandler, IHandlerHost } from '../asset-handler';
import { BundlableFileAssetHandler } from './bundlable-files';
import { ContainerImageAssetHandler } from './container-images';
import { FileAssetHandler } from './files';

export function makeAssetHandler(manifest: AssetManifest, asset: IManifestEntry, host: IHandlerHost): IAssetHandler {
  if (asset instanceof FileManifestEntry) {
    if (asset.source.bundling) {
      return new BundlableFileAssetHandler(manifest.directory, asset, host);
    } else {
      return new FileAssetHandler(manifest.directory, asset, host);
    }
  }
  if (asset instanceof DockerImageManifestEntry) {
    return new ContainerImageAssetHandler(manifest.directory, asset, host);
  }

  throw new Error(`Unrecognized asset type: '${asset}'`);
}
