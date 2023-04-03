import { StackSynthesizer } from './stack-synthesizer';
import { ISynthesisSession, IReusableStackSynthesizer, IBoundStackSynthesizer } from './types';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { Stack } from '../stack';
export declare const BOOTSTRAP_QUALIFIER_CONTEXT = "@aws-cdk/core:bootstrapQualifier";
/**
 * Configuration properties for DefaultStackSynthesizer
 */
export interface DefaultStackSynthesizerProps {
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
     * The role to use to publish file assets to the S3 bucket in this environment
     *
     * You must supply this if you have given a non-standard name to the publishing role.
     *
     * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
     * be replaced with the values of qualifier and the stack's account and region,
     * respectively.
     *
     * @default DefaultStackSynthesizer.DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN
     */
    readonly fileAssetPublishingRoleArn?: string;
    /**
     * External ID to use when assuming role for file asset publishing
     *
     * @default - No external ID
     */
    readonly fileAssetPublishingExternalId?: string;
    /**
     * The role to use to publish image assets to the ECR repository in this environment
     *
     * You must supply this if you have given a non-standard name to the publishing role.
     *
     * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
     * be replaced with the values of qualifier and the stack's account and region,
     * respectively.
     *
     * @default DefaultStackSynthesizer.DEFAULT_IMAGE_ASSET_PUBLISHING_ROLE_ARN
     */
    readonly imageAssetPublishingRoleArn?: string;
    /**
     * The role to use to look up values from the target AWS account during synthesis
     *
     * @default - None
     */
    readonly lookupRoleArn?: string;
    /**
     * External ID to use when assuming lookup role
     *
     * @default - No external ID
     */
    readonly lookupRoleExternalId?: string;
    /**
     * Use the bootstrapped lookup role for (read-only) stack operations
     *
     * Use the lookup role when performing a `cdk diff`. If set to `false`, the
     * `deploy role` credentials will be used to perform a `cdk diff`.
     *
     * Requires bootstrap stack version 8.
     *
     * @default true
     */
    readonly useLookupRoleForStackOperations?: boolean;
    /**
     * External ID to use when assuming role for image asset publishing
     *
     * @default - No external ID
     */
    readonly imageAssetPublishingExternalId?: string;
    /**
     * External ID to use when assuming role for cloudformation deployments
     *
     * @default - No external ID
     */
    readonly deployRoleExternalId?: string;
    /**
     * The role to assume to initiate a deployment in this environment
     *
     * You must supply this if you have given a non-standard name to the publishing role.
     *
     * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
     * be replaced with the values of qualifier and the stack's account and region,
     * respectively.
     *
     * @default DefaultStackSynthesizer.DEFAULT_DEPLOY_ROLE_ARN
     */
    readonly deployRoleArn?: string;
    /**
     * The role CloudFormation will assume when deploying the Stack
     *
     * You must supply this if you have given a non-standard name to the execution role.
     *
     * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
     * be replaced with the values of qualifier and the stack's account and region,
     * respectively.
     *
     * @default DefaultStackSynthesizer.DEFAULT_CLOUDFORMATION_ROLE_ARN
     */
    readonly cloudFormationExecutionRole?: string;
    /**
     * Name of the CloudFormation Export with the asset key name
     *
     * You must supply this if you have given a non-standard name to the KMS key export
     *
     * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
     * be replaced with the values of qualifier and the stack's account and region,
     * respectively.
     *
     * @default DefaultStackSynthesizer.DEFAULT_FILE_ASSET_KEY_ARN_EXPORT_NAME
     * @deprecated This property is not used anymore
     */
    readonly fileAssetKeyArnExportName?: string;
    /**
     * Qualifier to disambiguate multiple environments in the same account
     *
     * You can use this and leave the other naming properties empty if you have deployed
     * the bootstrap environment with standard names but only different qualifiers.
     *
     * @default - Value of context key '@aws-cdk/core:bootstrapQualifier' if set, otherwise `DefaultStackSynthesizer.DEFAULT_QUALIFIER`
     */
    readonly qualifier?: string;
    /**
     * Whether to add a Rule to the stack template verifying the bootstrap stack version
     *
     * This generally should be left set to `true`, unless you explicitly
     * want to be able to deploy to an unbootstrapped environment.
     *
     * @default true
     */
    readonly generateBootstrapVersionRule?: boolean;
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
    /**
     * Bootstrap stack version SSM parameter.
     *
     * The placeholder `${Qualifier}` will be replaced with the value of qualifier.
     *
     * @default DefaultStackSynthesizer.DEFAULT_BOOTSTRAP_STACK_VERSION_SSM_PARAMETER
     */
    readonly bootstrapStackVersionSsmParameter?: string;
}
/**
 * Uses conventionally named roles and asset storage locations
 *
 * This synthesizer:
 *
 * - Supports cross-account deployments (the CLI can have credentials to one
 *   account, and you can still deploy to another account by assuming roles with
 *   well-known names in the other account).
 * - Supports the **CDK Pipelines** library.
 *
 * Requires the environment to have been bootstrapped with Bootstrap Stack V2
 * (also known as "modern bootstrap stack"). The synthesizer adds a version
 * check to the template, to make sure the bootstrap stack is recent enough
 * to support all features expected by this synthesizer.
 */
export declare class DefaultStackSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer, IBoundStackSynthesizer {
    private readonly props;
    /**
     * Default ARN qualifier
     */
    static readonly DEFAULT_QUALIFIER = "hnb659fds";
    /**
     * Default CloudFormation role ARN.
     */
    static readonly DEFAULT_CLOUDFORMATION_ROLE_ARN = "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-cfn-exec-role-${AWS::AccountId}-${AWS::Region}";
    /**
     * Default deploy role ARN.
     */
    static readonly DEFAULT_DEPLOY_ROLE_ARN = "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-deploy-role-${AWS::AccountId}-${AWS::Region}";
    /**
     * Default asset publishing role ARN for file (S3) assets.
     */
    static readonly DEFAULT_FILE_ASSET_PUBLISHING_ROLE_ARN = "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-file-publishing-role-${AWS::AccountId}-${AWS::Region}";
    /**
     * Default asset publishing role ARN for image (ECR) assets.
     */
    static readonly DEFAULT_IMAGE_ASSET_PUBLISHING_ROLE_ARN = "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-image-publishing-role-${AWS::AccountId}-${AWS::Region}";
    /**
     * Default lookup role ARN for missing values.
     */
    static readonly DEFAULT_LOOKUP_ROLE_ARN = "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/cdk-${Qualifier}-lookup-role-${AWS::AccountId}-${AWS::Region}";
    /**
     * Default image assets repository name
     */
    static readonly DEFAULT_IMAGE_ASSETS_REPOSITORY_NAME = "cdk-${Qualifier}-container-assets-${AWS::AccountId}-${AWS::Region}";
    /**
     * Default file assets bucket name
     */
    static readonly DEFAULT_FILE_ASSETS_BUCKET_NAME = "cdk-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}";
    /**
     * Name of the CloudFormation Export with the asset key name
     */
    static readonly DEFAULT_FILE_ASSET_KEY_ARN_EXPORT_NAME = "CdkBootstrap-${Qualifier}-FileAssetKeyArn";
    /**
     * Default file asset prefix
     */
    static readonly DEFAULT_FILE_ASSET_PREFIX = "";
    /**
     * Default Docker asset prefix
     */
    static readonly DEFAULT_DOCKER_ASSET_PREFIX = "";
    /**
     * Default bootstrap stack version SSM parameter.
     */
    static readonly DEFAULT_BOOTSTRAP_STACK_VERSION_SSM_PARAMETER = "/cdk-bootstrap/${Qualifier}/version";
    private bucketName?;
    private repositoryName?;
    private _deployRoleArn?;
    private _cloudFormationExecutionRoleArn?;
    private fileAssetPublishingRoleArn?;
    private imageAssetPublishingRoleArn?;
    private lookupRoleArn?;
    private useLookupRoleForStackOperations;
    private qualifier?;
    private bucketPrefix?;
    private dockerTagPrefix?;
    private bootstrapStackVersionSsmParameter?;
    private assetManifest;
    constructor(props?: DefaultStackSynthesizerProps);
    /**
     * Produce a bound Stack Synthesizer for the given stack.
     *
     * This method may be called more than once on the same object.
     */
    reusableBind(stack: Stack): IBoundStackSynthesizer;
    /**
     * The qualifier used to bootstrap this stack
     */
    get bootstrapQualifier(): string | undefined;
    bind(stack: Stack): void;
    addFileAsset(asset: FileAssetSource): FileAssetLocation;
    addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;
    /**
     * Synthesize the stack template to the given session, passing the configured lookup role ARN
     */
    protected synthesizeStackTemplate(stack: Stack, session: ISynthesisSession): void;
    /**
     * Return the currently bound stack
     *
     * @deprecated Use `boundStack` instead.
     */
    protected get stack(): Stack | undefined;
    /**
     * Synthesize the associated stack to the session
     */
    synthesize(session: ISynthesisSession): void;
    /**
     * Returns the ARN of the deploy Role.
     */
    get deployRoleArn(): string;
    /**
     * Returns the ARN of the CFN execution Role.
     */
    get cloudFormationExecutionRoleArn(): string;
}
