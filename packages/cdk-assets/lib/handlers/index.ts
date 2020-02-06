import { AssetManifest, ManifestEntry, StandardManifestEntries } from "@aws-cdk/cx-api";
import { IAws } from "../aws-operations";
import { IAssetHandler, MessageSink } from "../private/asset-handler";
import { ContainerImageAssetHandler } from "./container-images";
import { FileAssetHandler } from "./files";

export function makeAssetHandler(manifest: AssetManifest, asset: ManifestEntry, aws: IAws, message: MessageSink): IAssetHandler {
  if (StandardManifestEntries.isFileEntry(asset)) {
    return new FileAssetHandler(manifest.directory, asset, aws, message);
  }
  if (StandardManifestEntries.isDockerImageEntry(asset)) {
    return new ContainerImageAssetHandler(manifest.directory, asset, aws, message);
  }

  throw new Error(`Unrecognized asset type '${asset.type}' in ${JSON.stringify(asset)})`);
}