import * as path from 'path';
import * as cxschema from '../../../cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import type { CloudAssembly } from '../cloud-assembly';

const NESTED_CLOUD_ASSEMBLY_SYM = Symbol.for('@aws-cdk/cx-api.NestedCloudAssemblyArtifact');

/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export class NestedCloudAssemblyArtifact extends CloudArtifact {
  /**
   * Checks if `art` is an instance of this class.
   *
   * Use this method instead of `instanceof` to properly detect `NestedCloudAssemblyArtifact`
   * instances, even when the construct library is symlinked.
   *
   * Explanation: in JavaScript, multiple copies of the `cx-api` library on
   * disk are seen as independent, completely different libraries. As a
   * consequence, the class `NestedCloudAssemblyArtifact` in each copy of the `cx-api` library
   * is seen as a different class, and an instance of one class will not test as
   * `instanceof` the other class. `npm install` will not create installations
   * like this, but users may manually symlink construct libraries together or
   * use a monorepo tool: in those cases, multiple copies of the `cx-api`
   * library can be accidentally installed, and `instanceof` will behave
   * unpredictably. It is safest to avoid using `instanceof`, and using
   * this type-testing method instead.
   */
  public static isNestedCloudAssemblyArtifact(art: any): art is NestedCloudAssemblyArtifact {
    return art && typeof art === 'object' && art[NESTED_CLOUD_ASSEMBLY_SYM];
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
 * Mark all instances of 'NestedCloudAssemblyArtifact'
 *
 * Why not put this in the constructor? Because this is a class property,
 * not an instance property. It applies to all instances of the class.
 */
Object.defineProperty(NestedCloudAssemblyArtifact.prototype, NESTED_CLOUD_ASSEMBLY_SYM, {
  value: true,
  enumerable: false,
  writable: false,
});
