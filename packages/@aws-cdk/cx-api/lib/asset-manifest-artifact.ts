import { ArtifactManifest, CloudArtifact } from './cloud-artifact';
import { CloudAssembly } from './cloud-assembly';

export class AssetManifestArtifact extends CloudArtifact {
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
