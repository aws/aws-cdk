import { ArtifactManifest, CloudArtifact } from './cloud-artifact';
import { CloudAssembly } from './cloud-assembly';

export class MetadataCloudArtifact extends CloudArtifact {
  public readonly file: string;

  constructor(assembly: CloudAssembly, name: string, artifact: ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {});
    if (!properties.file) {
      throw new Error('Invalid MetadataCloudArtifact. Missing "file" property');
    }
    this.file = properties.file;
  }
}