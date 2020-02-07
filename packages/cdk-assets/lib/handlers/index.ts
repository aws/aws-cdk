import { AssetManifest, DockerImageManifestEntry, FileManifestEntry, IManifestEntry } from "../asset-manifest";
import { IAws } from "../aws-operations";
import { IAssetHandler, MessageSink } from "../private/asset-handler";
import { ContainerImageAssetHandler } from "./container-images";
import { FileAssetHandler } from "./files";

export function makeAssetHandler(manifest: AssetManifest, asset: IManifestEntry, aws: IAws, message: MessageSink): IAssetHandler {
  if (asset instanceof FileManifestEntry) {
    return new FileAssetHandler(manifest.directory, asset, aws, message);
  }
  if (asset instanceof DockerImageManifestEntry) {
    return new ContainerImageAssetHandler(manifest.directory, asset, aws, message);
  }

  throw new Error(`Unrecognized asset type: '${asset}'`);
}