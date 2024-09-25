import { ArtifactProperties } from './artifact-schema';
import { ContextProvider, ContextQueryProperties } from './context-queries';
import { MetadataEntry } from './metadata-schema';
/**
 * Type of cloud artifact.
 */
export declare enum ArtifactType {
    /**
     * Stub required because of JSII.
     */
    NONE = "none",// required due to a jsii bug
    /**
     * The artifact is an AWS CloudFormation stack.
     */
    AWS_CLOUDFORMATION_STACK = "aws:cloudformation:stack",
    /**
     * The artifact contains the CDK application's construct tree.
     */
    CDK_TREE = "cdk:tree",
    /**
     * Manifest for all assets in the Cloud Assembly
     */
    ASSET_MANIFEST = "cdk:asset-manifest",
    /**
     * Nested Cloud Assembly
     */
    NESTED_CLOUD_ASSEMBLY = "cdk:cloud-assembly"
}
/**
 * Information about the application's runtime components.
 */
export interface RuntimeInfo {
    /**
     * The list of libraries loaded in the application, associated with their versions.
     */
    readonly libraries: {
        [name: string]: string;
    };
}
/**
 * Represents a missing piece of context.
 */
export interface MissingContext {
    /**
     * The missing context key.
     */
    readonly key: string;
    /**
     * The provider from which we expect this context key to be obtained.
     */
    readonly provider: ContextProvider;
    /**
     * A set of provider-specific options.
     */
    readonly props: ContextQueryProperties;
}
/**
 * A manifest for a single artifact within the cloud assembly.
 */
export interface ArtifactManifest {
    /**
     * The type of artifact.
     */
    readonly type: ArtifactType;
    /**
     * The environment into which this artifact is deployed.
     *
     * @default - no envrionment.
     */
    readonly environment?: string;
    /**
     * Associated metadata.
     *
     * @default - no metadata.
     */
    readonly metadata?: {
        [path: string]: MetadataEntry[];
    };
    /**
     * IDs of artifacts that must be deployed before this artifact.
     *
     * @default - no dependencies.
     */
    readonly dependencies?: string[];
    /**
     * The set of properties for this artifact (depends on type)
     *
     * @default - no properties.
     */
    readonly properties?: ArtifactProperties;
    /**
     * A string that represents this artifact. Should only be used in user interfaces.
     *
     * @default - no display name
     */
    readonly displayName?: string;
}
/**
 * A manifest which describes the cloud assembly.
 */
export interface AssemblyManifest {
    /**
     * Protocol version
     */
    readonly version: string;
    /**
     * The set of artifacts in this assembly.
     *
     * @default - no artifacts.
     */
    readonly artifacts?: {
        [id: string]: ArtifactManifest;
    };
    /**
     * Missing context information. If this field has values, it means that the
     * cloud assembly is not complete and should not be deployed.
     *
     * @default - no missing context.
     */
    readonly missing?: MissingContext[];
    /**
     * Runtime information.
     *
     * @default - no info.
     */
    readonly runtime?: RuntimeInfo;
}
