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

  /**
   * Version of bootstrap stack required to deploy this stack
   */
  public readonly requiresBootstrapStackVersion: number;

  constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.AssetManifestProperties;
    if (!properties.file) {
      throw new Error('Invalid AssetManifestArtifact. Missing "file" property');
    }
    this.file = path.resolve(this.assembly.directory, properties.file);
    this.requiresBootstrapStackVersion = properties.requiresBootstrapStackVersion ?? 1;
  }
}
