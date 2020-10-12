import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cdk_assets from 'cdk-assets';

export class AssetManifestBuilder {
  private readonly manifest: cxschema.AssetManifest = {
    version: cxschema.Manifest.version(),
    files: {},
    dockerImages: {},
  };

  public addFileAsset(id: string, source: cxschema.FileSource, destination: cxschema.FileDestination) {
    this.manifest.files![id] = {
      source,
      destinations: {
        current: destination,
      },
    };
  }

  public addDockerImageAsset(id: string, source: cxschema.DockerImageSource, destination: cxschema.DockerImageDestination) {
    this.manifest.dockerImages![id] = {
      source,
      destinations: {
        current: destination,
      },
    };
  }

  public toManifest(directory: string): cdk_assets.AssetManifest {
    return new cdk_assets.AssetManifest(directory, this.manifest);
  }
}
