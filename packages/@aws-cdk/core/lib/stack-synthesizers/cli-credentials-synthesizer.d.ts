import { StackSynthesizer } from './stack-synthesizer';
import { ISynthesisSession, IReusableStackSynthesizer, IBoundStackSynthesizer } from './types';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { Stack } from '../stack';
/**
 * Properties for the CliCredentialsStackSynthesizer
 */
export interface CliCredentialsStackSynthesizerProps {
    /**
     * Name of the S3 bucket to hold file assets
     *
     * You must supply this if you have given a non-standard name to the staging bucket.
     *
     * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
     * be replaced with the values of qualifier and the stack's account and region,
     * respectively.
     *
     * @default DefaultStackSynthesizer.DEFAULT_FILE_ASSETS_BUCKET_NAME
     */
    readonly fileAssetsBucketName?: string;
    /**
     * Name of the ECR repository to hold Docker Image assets
     *
     * You must supply this if you have given a non-standard name to the ECR repository.
     *
     * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
     * be replaced with the values of qualifier and the stack's account and region,
     * respectively.
     *
     * @default DefaultStackSynthesizer.DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME
     */
    readonly imageAssetsRepositoryName?: string;
    /**
     * Qualifier to disambiguate multiple environments in the same account
     *
     * You can use this and leave the other naming properties empty if you have deployed
     * the bootstrap environment with standard names but only differnet qualifiers.
     *
     * @default - Value of context key '@aws-cdk/core:bootstrapQualifier' if set, otherwise `DefaultStackSynthesizer.DEFAULT_QUALIFIER`
     */
    readonly qualifier?: string;
    /**
     * bucketPrefix to use while storing S3 Assets
     *
     * @default - DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PREFIX
     */
    readonly bucketPrefix?: string;
    /**
     * A prefix to use while tagging and uploading Docker images to ECR.
     *
     * This does not add any separators - the source hash will be appended to
     * this string directly.
     *
     * @default - DefaultStackSynthesizer.DEFAULT_DOCKER_ASSET_PREFIX
     */
    readonly dockerTagPrefix?: string;
}
/**
 * A synthesizer that uses conventional asset locations, but not conventional deployment roles
 *
 * Instead of assuming the bootstrapped deployment roles, all stack operations will be performed
 * using the CLI's current credentials.
 *
 * - This synthesizer does not support deploying to accounts to which the CLI does not have
 *   credentials. It also does not support deploying using **CDK Pipelines**. For either of those
 *   features, use `DefaultStackSynthesizer`.
 * - This synthesizer requires an S3 bucket and ECR repository with well-known names. To
 *   not depend on those, use `LegacyStackSynthesizer`.
 *
 * Be aware that your CLI credentials must be valid for the duration of the
 * entire deployment. If you are using session credentials, make sure the
 * session lifetime is long enough.
 *
 * By default, expects the environment to have been bootstrapped with just the staging resources
 * of the Bootstrap Stack V2 (also known as "modern bootstrap stack"). You can override
 * the default names using the synthesizer's construction properties.
 */
export declare class CliCredentialsStackSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer, IBoundStackSynthesizer {
    private readonly props;
    private qualifier?;
    private bucketName?;
    private repositoryName?;
    private bucketPrefix?;
    private dockerTagPrefix?;
    private readonly assetManifest;
    constructor(props?: CliCredentialsStackSynthesizerProps);
    /**
     * The qualifier used to bootstrap this stack
     */
    get bootstrapQualifier(): string | undefined;
    bind(stack: Stack): void;
    /**
     * Produce a bound Stack Synthesizer for the given stack.
     *
     * This method may be called more than once on the same object.
     */
    reusableBind(stack: Stack): IBoundStackSynthesizer;
    addFileAsset(asset: FileAssetSource): FileAssetLocation;
    addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;
    /**
     * Synthesize the associated stack to the session
     */
    synthesize(session: ISynthesisSession): void;
}
