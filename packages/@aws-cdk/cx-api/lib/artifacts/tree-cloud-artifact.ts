import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import { CloudAssembly } from '../cloud-assembly';

const TREE_CLOUD_ARTIFACT_SYMBOL = Symbol.for('@aws-cdk/cx-api.TreeCloudArtifact');

export class TreeCloudArtifact extends CloudArtifact {
  /**
   * Return whether the given object is a TreeCloudArtifact.
   */
  public static isTreeCloudArtifact(x: any): x is TreeCloudArtifact {
    return x !== null && typeof(x) === 'object' && TREE_CLOUD_ARTIFACT_SYMBOL in x;
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
 * Mark all instances of 'TreeCloudArtifact'.
 */
Object.defineProperty(TreeCloudArtifact.prototype, TREE_CLOUD_ARTIFACT_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});
