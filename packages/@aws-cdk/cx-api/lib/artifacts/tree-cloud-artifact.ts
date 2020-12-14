import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import { CloudAssembly } from '../cloud-assembly';

export class TreeCloudArtifact extends CloudArtifact {
  public readonly file: string;

  constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.TreeArtifactProperties;
    if (!properties.file) {
      throw new Error('Invalid TreeCloudArtifact. Missing "file" property');
    }
    this.file = properties.file;
  }
}