import { CloudFormationStackArtifact } from './artifacts/cloudformation-artifact';
import { NestedCloudAssemblyArtifact } from './artifacts/nested-cloud-assembly-artifact';
import { TreeCloudArtifact } from './artifacts/tree-cloud-artifact';
import { CloudArtifact } from './cloud-artifact';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
/**
 * Represents a deployable cloud application.
 */
export declare class CloudAssembly {
    /**
     * The root directory of the cloud assembly.
     */
    readonly directory: string;
    /**
     * The schema version of the assembly manifest.
     */
    readonly version: string;
    /**
     * All artifacts included in this assembly.
     */
    readonly artifacts: CloudArtifact[];
    /**
     * Runtime information such as module versions used to synthesize this assembly.
     */
    readonly runtime: cxschema.RuntimeInfo;
    /**
     * The raw assembly manifest.
     */
    readonly manifest: cxschema.AssemblyManifest;
    /**
     * Reads a cloud assembly from the specified directory.
     * @param directory The root directory of the assembly.
     */
    constructor(directory: string, loadOptions?: cxschema.LoadManifestOptions);
    /**
     * Attempts to find an artifact with a specific identity.
     * @returns A `CloudArtifact` object or `undefined` if the artifact does not exist in this assembly.
     * @param id The artifact ID
     */
    tryGetArtifact(id: string): CloudArtifact | undefined;
    /**
     * Returns a CloudFormation stack artifact from this assembly.
     *
     * Will only search the current assembly.
     *
     * @param stackName the name of the CloudFormation stack.
     * @throws if there is no stack artifact by that name
     * @throws if there is more than one stack with the same stack name. You can
     * use `getStackArtifact(stack.artifactId)` instead.
     * @returns a `CloudFormationStackArtifact` object.
     */
    getStackByName(stackName: string): CloudFormationStackArtifact;
    /**
     * Returns a CloudFormation stack artifact by name from this assembly.
     * @deprecated renamed to `getStackByName` (or `getStackArtifact(id)`)
     */
    getStack(stackName: string): CloudFormationStackArtifact;
    /**
     * Returns a CloudFormation stack artifact from this assembly.
     *
     * @param artifactId the artifact id of the stack (can be obtained through `stack.artifactId`).
     * @throws if there is no stack artifact with that id
     * @returns a `CloudFormationStackArtifact` object.
     */
    getStackArtifact(artifactId: string): CloudFormationStackArtifact;
    private tryGetArtifactRecursively;
    /**
     * Returns all the stacks, including the ones in nested assemblies
     */
    get stacksRecursively(): CloudFormationStackArtifact[];
    /**
     * Returns a nested assembly artifact.
     *
     * @param artifactId The artifact ID of the nested assembly
     */
    getNestedAssemblyArtifact(artifactId: string): NestedCloudAssemblyArtifact;
    /**
     * Returns a nested assembly.
     *
     * @param artifactId The artifact ID of the nested assembly
     */
    getNestedAssembly(artifactId: string): CloudAssembly;
    /**
     * Returns the tree metadata artifact from this assembly.
     * @throws if there is no metadata artifact by that name
     * @returns a `TreeCloudArtifact` object if there is one defined in the manifest, `undefined` otherwise.
     */
    tree(): TreeCloudArtifact | undefined;
    /**
     * @returns all the CloudFormation stack artifacts that are included in this assembly.
     */
    get stacks(): CloudFormationStackArtifact[];
    /**
     * The nested assembly artifacts in this assembly
     */
    get nestedAssemblies(): NestedCloudAssemblyArtifact[];
    private validateDeps;
    private renderArtifacts;
}
/**
 * Construction properties for CloudAssemblyBuilder
 */
export interface CloudAssemblyBuilderProps {
    /**
     * Use the given asset output directory
     *
     * @default - Same as the manifest outdir
     */
    readonly assetOutdir?: string;
    /**
     * If this builder is for a nested assembly, the parent assembly builder
     *
     * @default - This is a root assembly
     */
    readonly parentBuilder?: CloudAssemblyBuilder;
}
/**
 * Can be used to build a cloud assembly.
 */
export declare class CloudAssemblyBuilder {
    /**
     * The root directory of the resulting cloud assembly.
     */
    readonly outdir: string;
    /**
     * The directory where assets of this Cloud Assembly should be stored
     */
    readonly assetOutdir: string;
    private readonly artifacts;
    private readonly missing;
    private readonly parentBuilder?;
    /**
     * Initializes a cloud assembly builder.
     * @param outdir The output directory, uses temporary directory if undefined
     */
    constructor(outdir?: string, props?: CloudAssemblyBuilderProps);
    /**
     * Adds an artifact into the cloud assembly.
     * @param id The ID of the artifact.
     * @param manifest The artifact manifest
     */
    addArtifact(id: string, manifest: cxschema.ArtifactManifest): void;
    /**
     * Reports that some context is missing in order for this cloud assembly to be fully synthesized.
     * @param missing Missing context information.
     */
    addMissing(missing: cxschema.MissingContext): void;
    /**
     * Finalizes the cloud assembly into the output directory returns a
     * `CloudAssembly` object that can be used to inspect the assembly.
     * @param options
     */
    buildAssembly(options?: AssemblyBuildOptions): CloudAssembly;
    /**
     * Creates a nested cloud assembly
     */
    createNestedAssembly(artifactId: string, displayName: string): CloudAssemblyBuilder;
    /**
     * Delete the cloud assembly directory
     */
    delete(): void;
}
/**
 * Backwards compatibility for when `RuntimeInfo`
 * was defined here. This is necessary because its used as an input in the stable
 * @aws-cdk/core library.
 *
 * @deprecated moved to package 'cloud-assembly-schema'
 * @see core.ConstructNode.synth
 */
export interface RuntimeInfo extends cxschema.RuntimeInfo {
}
/**
 * Backwards compatibility for when `MetadataEntry`
 * was defined here. This is necessary because its used as an input in the stable
 * @aws-cdk/core library.
 *
 * @deprecated moved to package 'cloud-assembly-schema'
 * @see core.ConstructNode.metadata
 */
export interface MetadataEntry extends cxschema.MetadataEntry {
}
/**
 * Backwards compatibility for when `MissingContext`
 * was defined here. This is necessary because its used as an input in the stable
 * @aws-cdk/core library.
 *
 * @deprecated moved to package 'cloud-assembly-schema'
 * @see core.Stack.reportMissingContext
 */
export interface MissingContext {
    /**
     * The missing context key.
     */
    readonly key: string;
    /**
     * The provider from which we expect this context key to be obtained.
     *
     * (This is the old untyped definition, which is necessary for backwards compatibility.
     * See cxschema for a type definition.)
     */
    readonly provider: string;
    /**
     * A set of provider-specific options.
     *
     * (This is the old untyped definition, which is necessary for backwards compatibility.
     * See cxschema for a type definition.)
     */
    readonly props: Record<string, any>;
}
export interface AssemblyBuildOptions {
    /**
     * Include the specified runtime information (module versions) in manifest.
     * @default - if this option is not specified, runtime info will not be included
     * @deprecated All template modifications that should result from this should
     * have already been inserted into the template.
     */
    readonly runtimeInfo?: RuntimeInfo;
}
