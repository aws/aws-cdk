import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { CloudArtifact } from '../cloud-artifact';
import type { CloudAssembly } from '../cloud-assembly';
import { Environment } from '../environment';
export declare class CloudFormationStackArtifact extends CloudArtifact {
    /**
     * Checks if `art` is an instance of this class.
     *
     * Use this method instead of `instanceof` to properly detect `CloudFormationStackArtifact`
     * instances, even when the construct library is symlinked.
     *
     * Explanation: in JavaScript, multiple copies of the `cx-api` library on
     * disk are seen as independent, completely different libraries. As a
     * consequence, the class `CloudFormationStackArtifact` in each copy of the `cx-api` library
     * is seen as a different class, and an instance of one class will not test as
     * `instanceof` the other class. `npm install` will not create installations
     * like this, but users may manually symlink construct libraries together or
     * use a monorepo tool: in those cases, multiple copies of the `cx-api`
     * library can be accidentally installed, and `instanceof` will behave
     * unpredictably. It is safest to avoid using `instanceof`, and using
     * this type-testing method instead.
     */
    static isCloudFormationStackArtifact(art: any): art is CloudFormationStackArtifact;
    /**
     * The file name of the template.
     */
    readonly templateFile: string;
    /**
     * The original name as defined in the CDK app.
     */
    readonly originalName: string;
    /**
     * Any assets associated with this stack.
     */
    readonly assets: cxschema.AssetMetadataEntry[];
    /**
     * CloudFormation parameters to pass to the stack.
     */
    readonly parameters: {
        [id: string]: string;
    };
    /**
     * CloudFormation tags to pass to the stack.
     */
    readonly tags: {
        [id: string]: string;
    };
    /**
     * The physical name of this stack.
     */
    readonly stackName: string;
    /**
     * A string that represents this stack. Should only be used in user
     * interfaces. If the stackName has not been set explicitly, or has been set
     * to artifactId, it will return the hierarchicalId of the stack. Otherwise,
     * it will return something like "<hierarchicalId> (<stackName>)"
     */
    readonly displayName: string;
    /**
     * The physical name of this stack.
     * @deprecated renamed to `stackName`
     */
    readonly name: string;
    /**
     * The environment into which to deploy this artifact.
     */
    readonly environment: Environment;
    /**
     * The role that needs to be assumed to deploy the stack
     *
     * @default - No role is assumed (current credentials are used)
     */
    readonly assumeRoleArn?: string;
    /**
     * External ID to use when assuming role for cloudformation deployments
     *
     * @default - No external ID
     */
    readonly assumeRoleExternalId?: string;
    /**
     * The role that is passed to CloudFormation to execute the change set
     *
     * @default - No role is passed (currently assumed role/credentials are used)
     */
    readonly cloudFormationExecutionRoleArn?: string;
    /**
     * The role to use to look up values from the target AWS account
     *
     * @default - No role is assumed (current credentials are used)
     */
    readonly lookupRole?: cxschema.BootstrapRole;
    /**
     * If the stack template has already been included in the asset manifest, its asset URL
     *
     * @default - Not uploaded yet, upload just before deploying
     */
    readonly stackTemplateAssetObjectUrl?: string;
    /**
     * Version of bootstrap stack required to deploy this stack
     *
     * @default - No bootstrap stack required
     */
    readonly requiresBootstrapStackVersion?: number;
    /**
     * Name of SSM parameter with bootstrap stack version
     *
     * @default - Discover SSM parameter by reading stack
     */
    readonly bootstrapStackVersionSsmParameter?: string;
    /**
     * Whether termination protection is enabled for this stack.
     */
    readonly terminationProtection?: boolean;
    /**
     * Whether this stack should be validated by the CLI after synthesis
     *
     * @default - false
     */
    readonly validateOnSynth?: boolean;
    private _template;
    constructor(assembly: CloudAssembly, artifactId: string, artifact: cxschema.ArtifactManifest);
    /**
     * Full path to the template file
     */
    get templateFullPath(): string;
    /**
     * The CloudFormation template for this stack.
     */
    get template(): any;
    private tagsFromMetadata;
}
