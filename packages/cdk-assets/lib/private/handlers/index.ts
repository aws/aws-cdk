import { ExternalFileSource } from '@aws-cdk/cloud-assembly-schema';
import { AssetManifest, DockerImageManifestEntry, FileManifestEntry, IManifestEntry } from '../../asset-manifest';
import { IAssetHandler, IHandlerHost } from '../asset-handler';
import { ContainerImageAssetHandler } from './container-images';
import { ExternalContainerImageAssetHandler } from './external-container-images';
import { ExternalFileAssetHandler } from './external-files';
import { FileAssetHandler } from './files';

export function makeAssetHandler(manifest: AssetManifest, asset: IManifestEntry, host: IHandlerHost): IAssetHandler {
  if (asset instanceof FileManifestEntry) {
    return isExternalSource(asset) ?
      new ExternalFileAssetHandler(asset, host) : new FileAssetHandler(manifest.directory, asset, host);
  }
  if (asset instanceof DockerImageManifestEntry) {
    return isExternalSource(asset) ?
      new ExternalContainerImageAssetHandler(asset, host) : new ContainerImageAssetHandler(manifest.directory, asset, host);
  }

  throw new Error(`Unrecognized asset type: '${asset}'`);
}

function isExternalSource(x: any): x is ExternalFileSource {
  return x.hasOwnProperty('executable');
}
