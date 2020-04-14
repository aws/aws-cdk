import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as path from 'path';
import { CloudArtifact } from './cloud-artifact';
import { CloudAssembly } from './cloud-assembly';

/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export class AssetManifestArtifact extends CloudArtifact {
  /**
   * The file name of the asset manifest
   */
  public readonly file: string;

  constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {});
    if (!properties.file) {
      throw new Error('Invalid AssetManifestArtifact. Missing "fiel" property');
    }
    this.file = path.resolve(this.assembly.directory, properties.file);
  }
}
