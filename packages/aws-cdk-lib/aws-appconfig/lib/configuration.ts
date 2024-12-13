/* eslint-disable import/order */
import * as fs from 'fs';
import * as path from 'path';
import { Construct, IConstruct } from 'constructs';
import { CfnConfigurationProfile, CfnHostedConfigurationVersion } from './appconfig.generated';
import { IApplication } from './application';
import { DeploymentStrategy, IDeploymentStrategy, RolloutStrategy } from './deployment-strategy';
import { IEnvironment } from './environment';
import { ActionPoint, IEventDestination, ExtensionOptions, IExtension, IExtensible, ExtensibleBase } from './extension';
import * as cp from '../../aws-codepipeline';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import * as lambda from '../../aws-lambda';
import * as s3 from '../../aws-s3';
import * as sm from '../../aws-secretsmanager';
import * as ssm from '../../aws-ssm';
import { PhysicalName, Stack, ArnFormat, Names, RemovalPolicy } from '../../core';
import * as mimeTypes from 'mime-types';

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
   * deployment created alongside this configuration.
   *
   * Deployments can be added later using the `IEnvironment.addDeployment` or
   * `IEnvironment.addDeployments` methods.
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

abstract class ConfigurationBase extends Construct implements IConfiguration, IExtensible {
  public abstract readonly versionNumber?: string;
  public abstract readonly configurationProfileId: string;

  /**
   * The application associated with the configuration.
   */
  public readonly application: IApplication;

  /**
   * The environments to deploy to.
   */
  public readonly deployTo?: IEnvironment[];

  /**
   * The name of the configuration.
   */
  public readonly name?: string;

  /**
   * The validators for the configuration.
   */
  public readonly validators?: IValidator[];

  /**
   * The description of the configuration.
   */
  public readonly description?: string;

  /**
   * The configuration type.
   */
  public readonly type?: ConfigurationType;

  /**
   * The deployment key for the configuration.
   */
  public readonly deploymentKey?: kms.IKey;

  /**
   * The deployment strategy for the configuration.
   */
  readonly deploymentStrategy?: IDeploymentStrategy;

  protected applicationId: string;
  protected extensible!: ExtensibleBase;

  constructor(scope: Construct, id: string, props: ConfigurationProps) {
    super(scope, id);

    this.name = props.name || Names.uniqueResourceName(this, {
      maxLength: 128,
      separator: '-',
    });
    this.application = props.application;
    this.applicationId = this.application.applicationId;
    this.type = props.type;
    this.validators = props.validators;
    this.description = props.description;
    this.deployTo = props.deployTo;
    this.deploymentKey = props.deploymentKey;
    this.deploymentStrategy = props.deploymentStrategy || new DeploymentStrategy(this, 'DeploymentStrategy', {
      rolloutStrategy: RolloutStrategy.CANARY_10_PERCENT_20_MINUTES,
    });
  }

  /**
   * Adds an extension defined by the action point and event destination
   * and also creates an extension association to the configuration profile.
   *
   * @param actionPoint The action point which triggers the event
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.on(actionPoint, eventDestination, options);
  }

  /**
   * Adds a PRE_CREATE_HOSTED_CONFIGURATION_VERSION extension with the
   * provided event destination and also creates an extension association to the configuration profile.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.preCreateHostedConfigurationVersion(eventDestination, options);
  }

  /**
   * Adds a PRE_START_DEPLOYMENT extension with the provided event destination
   * and also creates an extension association to the configuration profile.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.preStartDeployment(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_START extension with the provided event destination
   * and also creates an extension association to the configuration profile.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentStart(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination
   * and also creates an extension association to the configuration profile.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentStep(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
   * also creates an extension association to the configuration profile.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentBaking(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination
   * and also creates an extension association to the configuration profile.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentComplete(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination
   * and also creates an extension association to the configuration profile.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentRolledBack(eventDestination, options);
  }

  /**
   * Adds an AT_DEPLOYMENT_TICK extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public atDeploymentTick(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.atDeploymentTick(eventDestination, options);
  }

  /**
   * Adds an extension association to the configuration profile.
   *
   * @param extension The extension to create an association for
   */
  public addExtension(extension: IExtension) {
    this.extensible.addExtension(extension);
  }

  protected addExistingEnvironmentsToApplication() {
    this.deployTo?.forEach((environment) => {
      if (!this.application.environments().includes(environment)) {
        this.application.addExistingEnvironment(environment);
      }
    });
  }

  protected deployConfigToEnvironments() {
    if (!this.deployTo || !this.versionNumber) {
      return;
    }

    this.application.environments().forEach((environment) => {
      if ((this.deployTo && !this.deployTo.includes(environment))) {
        return;
      }
      environment.addDeployment(this);
    });
  }
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
export class HostedConfiguration extends ConfigurationBase {
  /**
   * The content of the hosted configuration.
   */
  public readonly content: string;

  /**
   * The content type of the hosted configuration.
   */
  public readonly contentType?: string;

  /**
   * The latest version number of the hosted configuration.
   */
  public readonly latestVersionNumber?: number;

  /**
   * The version label of the hosted configuration.
   */
  public readonly versionLabel?: string;

  /**
   * The version number of the hosted configuration.
   */
  public readonly versionNumber?: string;

  /**
   * The Amazon Resource Name (ARN) of the hosted configuration version.
   */
  public readonly hostedConfigurationVersionArn: string;

  /**
   * The ID of the configuration profile.
   */
  public readonly configurationProfileId: string;

  /**
   * The Amazon Resource Name (ARN) of the configuration profile.
   */
  public readonly configurationProfileArn: string;

  private readonly _cfnConfigurationProfile: CfnConfigurationProfile;
  private readonly _cfnHostedConfigurationVersion: CfnHostedConfigurationVersion;

  constructor(scope: Construct, id: string, props: HostedConfigurationProps) {
    super(scope, id, props);

    this._cfnConfigurationProfile = new CfnConfigurationProfile(this, 'ConfigurationProfile', {
      applicationId: this.applicationId,
      locationUri: 'hosted',
      name: this.name!,
      description: this.description,
      type: this.type,
      validators: this.validators,
    });
    this.configurationProfileId = this._cfnConfigurationProfile.ref;
    this.configurationProfileArn = Stack.of(this).formatArn({
      service: 'appconfig',
      resource: 'application',
      resourceName: `${this.applicationId}/configurationprofile/${this.configurationProfileId}`,
    });
    this.extensible = new ExtensibleBase(this, this.configurationProfileArn, this.name);

    this.content = props.content.content;
    this.contentType = props.content.contentType;
    this.latestVersionNumber = props.latestVersionNumber;
    this.versionLabel = props.versionLabel;
    this._cfnHostedConfigurationVersion = new CfnHostedConfigurationVersion(this, 'Resource', {
      applicationId: this.applicationId,
      configurationProfileId: this.configurationProfileId,
      content: this.content,
      contentType: this.contentType,
      description: this.description,
      latestVersionNumber: this.latestVersionNumber,
      versionLabel: this.versionLabel,
    });
    this._cfnHostedConfigurationVersion.applyRemovalPolicy(RemovalPolicy.RETAIN);

    this.versionNumber = this._cfnHostedConfigurationVersion.ref;
    this.hostedConfigurationVersionArn = Stack.of(this).formatArn({
      service: 'appconfig',
      resource: 'application',
      resourceName: `${this.applicationId}/configurationprofile/${this.configurationProfileId}/hostedconfigurationversion/${this.versionNumber}`,
    });

    this.addExistingEnvironmentsToApplication();
    this.deployConfigToEnvironments();
  }
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
   * @default - Auto generated if location type is not ConfigurationSourceType.CODE_PIPELINE otherwise no role specified.
   */
  readonly retrievalRole?: iam.IRole;
}

/**
 * A sourced configuration represents configuration stored in an Amazon S3 bucket, AWS Secrets Manager secret, Systems Manager
 * (SSM) Parameter Store parameter, SSM document, or AWS CodePipeline.
 */
export class SourcedConfiguration extends ConfigurationBase {
  /**
   * The location where the configuration is stored.
   */
  public readonly location: ConfigurationSource;

  /**
   * The version number of the configuration to deploy.
   */
  public readonly versionNumber?: string;

  /**
   * The IAM role to retrieve the configuration.
   */
  public readonly retrievalRole?: iam.IRole;

  /**
   * The key to decrypt the configuration if applicable. This key
   * can be used when storing configuration in AWS Secrets Manager, Systems Manager Parameter Store,
   * or Amazon S3.
   */
  public readonly sourceKey?: kms.IKey;

  /**
   * The ID of the configuration profile.
   */
  public readonly configurationProfileId: string;

  /**
   * The Amazon Resource Name (ARN) of the configuration profile.
   */
  public readonly configurationProfileArn: string;

  private readonly locationUri: string;
  private readonly _cfnConfigurationProfile: CfnConfigurationProfile;

  constructor (scope: Construct, id: string, props: SourcedConfigurationProps) {
    super(scope, id, props);

    this.location = props.location;
    this.locationUri = this.location.locationUri;
    this.versionNumber = props.versionNumber;
    this.sourceKey = this.location.key;
    this.retrievalRole = props.retrievalRole ?? this.getRetrievalRole();
    this._cfnConfigurationProfile = new CfnConfigurationProfile(this, 'Resource', {
      applicationId: this.applicationId,
      locationUri: this.locationUri,
      name: this.name!,
      description: this.description,
      retrievalRoleArn: this.retrievalRole?.roleArn,
      type: this.type,
      validators: this.validators,
    });

    this.configurationProfileId = this._cfnConfigurationProfile.ref;
    this.configurationProfileArn = Stack.of(this).formatArn({
      service: 'appconfig',
      resource: 'application',
      resourceName: `${this.applicationId}/configurationprofile/${this.configurationProfileId}`,
    });
    this.extensible = new ExtensibleBase(this, this.configurationProfileArn, this.name);

    this.addExistingEnvironmentsToApplication();
    this.deployConfigToEnvironments();
  }

  private getRetrievalRole(): iam.Role | undefined {
    // Check if the configuration source is not from CodePipeline
    if (this.location.type != ConfigurationSourceType.CODE_PIPELINE) {
      return new iam.Role(this, 'Role', {
        roleName: PhysicalName.GENERATE_IF_NEEDED,
        assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
        inlinePolicies: {
          ['AllowAppConfigReadFromSourcePolicy']: this.getPolicyForRole(),
        },
      });
    } else {
      // No role is needed if the configuration source is from CodePipeline
      return undefined;
    }
  }

  private getPolicyForRole(): iam.PolicyDocument {
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
    });
    const document = new iam.PolicyDocument({
      statements: [policy],
    });

    if (this.location.type == ConfigurationSourceType.SSM_PARAMETER) {
      policy.addActions('ssm:GetParameter');
      policy.addResources(this.locationUri);
    } else if (this.location.type == ConfigurationSourceType.SSM_DOCUMENT) {
      policy.addActions('ssm:GetDocument');
      policy.addResources(Stack.of(this).formatArn({
        service: 'ssm',
        resource: 'document',
        resourceName: this.locationUri.split('://')[1],
      }));
    } else if (this.location.type == ConfigurationSourceType.S3) {
      const bucketAndObjectKey = this.locationUri.split('://')[1];
      const sep = bucketAndObjectKey.search('/');
      const bucketName = bucketAndObjectKey.substring(0, sep);
      const objectKey = bucketAndObjectKey.substring(sep + 1);
      policy.addActions(
        's3:GetObject',
        's3:GetObjectMetadata',
        's3:GetObjectVersion',
      );
      policy.addResources(Stack.of(this).formatArn({
        region: '',
        account: '',
        service: 's3',
        arnFormat: ArnFormat.NO_RESOURCE_NAME,
        resource: `${bucketName}/${objectKey}`,
      }));
      const bucketPolicy = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          's3:GetBucketLocation',
          's3:GetBucketVersioning',
          's3:ListBucket',
          's3:ListBucketVersions',
        ],
        resources: [
          Stack.of(this).formatArn({
            region: '',
            account: '',
            service: 's3',
            arnFormat: ArnFormat.NO_RESOURCE_NAME,
            resource: bucketName,
          }),
        ],
      });
      const listBucketsPolicy = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:ListAllMyBuckets'],
        resources: ['*'],
      });
      document.addStatements(bucketPolicy, listBucketsPolicy);
    } else {
      policy.addActions('secretsmanager:GetSecretValue');
      policy.addResources(this.locationUri);
    }

    if (this.sourceKey) {
      const keyPolicy = new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['kms:Decrypt'],
        resources: [this.sourceKey.keyArn],
      });
      document.addStatements(keyPolicy);
    }

    return document;
  }
}

/**
 * The configuration type.
 */
export enum ConfigurationType {
  /**
   * Freeform configuration profile. Allows you to store your data in the AWS AppConfig
   * hosted configuration store or another Systems Manager capability or AWS service that integrates
   * with AWS AppConfig.
   *
   * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-free-form-configurations-creating.html
   */
  FREEFORM = 'AWS.Freeform',

  /**
   * Feature flag configuration profile. This configuration stores its data
   * in the AWS AppConfig hosted configuration store and the URI is simply hosted.
   */
  FEATURE_FLAGS = 'AWS.AppConfig.FeatureFlags',
}

/**
 * The validator type.
 */
export enum ValidatorType {
  /**
   * JSON Scema validator.
   */
  JSON_SCHEMA = 'JSON_SCHEMA',

  /**
   * Validate using a Lambda function.
   */
  LAMBDA = 'LAMBDA',
}

/**
 * The configuration source type.
 */
export enum ConfigurationSourceType {
  S3 = 'S3',
  SECRETS_MANAGER = 'SECRETS_MANAGER',
  SSM_PARAMETER = 'SSM_PARAMETER',
  SSM_DOCUMENT = 'SSM_DOCUMENT',
  CODE_PIPELINE = 'CODE_PIPELINE',
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
export abstract class JsonSchemaValidator implements IValidator {
  /**
   * Defines a JSON Schema validator from a file.
   *
   * @param inputPath The path to the file that defines the validator
   */
  public static fromFile(inputPath: string): JsonSchemaValidator {
    return {
      content: fs.readFileSync(path.resolve(inputPath)).toString(),
      type: ValidatorType.JSON_SCHEMA,
    };
  }

  /**
   * Defines a JSON Schema validator from inline code.
   *
   * @param code The inline code that defines the validator
   */
  public static fromInline(code: string): JsonSchemaValidator {
    return {
      content: code,
      type: ValidatorType.JSON_SCHEMA,
    };
  }

  public abstract readonly content: string;
  public abstract readonly type: ValidatorType;
}

/**
 * Defines an AWS Lambda validator.
 */
export abstract class LambdaValidator implements IValidator {
  /**
   *  Defines an AWS Lambda validator from a Lambda function. This will call
   * `addPermission` to your function to grant AWS AppConfig permissions.
   *
   * @param func The function that defines the validator
   */
  public static fromFunction(func: lambda.Function): LambdaValidator {
    if (!func.permissionsNode.tryFindChild('AppConfigPermission')) {
      func.addPermission('AppConfigPermission', {
        principal: new iam.ServicePrincipal('appconfig.amazonaws.com'),
      });
    }
    return {
      content: func.functionArn,
      type: ValidatorType.LAMBDA,
    };
  }

  public abstract readonly content: string;
  public abstract readonly type: ValidatorType;
}

/**
 * Defines the hosted configuration content.
 */
export abstract class ConfigurationContent {
  /**
   * Defines the hosted configuration content from a file.
   *
   * @param inputPath The path to the file that defines configuration content
   * @param contentType The content type of the configuration
   */
  public static fromFile(inputPath: string, contentType?: string): ConfigurationContent {
    return {
      content: fs.readFileSync(path.resolve(inputPath)).toString(),
      contentType: contentType || mimeTypes.lookup(inputPath) || 'application/json',
    };
  }

  /**
   * Defines the hosted configuration content from inline code.
   *
   * @param content The inline code that defines the configuration content
   * @param contentType The content type of the configuration
   */
  public static fromInline(content: string, contentType?: string): ConfigurationContent {
    return {
      content,
      contentType: contentType || 'application/octet-stream',
    };
  }

  /**
   * Defines the hosted configuration content as JSON from inline code.
   *
   * @param content The inline code that defines the configuration content
   * @param contentType The content type of the configuration
   */
  public static fromInlineJson(content: string, contentType?: string): ConfigurationContent {
    return {
      content,
      contentType: contentType || 'application/json',
    };
  }

  /**
   * Defines the hosted configuration content as text from inline code.
   *
   * @param content The inline code that defines the configuration content
   */
  public static fromInlineText(content: string): ConfigurationContent {
    return {
      content,
      contentType: 'text/plain',
    };
  }

  /**
   * Defines the hosted configuration content as YAML from inline code.
   *
   * @param content The inline code that defines the configuration content
   */
  public static fromInlineYaml(content: string): ConfigurationContent {
    return {
      content,
      contentType: 'application/x-yaml',
    };
  }

  /**
   * The configuration content.
   */
  public abstract readonly content: string;

  /**
   * The configuration content type.
   */
  public abstract readonly contentType: string;
}

/**
 * Defines the integrated configuration sources.
 */
export abstract class ConfigurationSource {
  /**
   * Defines configuration content from an Amazon S3 bucket.
   *
   * @param bucket The S3 bucket where the configuration is stored
   * @param objectKey The path to the configuration
   * @param key The KMS Key that the bucket is encrypted with
   */
  public static fromBucket(bucket: s3.IBucket, objectKey: string, key?: kms.IKey): ConfigurationSource {
    return {
      locationUri: bucket.s3UrlForObject(objectKey),
      type: ConfigurationSourceType.S3,
      key,
    };
  }

  /**
   * Defines configuration content from an AWS Secrets Manager secret.
   *
   * @param secret The secret where the configuration is stored
   */
  public static fromSecret(secret: sm.ISecret): ConfigurationSource {
    return {
      locationUri: secret.secretArn,
      type: ConfigurationSourceType.SECRETS_MANAGER,
      key: secret.encryptionKey,
    };
  }

  /**
   * Defines configuration content from a Systems Manager (SSM) Parameter Store parameter.
   *
   * @param parameter The parameter where the configuration is stored
   * @param key The KMS Key that the secure string is encrypted with
   */
  public static fromParameter(parameter: ssm.IParameter, key?: kms.IKey): ConfigurationSource {
    return {
      locationUri: parameter.parameterArn,
      type: ConfigurationSourceType.SSM_PARAMETER,
      key,
    };
  }

  /**
   * Defines configuration content from a Systems Manager (SSM) document.
   *
   * @param document The SSM document where the configuration is stored
   */
  public static fromCfnDocument(document: ssm.CfnDocument): ConfigurationSource {
    return {
      locationUri: `ssm-document://${document.ref}`,
      type: ConfigurationSourceType.SSM_DOCUMENT,
    };
  }

  /**
   * Defines configuration content from AWS CodePipeline.
   *
   * @param pipeline The pipeline where the configuration is stored
   * @returns
   */
  public static fromPipeline(pipeline: cp.IPipeline): ConfigurationSource {
    return {
      locationUri: `codepipeline://${pipeline.pipelineName}`,
      type: ConfigurationSourceType.CODE_PIPELINE,
    };
  }

  /**
   * The URI of the configuration source.
   */
  public abstract readonly locationUri: string;

  /**
   * The type of the configuration source.
   */
  public abstract readonly type: ConfigurationSourceType;

  /**
   * The KMS Key that encrypts the configuration.
   */
  public abstract readonly key?: kms.IKey;
}
