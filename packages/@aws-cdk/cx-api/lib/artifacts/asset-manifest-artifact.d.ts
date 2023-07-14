import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import { CloudAssembly } from '../cloud-assembly';
/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export declare class AssetManifestArtifact extends CloudArtifact {
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
    static isAssetManifestArtifact(art: any): art is AssetManifestArtifact;
    /**
     * The file name of the asset manifest
     */
    readonly file: string;
    /**
     * Version of bootstrap stack required to deploy this stack
     */
    readonly requiresBootstrapStackVersion: number | undefined;
    /**
     * Name of SSM parameter with bootstrap stack version
     *
     * @default - Discover SSM parameter by reading stack
     */
    readonly bootstrapStackVersionSsmParameter?: string;
    private _contents?;
    constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest);
    /**
     * The Asset Manifest contents
     */
    get contents(): cxschema.AssetManifest;
}
