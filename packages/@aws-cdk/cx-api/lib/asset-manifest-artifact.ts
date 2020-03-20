import { ArtifactManifest, CloudArtifact } from './cloud-artifact';
import { CloudAssembly } from './cloud-assembly';

/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export class AssetManifestArtifact extends CloudArtifact {
  /**
   * The file name of the asset manifest
   */
  public readonly file: string;

  constructor(assembly: CloudAssembly, name: string, artifact: ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {});
    if (!properties.file) {
      throw new Error('Invalid AssetManifestArtifact. Missing "fiel" property');
    }
    this.file = properties.file;
  }
}
