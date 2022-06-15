import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import type { CloudAssembly } from '../cloud-assembly';

const NESTED_CLOUD_ASSEMBLY_ARTIFACT_SYMBOL = Symbol.for('@aws-cdk/cx-api.NestedCloudAssemblyArtifact');

/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export class NestedCloudAssemblyArtifact extends CloudArtifact {
  /**
   * Return whether the given object is a NestedCloudAssemblyArtifact.
   */
  public static isNestedCloudAssemblyArtifact(x: any): x is NestedCloudAssemblyArtifact {
    return x !== null && typeof(x) === 'object' && NESTED_CLOUD_ASSEMBLY_ARTIFACT_SYMBOL in x;
  }

  /**
   * The relative directory name of the asset manifest
   */
  public readonly directoryName: string;

  /**
   * Display name
   */
  public readonly displayName: string;

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
}

export interface NestedCloudAssemblyArtifact {
  /**
   * The nested Assembly
   */
  readonly nestedAssembly: CloudAssembly;

  // Declared in a different file
}

/**
 * Mark all instances of 'NestedCloudAssemblyArtifact'.
 */
Object.defineProperty(NestedCloudAssemblyArtifact.prototype, NESTED_CLOUD_ASSEMBLY_ARTIFACT_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});