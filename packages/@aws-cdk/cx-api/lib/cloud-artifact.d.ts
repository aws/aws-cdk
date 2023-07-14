import type { CloudAssembly } from './cloud-assembly';
import { MetadataEntryResult, SynthesisMessage } from './metadata';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
/**
 * Artifact properties for CloudFormation stacks.
 */
export interface AwsCloudFormationStackProperties {
    /**
     * A file relative to the assembly root which contains the CloudFormation template for this stack.
     */
    readonly templateFile: string;
    /**
     * Values for CloudFormation stack parameters that should be passed when the stack is deployed.
     */
    readonly parameters?: {
        [id: string]: string;
    };
    /**
     * The name to use for the CloudFormation stack.
     * @default - name derived from artifact ID
     */
    readonly stackName?: string;
    /**
     * Whether to enable termination protection for this stack.
     *
     * @default false
     */
    readonly terminationProtection?: boolean;
}
/**
 * Represents an artifact within a cloud assembly.
 */
export declare class CloudArtifact {
    readonly assembly: CloudAssembly;
    readonly id: string;
    /**
     * Returns a subclass of `CloudArtifact` based on the artifact type defined in the artifact manifest.
     *
     * @param assembly The cloud assembly from which to load the artifact
     * @param id The artifact ID
     * @param artifact The artifact manifest
     * @returns the `CloudArtifact` that matches the artifact type or `undefined` if it's an artifact type that is unrecognized by this module.
     */
    static fromManifest(assembly: CloudAssembly, id: string, artifact: cxschema.ArtifactManifest): CloudArtifact | undefined;
    /**
     * The artifact's manifest
     */
    readonly manifest: cxschema.ArtifactManifest;
    /**
     * The set of messages extracted from the artifact's metadata.
     */
    readonly messages: SynthesisMessage[];
    /**
     * IDs of all dependencies. Used when topologically sorting the artifacts within the cloud assembly.
     * @internal
     */
    readonly _dependencyIDs: string[];
    /**
     * Cache of resolved dependencies.
     */
    private _deps?;
    protected constructor(assembly: CloudAssembly, id: string, manifest: cxschema.ArtifactManifest);
    /**
     * Returns all the artifacts that this artifact depends on.
     */
    get dependencies(): CloudArtifact[];
    /**
     * @returns all the metadata entries of a specific type in this artifact.
     * @param type
     */
    findMetadataByType(type: string): MetadataEntryResult[];
    private renderMessages;
    /**
     * An identifier that shows where this artifact is located in the tree
     * of nested assemblies, based on their manifests. Defaults to the normal
     * id. Should only be used in user interfaces.
     */
    get hierarchicalId(): string;
}
