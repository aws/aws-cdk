import * as fs from 'fs';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import { CloudAssembly } from '../cloud-assembly';

const ASSET_MANIFEST_ARTIFACT_SYM = Symbol.for('@aws-cdk/cx-api.AssetManifestArtifact');

/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export class AssetManifestArtifact extends CloudArtifact {
  /**
   * Checks if `art` is an instance of this class.
   *
   * Use this method instead of `instanceof` to properly detect `AssetManifestArtifact`
   * instances, even when the construct library is symlinked.
   *
   * Explanation: in JavaScript, multiple copies of the `cx-api` library on
   * disk are seen as independent, completely different libraries. As a
   * consequence, the class `AssetManifestArtifact` in each copy of the `cx-api` library
   * is seen as a different class, and an instance of one class will not test as
   * `instanceof` the other class. `npm install` will not create installations
   * like this, but users may manually symlink construct libraries together or
   * use a monorepo tool: in those cases, multiple copies of the `cx-api`
   * library can be accidentally installed, and `instanceof` will behave
   * unpredictably. It is safest to avoid using `instanceof`, and using
   * this type-testing method instead.
   */
  public static isAssetManifestArtifact(art: any): art is AssetManifestArtifact {
    return art && typeof art === 'object' && art[ASSET_MANIFEST_ARTIFACT_SYM];
  }

  /**
   * The file name of the asset manifest
   */
  public readonly file: string;

  /**
   * Version of bootstrap stack required to deploy this stack
   */
  public readonly requiresBootstrapStackVersion: number | undefined;

  /**
   * Name of SSM parameter with bootstrap stack version
   *
   * @default - Discover SSM parameter by reading stack
   */
  public readonly bootstrapStackVersionSsmParameter?: string;

  private _contents?: cxschema.AssetManifest;

  constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest) {
    super(assembly, name, artifact);

    const properties = (this.manifest.properties || {}) as cxschema.AssetManifestProperties;
    if (!properties.file) {
      throw new Error('Invalid AssetManifestArtifact. Missing "file" property');
    }
    this.file = path.resolve(this.assembly.directory, properties.file);
    this.requiresBootstrapStackVersion = properties.requiresBootstrapStackVersion;
    this.bootstrapStackVersionSsmParameter = properties.bootstrapStackVersionSsmParameter;
  }

  /**
   * The Asset Manifest contents
   */
  public get contents(): cxschema.AssetManifest {
    if (this._contents !== undefined) {
      return this._contents;
    }

    const contents = this._contents = JSON.parse(fs.readFileSync(this.file, 'utf-8'));
    return contents;
  }

}

/**
 * Mark all instances of 'AssetManifestArtifact'
 *
 * Why not put this in the constructor? Because this is a class property,
 * not an instance property. It applies to all instances of the class.
 */
Object.defineProperty(AssetManifestArtifact.prototype, ASSET_MANIFEST_ARTIFACT_SYM, {
  value: true,
  enumerable: false,
  writable: false,
});
