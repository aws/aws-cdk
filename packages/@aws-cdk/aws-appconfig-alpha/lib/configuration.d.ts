import * as cp from 'aws-cdk-lib/aws-codepipeline';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sm from 'aws-cdk-lib/aws-secretsmanager';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import { Construct, IConstruct } from 'constructs';
import { IApplication } from './application';
import { IDeploymentStrategy } from './deployment-strategy';
import { IEnvironment } from './environment';
import { ActionPoint, IEventDestination, ExtensionOptions, IExtension, IExtensible, ExtensibleBase } from './extension';
/**
 * Options for the Configuration construct
 */
export interface ConfigurationOptions {
    /**
     * The deployment strategy for the configuration.
     *
     * @default - A deployment strategy with the rollout strategy set to
     * RolloutStrategy.CANARY_10_PERCENT_20_MINUTES
     */
    readonly deploymentStrategy?: IDeploymentStrategy;
    /**
     * The name of the configuration.
     *
     * @default - A name is generated.
     */
    readonly name?: string;
    /**
     * The validators for the configuration.
     *
     * @default - No validators.
     */
    readonly validators?: IValidator[];
    /**
     * The description of the configuration.
     *
     * @default - No description.
     */
    readonly description?: string;
    /**
     * The type of configuration.
     *
     * @default ConfigurationType.FREEFORM
     */
    readonly type?: ConfigurationType;
    /**
     * The list of environments to deploy the configuration to.
     *
     * If this parameter is not specified, then there will be no
     * deployment.
     *
     * @default - None.
     */
    readonly deployTo?: IEnvironment[];
    /**
     * The deployment key of the configuration.
     *
     * @default - None.
     */
    readonly deploymentKey?: kms.IKey;
}
/**
 * Properties for the Configuration construct.
 */
export interface ConfigurationProps extends ConfigurationOptions {
    /**
     * The application associated with the configuration.
     */
    readonly application: IApplication;
}
export interface IConfiguration extends IConstruct {
    /**
     * The deployment strategy for the configuration.
     */
    readonly deploymentStrategy?: IDeploymentStrategy;
    /**
     * The configuration version number.
     */
    readonly versionNumber?: string;
    /**
     * The application associated with the configuration.
     */
    readonly application: IApplication;
    /**
     * The name of the configuration.
     */
    readonly name?: string;
    /**
     * The validators for the configuration.
     */
    readonly validators?: IValidator[];
    /**
     * The description of the configuration.
     */
    readonly description?: string;
    /**
     * The configuration type.
     */
    readonly type?: ConfigurationType;
    /**
     * The environments to deploy to.
     */
    readonly deployTo?: IEnvironment[];
    /**
     * The deployment key for the configuration.
     */
    readonly deploymentKey?: kms.IKey;
    /**
     * The ID of the configuration profile.
     */
    readonly configurationProfileId: string;
}
declare abstract class ConfigurationBase extends Construct implements IConfiguration, IExtensible {
    abstract readonly versionNumber?: string;
    abstract readonly configurationProfileId: string;
    /**
     * The application associated with the configuration.
     */
    readonly application: IApplication;
    /**
     * The environments to deploy to.
     */
    readonly deployTo?: IEnvironment[];
    /**
     * The name of the configuration.
     */
    readonly name?: string;
    /**
     * The validators for the configuration.
     */
    readonly validators?: IValidator[];
    /**
     * The description of the configuration.
     */
    readonly description?: string;
    /**
     * The configuration type.
     */
    readonly type?: ConfigurationType;
    /**
     * The deployment key for the configuration.
     */
    readonly deploymentKey?: kms.IKey;
    /**
     * The deployment strategy for the configuration.
     */
    readonly deploymentStrategy?: IDeploymentStrategy;
    protected applicationId: string;
    protected extensible: ExtensibleBase;
    constructor(scope: Construct, id: string, props: ConfigurationProps);
    /**
     * Adds an extension defined by the action point and event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param actionPoint The action point which triggers the event
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds a PRE_CREATE_HOSTED_CONFIGURATION_VERSION extension with the
     * provided event destination and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds a PRE_START_DEPLOYMENT extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_START extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
     * also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination
     * and also creates an extension association to the configuration profile.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an extension association to the configuration profile.
     *
     * @param extension The extension to create an association for
     */
    addExtension(extension: IExtension): void;
    /**
     * Deploys the configuration to the specified environment.
     *
     * @param environment The environment to deploy the configuration to
     * @deprecated Use `deployTo` as a property instead. We do not recommend
     * creating resources in multiple stacks. If you want to do this still,
     * please take a look into https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_appconfig.CfnDeployment.html.
     */
    deploy(environment: IEnvironment): void;
    protected addExistingEnvironmentsToApplication(): void;
    protected deployConfigToEnvironments(): void;
}
/**
 * Options for HostedConfiguration
 */
export interface HostedConfigurationOptions extends ConfigurationOptions {
    /**
     * The content of the hosted configuration.
     */
    readonly content: ConfigurationContent;
    /**
     * The latest version number of the hosted configuration.
     *
     * @default - None.
     */
    readonly latestVersionNumber?: number;
    /**
     * The version label of the hosted configuration.
     *
     * @default - None.
     */
    readonly versionLabel?: string;
}
/**
 * Properties for HostedConfiguration
 */
export interface HostedConfigurationProps extends ConfigurationProps {
    /**
     * The content of the hosted configuration.
     */
    readonly content: ConfigurationContent;
    /**
     * The latest version number of the hosted configuration.
     *
     * @default - None.
     */
    readonly latestVersionNumber?: number;
    /**
     * The version label of the hosted configuration.
     *
     * @default - None.
     */
    readonly versionLabel?: string;
}
/**
 * A hosted configuration represents configuration stored in the AWS AppConfig hosted configuration store.
 */
export declare class HostedConfiguration extends ConfigurationBase {
    /**
     * The content of the hosted configuration.
     */
    readonly content: string;
    /**
     * The content type of the hosted configuration.
     */
    readonly contentType?: string;
    /**
     * The latest version number of the hosted configuration.
     */
    readonly latestVersionNumber?: number;
    /**
     * The version label of the hosted configuration.
     */
    readonly versionLabel?: string;
    /**
     * The version number of the hosted configuration.
     */
    readonly versionNumber?: string;
    /**
     * The Amazon Resource Name (ARN) of the hosted configuration version.
     */
    readonly hostedConfigurationVersionArn: string;
    /**
     * The ID of the configuration profile.
     */
    readonly configurationProfileId: string;
    /**
     * The Amazon Resource Name (ARN) of the configuration profile.
     */
    readonly configurationProfileArn: string;
    private readonly _cfnConfigurationProfile;
    private readonly _cfnHostedConfigurationVersion;
    constructor(scope: Construct, id: string, props: HostedConfigurationProps);
}
/**
 * Options for SourcedConfiguration
 */
export interface SourcedConfigurationOptions extends ConfigurationOptions {
    /**
     * The location where the configuration is stored.
     */
    readonly location: ConfigurationSource;
    /**
     * The version number of the sourced configuration to deploy. If this is not specified,
     * then there will be no deployment.
     *
     * @default - None.
     */
    readonly versionNumber?: string;
    /**
     * The IAM role to retrieve the configuration.
     *
     * @default - A role is generated.
     */
    readonly retrievalRole?: iam.IRole;
}
/**
 * Properties for SourcedConfiguration.
 */
export interface SourcedConfigurationProps extends ConfigurationProps {
    /**
     * The location where the configuration is stored.
     */
    readonly location: ConfigurationSource;
    /**
     * The version number of the sourced configuration to deploy. If this is not specified,
     * then there will be no deployment.
     *
     * @default - None.
     */
    readonly versionNumber?: string;
    /**
     * The IAM role to retrieve the configuration.
     *
     * @default - A role is generated.
     */
    readonly retrievalRole?: iam.IRole;
}
/**
 * A sourced configuration represents configuration stored in an Amazon S3 bucket, AWS Secrets Manager secret, Systems Manager
 * (SSM) Parameter Store parameter, SSM document, or AWS CodePipeline.
 */
export declare class SourcedConfiguration extends ConfigurationBase {
    /**
     * The location where the configuration is stored.
     */
    readonly location: ConfigurationSource;
    /**
     * The version number of the configuration to deploy.
     */
    readonly versionNumber?: string;
    /**
     * The IAM role to retrieve the configuration.
     */
    readonly retrievalRole?: iam.IRole;
    /**
     * The key to decrypt the configuration if applicable. This key
     * can be used when storing configuration in AWS Secrets Manager, Systems Manager Parameter Store,
     * or Amazon S3.
     */
    readonly sourceKey?: kms.IKey;
    /**
     * The ID of the configuration profile.
     */
    readonly configurationProfileId: string;
    /**
     * The Amazon Resource Name (ARN) of the configuration profile.
     */
    readonly configurationProfileArn: string;
    private readonly locationUri;
    private readonly _cfnConfigurationProfile;
    constructor(scope: Construct, id: string, props: SourcedConfigurationProps);
    private getPolicyForRole;
}
/**
 * The configuration type.
 */
export declare enum ConfigurationType {
    /**
     * Freeform configuration profile. Allows you to store your data in the AWS AppConfig
     * hosted configuration store or another Systems Manager capability or AWS service that integrates
     * with AWS AppConfig.
     *
     * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-free-form-configurations-creating.html
     */
    FREEFORM = "AWS.Freeform",
    /**
     * Feature flag configuration profile. This configuration stores its data
     * in the AWS AppConfig hosted configuration store and the URI is simply hosted.
     */
    FEATURE_FLAGS = "AWS.AppConfig.FeatureFlags"
}
/**
 * The validator type.
 */
export declare enum ValidatorType {
    /**
     * JSON Scema validator.
     */
    JSON_SCHEMA = "JSON_SCHEMA",
    /**
     * Validate using a Lambda function.
     */
    LAMBDA = "LAMBDA"
}
/**
 * The configuration source type.
 */
export declare enum ConfigurationSourceType {
    S3 = "S3",
    SECRETS_MANAGER = "SECRETS_MANAGER",
    SSM_PARAMETER = "SSM_PARAMETER",
    SSM_DOCUMENT = "SSM_DOCUMENT",
    CODE_PIPELINE = "CODE_PIPELINE"
}
export interface IValidator {
    /**
     * The content of the validator.
     */
    readonly content: string;
    /**
     * The type of validator.
     */
    readonly type: ValidatorType;
}
/**
 * Defines a JSON Schema validator.
 */
export declare abstract class JsonSchemaValidator implements IValidator {
    /**
     * Defines a JSON Schema validator from a file.
     *
     * @param inputPath The path to the file that defines the validator
     */
    static fromFile(inputPath: string): JsonSchemaValidator;
    /**
     * Defines a JSON Schema validator from inline code.
     *
     * @param code The inline code that defines the validator
     */
    static fromInline(code: string): JsonSchemaValidator;
    abstract readonly content: string;
    abstract readonly type: ValidatorType;
}
/**
 * Defines an AWS Lambda validator.
 */
export declare abstract class LambdaValidator implements IValidator {
    /**
     *  Defines an AWS Lambda validator from a Lambda function. This will call
     * `addPermission` to your function to grant AWS AppConfig permissions.
     *
     * @param func The function that defines the validator
     */
    static fromFunction(func: lambda.Function): LambdaValidator;
    abstract readonly content: string;
    abstract readonly type: ValidatorType;
}
/**
 * Defines the hosted configuration content.
 */
export declare abstract class ConfigurationContent {
    /**
     * Defines the hosted configuration content from a file.
     *
     * @param inputPath The path to the file that defines configuration content
     * @param contentType The content type of the configuration
     */
    static fromFile(inputPath: string, contentType?: string): ConfigurationContent;
    /**
     * Defines the hosted configuration content from inline code.
     *
     * @param content The inline code that defines the configuration content
     * @param contentType The content type of the configuration
     */
    static fromInline(content: string, contentType?: string): ConfigurationContent;
    /**
     * Defines the hosted configuration content as JSON from inline code.
     *
     * @param content The inline code that defines the configuration content
     * @param contentType The content type of the configuration
     */
    static fromInlineJson(content: string, contentType?: string): ConfigurationContent;
    /**
     * Defines the hosted configuration content as text from inline code.
     *
     * @param content The inline code that defines the configuration content
     */
    static fromInlineText(content: string): ConfigurationContent;
    /**
     * Defines the hosted configuration content as YAML from inline code.
     *
     * @param content The inline code that defines the configuration content
     */
    static fromInlineYaml(content: string): ConfigurationContent;
    /**
     * The configuration content.
     */
    abstract readonly content: string;
    /**
     * The configuration content type.
     */
    abstract readonly contentType: string;
}
/**
 * Defines the integrated configuration sources.
 */
export declare abstract class ConfigurationSource {
    /**
     * Defines configuration content from an Amazon S3 bucket.
     *
     * @param bucket The S3 bucket where the configuration is stored
     * @param objectKey The path to the configuration
     * @param key The KMS Key that the bucket is encrypted with
     */
    static fromBucket(bucket: s3.IBucket, objectKey: string, key?: kms.IKey): ConfigurationSource;
    /**
     * Defines configuration content from an AWS Secrets Manager secret.
     *
     * @param secret The secret where the configuration is stored
     */
    static fromSecret(secret: sm.ISecret): ConfigurationSource;
    /**
     * Defines configuration content from a Systems Manager (SSM) Parameter Store parameter.
     *
     * @param parameter The parameter where the configuration is stored
     * @param key The KMS Key that the secure string is encrypted with
     */
    static fromParameter(parameter: ssm.IParameter, key?: kms.IKey): ConfigurationSource;
    /**
     * Defines configuration content from a Systems Manager (SSM) document.
     *
     * @param document The SSM document where the configuration is stored
     */
    static fromCfnDocument(document: ssm.CfnDocument): ConfigurationSource;
    /**
     * Defines configuration content from AWS CodePipeline.
     *
     * @param pipeline The pipeline where the configuration is stored
     * @returns
     */
    static fromPipeline(pipeline: cp.IPipeline): ConfigurationSource;
    /**
     * The URI of the configuration source.
     */
    abstract readonly locationUri: string;
    /**
     * The type of the configuration source.
     */
    abstract readonly type: ConfigurationSourceType;
    /**
     * The KMS Key that encrypts the configuration.
     */
    abstract readonly key?: kms.IKey;
}
export {};
