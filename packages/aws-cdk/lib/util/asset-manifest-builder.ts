import * as asset_schema from '@aws-cdk/cdk-assets-schema';
import * as cdk_assets from 'cdk-assets';

export class AssetManifestBuilder {
  private readonly manifest: asset_schema.ManifestFile = {
    version: asset_schema.AssetManifestSchema.currentVersion(),
    files: {},
    dockerImages: {},
  };

  public addFileAsset(id: string, source: asset_schema.FileSource, destination: asset_schema.FileDestination) {
    this.manifest.files![id] = {
      source,
      destinations: {
        current: destination
      }
    };
  }

  public addDockerImageAsset(id: string, source: asset_schema.DockerImageSource, destination: asset_schema.DockerImageDestination) {
    this.manifest.dockerImages![id] = {
      source,
      destinations: {
        current: destination
      }
    };
  }

  public toManifest(directory: string): cdk_assets.AssetManifest {
    return new cdk_assets.AssetManifest(directory, this.manifest);
  }
}
