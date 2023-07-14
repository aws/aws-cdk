import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import type { CloudAssembly } from '../cloud-assembly';
/**
 * Asset manifest is a description of a set of assets which need to be built and published
 */
export declare class NestedCloudAssemblyArtifact extends CloudArtifact {
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
    static isNestedCloudAssemblyArtifact(art: any): art is NestedCloudAssemblyArtifact;
    /**
     * The relative directory name of the asset manifest
     */
    readonly directoryName: string;
    /**
     * Display name
     */
    readonly displayName: string;
    constructor(assembly: CloudAssembly, name: string, artifact: cxschema.ArtifactManifest);
    /**
     * Full path to the nested assembly directory
     */
    get fullPath(): string;
}
export interface NestedCloudAssemblyArtifact {
    /**
     * The nested Assembly
     */
    readonly nestedAssembly: CloudAssembly;
}
