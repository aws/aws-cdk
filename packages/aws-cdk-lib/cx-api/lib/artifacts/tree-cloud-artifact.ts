import * as cxschema from '../../../cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import { CloudAssembly } from '../cloud-assembly';

const TREE_CLOUD_ARTIFACT_SYM = Symbol.for('@aws-cdk/cx-api.TreeCloudArtifact');

export class TreeCloudArtifact extends CloudArtifact {
  /**
   * Checks if `art` is an instance of this class.
   *
   * Use this method instead of `instanceof` to properly detect `TreeCloudArtifact`
   * instances, even when the construct library is symlinked.
   *
   * Explanation: in JavaScript, multiple copies of the `cx-api` library on
   * disk are seen as independent, completely different libraries. As a
   * consequence, the class `TreeCloudArtifact` in each copy of the `cx-api` library
   * is seen as a different class, and an instance of one class will not test as
   * `instanceof` the other class. `npm install` will not create installations
   * like this, but users may manually symlink construct libraries together or
   * use a monorepo tool: in those cases, multiple copies of the `cx-api`
   * library can be accidentally installed, and `instanceof` will behave
   * unpredictably. It is safest to avoid using `instanceof`, and using
   * this type-testing method instead.
   */
  public static isTreeCloudArtifact(art: any): art is TreeCloudArtifact {
    return art && typeof art === 'object' && art[TREE_CLOUD_ARTIFACT_SYM];
  }

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

/**
 * Mark all instances of 'TreeCloudArtifact'
 *
 * Why not put this in the constructor? Because this is a class property,
 * not an instance property. It applies to all instances of the class.
 */
Object.defineProperty(TreeCloudArtifact.prototype, TREE_CLOUD_ARTIFACT_SYM, {
  value: true,
  enumerable: false,
  writable: false,
});
