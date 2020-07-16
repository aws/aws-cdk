import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import { CloudAssembly } from '../cloud-assembly';

/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export class NestedCloudAssemblyArtifact extends CloudArtifact {
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
  private _nestedAssembly?: CloudAssembly;

  constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.NestedCloudAssemblyProperties;
    this.directoryName = properties.directoryName;
    this.displayName = properties.displayName ?? name;
  }

  /**
   * Full path to the nested assembly directory
   */
  public get fullPath(): string {
    return path.join(this.assembly.directory, this.directoryName);
  }

  /**
   * The nested Assembly
   */
  public get nestedAssembly(): CloudAssembly {
    if (!this._nestedAssembly) {
      this._nestedAssembly = new CloudAssembly(this.fullPath);
    }
    return this._nestedAssembly;
  }
}
