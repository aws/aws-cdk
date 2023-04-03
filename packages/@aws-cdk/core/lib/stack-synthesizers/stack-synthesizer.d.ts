import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { IStackSynthesizer, ISynthesisSession } from './types';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { Stack } from '../stack';
/**
 * Base class for implementing an IStackSynthesizer
 *
 * This class needs to exist to provide public surface area for external
 * implementations of stack synthesizers. The protected methods give
 * access to functions that are otherwise @_internal to the framework
 * and could not be accessed by external implementors.
 */
export declare abstract class StackSynthesizer implements IStackSynthesizer {
    /**
     * The qualifier used to bootstrap this stack
     */
    get bootstrapQualifier(): string | undefined;
    private _boundStack?;
    /**
     * Bind to the stack this environment is going to be used on
     *
     * Must be called before any of the other methods are called.
     */
    bind(stack: Stack): void;
    /**
     * Register a File Asset
     *
     * Returns the parameters that can be used to refer to the asset inside the template.
     *
     * The synthesizer must rely on some out-of-band mechanism to make sure the given files
     * are actually placed in the returned location before the deployment happens. This can
     * be by writing the instructions to the asset manifest (for use by the `cdk-assets` tool),
     * by relying on the CLI to upload files (legacy behavior), or some other operator controlled
     * mechanism.
     */
    abstract addFileAsset(asset: FileAssetSource): FileAssetLocation;
    /**
     * Register a Docker Image Asset
     *
     * Returns the parameters that can be used to refer to the asset inside the template.
     *
     * The synthesizer must rely on some out-of-band mechanism to make sure the given files
     * are actually placed in the returned location before the deployment happens. This can
     * be by writing the instructions to the asset manifest (for use by the `cdk-assets` tool),
     * by relying on the CLI to upload files (legacy behavior), or some other operator controlled
     * mechanism.
     */
    abstract addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;
    /**
     * Synthesize the associated stack to the session
     */
    abstract synthesize(session: ISynthesisSession): void;
    /**
     * Have the stack write out its template
     *
     * @deprecated Use `synthesizeTemplate` instead
     */
    protected synthesizeStackTemplate(stack: Stack, session: ISynthesisSession): void;
    /**
     * Write the stack template to the given session
     *
     * Return a descriptor that represents the stack template as a file asset
     * source, for adding to an asset manifest (if desired). This can be used to
     * have the asset manifest system (`cdk-assets`) upload the template to S3
     * using the appropriate role, so that afterwards only a CloudFormation
     * deployment is necessary.
     *
     * If the template is uploaded as an asset, the `stackTemplateAssetObjectUrl`
     * property should be set when calling `emitArtifact.`
     *
     * If the template is *NOT* uploaded as an asset first and the template turns
     * out to be >50KB, it will need to be uploaded to S3 anyway. At that point
     * the credentials will be the same identity that is doing the `UpdateStack`
     * call, which may not have the right permissions to write to S3.
     */
    protected synthesizeTemplate(session: ISynthesisSession, lookupRoleArn?: string): FileAssetSource;
    /**
     * Write the stack artifact to the session
     *
     * Use default settings to add a CloudFormationStackArtifact artifact to
     * the given synthesis session.
     *
     * @deprecated Use `emitArtifact` instead
     */
    protected emitStackArtifact(stack: Stack, session: ISynthesisSession, options?: SynthesizeStackArtifactOptions): void;
    /**
     * Write the CloudFormation stack artifact to the session
     *
     * Use default settings to add a CloudFormationStackArtifact artifact to
     * the given synthesis session. The Stack artifact will control the settings for the
     * CloudFormation deployment.
     */
    protected emitArtifact(session: ISynthesisSession, options?: SynthesizeStackArtifactOptions): void;
    /**
     * Add a CfnRule to the bound stack that checks whether an SSM parameter exceeds a given version
     *
     * This will modify the template, so must be called before the stack is synthesized.
     */
    protected addBootstrapVersionRule(requiredVersion: number, bootstrapStackVersionSsmParameter: string): void;
    /**
     * Retrieve the bound stack
     *
     * Fails if the stack hasn't been bound yet.
     */
    protected get boundStack(): Stack;
    /**
     * Turn a file asset location into a CloudFormation representation of that location
     *
     * If any of the fields contain placeholders, the result will be wrapped in a `Fn.sub`.
     */
    protected cloudFormationLocationFromFileAsset(location: cxschema.FileDestination): FileAssetLocation;
    /**
     * Turn a docker asset location into a CloudFormation representation of that location
     *
     * If any of the fields contain placeholders, the result will be wrapped in a `Fn.sub`.
     */
    protected cloudFormationLocationFromDockerImageAsset(dest: cxschema.DockerImageDestination): DockerImageAssetLocation;
}
/**
 * Stack artifact options
 *
 * A subset of `cxschema.AwsCloudFormationStackProperties` of optional settings that need to be
 * configurable by synthesizers, plus `additionalDependencies`.
 */
export interface SynthesizeStackArtifactOptions {
    /**
     * Identifiers of additional dependencies
     *
     * @default - No additional dependencies
     */
    readonly additionalDependencies?: string[];
    /**
     * Values for CloudFormation stack parameters that should be passed when the stack is deployed.
     *
     * @default - No parameters
     */
    readonly parameters?: {
        [id: string]: string;
    };
    /**
     * The role that needs to be assumed to deploy the stack
     *
     * @default - No role is assumed (current credentials are used)
     */
    readonly assumeRoleArn?: string;
    /**
     * The externalID to use with the assumeRoleArn
     *
     * @default - No externalID is used
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
     * @default - None
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
     * SSM parameter where the bootstrap stack version number can be found
     *
     * Only used if `requiresBootstrapStackVersion` is set.
     *
     * - If this value is not set, the bootstrap stack name must be known at
     *   deployment time so the stack version can be looked up from the stack
     *   outputs.
     * - If this value is set, the bootstrap stack can have any name because
     *   we won't need to look it up.
     *
     * @default - Bootstrap stack version number looked up
     */
    readonly bootstrapStackVersionSsmParameter?: string;
}
