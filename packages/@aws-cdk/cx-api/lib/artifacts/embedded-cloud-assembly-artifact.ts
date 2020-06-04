import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as path from 'path';
import { CloudArtifact } from '../cloud-artifact';
import { CloudAssembly } from '../cloud-assembly';

/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export class EmbeddedCloudAssemblyArtifact extends CloudArtifact {
  /**
   * The relative directory name of the asset manifest
   */
  public readonly directoryName: string;

  /**
   * Display name
   */
  public readonly displayName: string;

  /**
   * Cache for the inner assembly loading
   */
  private _embeddedAssembly?: CloudAssembly;

  constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.EmbeddedCloudAssemblyProperties;
    this.directoryName = properties.directoryName;
    this.displayName = properties.displayName ?? name;
  }

  /**
   * Full path to the Embedded Assembly
   */
  public get fullPath(): string {
    return path.join(this.assembly.directory, this.directoryName);
  }

  /**
   * The embedded Assembly
   */
  public get embeddedAssembly(): CloudAssembly {
    if (!this._embeddedAssembly) {
      this._embeddedAssembly = new CloudAssembly(this.fullPath);
    }
    return this._embeddedAssembly;
  }
}
