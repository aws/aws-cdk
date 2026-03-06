/* eslint-disable @cdklabs/no-literal-partition */
import type { Construct } from 'constructs';
import { CfnApplication } from './appconfig.generated';
import type { HostedConfigurationOptions, SourcedConfigurationOptions } from './configuration';
import { HostedConfiguration, SourcedConfiguration } from './configuration';
import type { EnvironmentOptions, IEnvironment } from './environment';
import { Environment } from './environment';
import type { ActionPoint, IEventDestination, ExtensionOptions, IExtension, IExtensible } from './extension';
import { ExtensibleBase } from './extension';
import * as ecs from '../../aws-ecs';
import * as cdk from '../../core';
import { toIEnvironment } from './private/ref-utils';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IApplicationRef, IEnvironmentRef, ApplicationReference } from '../../interfaces/generated/aws-appconfig-interfaces.generated';

/**
 * Defines the platform for the AWS AppConfig Lambda extension.
 */
export enum Platform {
  X86_64 = 'x86-64',
  ARM_64 = 'ARM64',
}

export interface IApplication extends cdk.IResource, IApplicationRef {
  /**
   * The description of the application.
   */
  readonly description?: string;

  /**
   * The name of the application.
   */
  readonly name?: string;

  /**
   * The ID of the application.
   * @attribute
   */
  readonly applicationId: string;

  /**
   * The Amazon Resource Name (ARN) of the application.
   * @attribute
   */
  readonly applicationArn: string;

  /**
   * Adds an environment.
   *
   * @param id The name of the environment construct
   * @param options The options for the environment construct
   */
  addEnvironment(id: string, options?: EnvironmentOptions): IEnvironment;

  /**
   * Adds a hosted configuration.
   *
   * @param id The name of the hosted configuration construct
   * @param options The options for the hosted configuration construct
   */
  addHostedConfiguration(id: string, options: HostedConfigurationOptions): HostedConfiguration;

  /**
   * Adds a sourced configuration.
   *
   * @param id The name of the sourced configuration construct
   * @param options The options for the sourced configuration construct
   */
  addSourcedConfiguration(id: string, options: SourcedConfigurationOptions): SourcedConfiguration;

  /**
   * Adds an existing environment.
   *
   * @param environment The environment
   */
  addExistingEnvironment(environment: IEnvironmentRef): void;

  /**
   * Returns the list of associated environments.
   */
  environments(): IEnvironment[];

  /**
   * Adds an extension defined by the action point and event destination
   * and also creates an extension association to an application.
   *
   * @param actionPoint The action point which triggers the event
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds a PRE_CREATE_HOSTED_CONFIGURATION_VERSION extension with the
   * provided event destination and also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds a PRE_START_DEPLOYMENT extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions): void;
  /**
   * Adds an ON_DEPLOYMENT_START extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an AT_DEPLOYMENT_TICK extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  atDeploymentTick(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an extension association to the application.
   *
   * @param extension The extension to create an association for
   */
  addExtension(extension: IExtension): void;
}

/**
 * Properties for the Application construct
 */
export interface ApplicationProps {
  /**
   * The name of the application.
   *
   * @default - A name is generated.
   */
  readonly applicationName?: string;

  /**
   * The description for the application.
   *
   * @default - No description.
   */
  readonly description?: string;
}

abstract class ApplicationBase extends cdk.Resource implements IApplication, IExtensible {
  public abstract applicationId: string;
  public abstract applicationArn: string;
  private _environments: IEnvironmentRef[] = [];
  protected abstract extensible: ExtensibleBase;

  public get applicationRef(): ApplicationReference {
    return {
      applicationId: this.applicationId,
    };
  }

  public addEnvironment(id: string, options: EnvironmentOptions = {}): IEnvironment {
    return new Environment(this, id, {
      application: this,
      ...options,
    });
  }

  public addHostedConfiguration(id: string, options: HostedConfigurationOptions): HostedConfiguration {
    return new HostedConfiguration(this, id, {
      application: this,
      ...options,
    });
  }

  public addSourcedConfiguration(id: string, options: SourcedConfigurationOptions): SourcedConfiguration {
    return new SourcedConfiguration(this, id, {
      application: this,
      ...options,
    });
  }

  public addExistingEnvironment(environment: IEnvironmentRef) {
    this._environments.push(environment);
  }

  public environments(): IEnvironment[] {
    return this._environments.map(toIEnvironment);
  }

  /**
   * Adds an extension defined by the action point and event destination
   * and also creates an extension association to an application.
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
   * provided event destination and also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.preCreateHostedConfigurationVersion(eventDestination, options);
  }

  /**
   * Adds a PRE_START_DEPLOYMENT extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.preStartDeployment(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_START extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentStart(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentStep(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentBaking(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination and
   * also creates an extension association to an application.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  public onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentComplete(eventDestination, options);
  }

  /**
   * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination and
   * also creates an extension association to an application.
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
   * Adds an extension association to the application.
   *
   * @param extension The extension to create an association for
   */
  public addExtension(extension: IExtension) {
    this.extensible.addExtension(extension);
  }
}

/**
 * An AWS AppConfig application.
 *
 * @resource AWS::AppConfig::Application
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-application.html
 */
@propertyInjectable
export class Application extends ApplicationBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-appconfig.Application';

  /**
   * Imports an AWS AppConfig application into the CDK using its Amazon Resource Name (ARN).
   *
   * @param scope The parent construct
   * @param id The name of the application construct
   * @param applicationArn The Amazon Resource Name (ARN) of the application
   */
  public static fromApplicationArn(scope: Construct, id: string, applicationArn: string): IApplication {
    const parsedArn = cdk.Stack.of(scope).splitArn(applicationArn, cdk.ArnFormat.SLASH_RESOURCE_NAME);
    const applicationId = parsedArn.resourceName;
    if (!applicationId) {
      throw new cdk.ValidationError('Missing required application id from application ARN', scope);
    }

    class Import extends ApplicationBase {
      public readonly applicationId = applicationId!;
      public readonly applicationArn = applicationArn;
      protected readonly extensible = new ExtensibleBase(scope, this.applicationArn);
    }

    return new Import(scope, id);
  }

  /**
   * Imports an AWS AppConfig application into the CDK using its ID.
   *
   * @param scope The parent construct
   * @param id The name of the application construct
   * @param applicationId The ID of the application
   */
  public static fromApplicationId(scope: Construct, id: string, applicationId: string): IApplication {
    const stack = cdk.Stack.of(scope);
    const applicationArn = stack.formatArn({
      service: 'appconfig',
      resource: 'application',
      resourceName: applicationId,
    });

    class Import extends ApplicationBase {
      public readonly applicationId = applicationId;
      public readonly applicationArn = applicationArn;
      protected readonly extensible = new ExtensibleBase(scope, this.applicationArn);
    }

    return new Import(scope, id);
  }

  /**
   * Retrieves the Lambda layer version Amazon Resource Name (ARN) for the AWS AppConfig Lambda extension.
   *
   * @param region The region for the Lambda layer (for example, 'us-east-1')
   * @param platform The platform for the Lambda layer (default is Platform.X86_64)
   * @returns Lambda layer version ARN
   */
  public static getLambdaLayerVersionArn(region: string, platform?: Platform): string {
    return lambdaLayerVersions[platform || Platform.X86_64][region];
  }

  /**
   * Adds the AWS AppConfig Agent as a container to the provided ECS task definition.
   *
   * @param taskDef The ECS task definition [disable-awslint:ref-via-interface]
   */
  public static addAgentToEcs(taskDef: ecs.TaskDefinition) {
    taskDef.addContainer('AppConfigAgentContainer', {
      image: ecs.ContainerImage.fromRegistry('public.ecr.aws/aws-appconfig/aws-appconfig-agent:latest'),
      containerName: 'AppConfigAgentContainer',
    });
  }

  /**
   * The description of the application.
   */
  public readonly description?: string;

  /**
   * The name of the application.
   */
  public readonly name?: string;

  /**
   * The ID of the application.
   *
   * @attribute
   */
  public readonly applicationId: string;

  /**
   * The Amazon Resource Name (ARN) of the application.
   *
   * @attribute
   */
  public readonly applicationArn: string;

  private _application: CfnApplication;
  protected extensible: ExtensibleBase;

  constructor(scope: Construct, id: string, props: ApplicationProps = {}) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.description = props.description;
    this.name = props.applicationName || cdk.Names.uniqueResourceName(this, {
      maxLength: 64,
      separator: '-',
    });

    this._application = new CfnApplication(this, 'Resource', {
      name: this.name,
      description: this.description,
    });
    this.applicationId = this._application.ref;
    this.applicationArn = cdk.Stack.of(this).formatArn({
      service: 'appconfig',
      resource: 'application',
      resourceName: this.applicationId,
    });

    this.extensible = new ExtensibleBase(this, this.applicationArn, this.name);
  }
}

const lambdaLayerVersions: {[key: string]: {[key: string]: string}} = {
  [Platform.X86_64]: {
    'us-east-1': 'arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:279',
    'us-east-2': 'arn:aws:lambda:us-east-2:728743619870:layer:AWS-AppConfig-Extension:235',
    'us-west-1': 'arn:aws:lambda:us-west-1:958113053741:layer:AWS-AppConfig-Extension:348',
    'us-west-2': 'arn:aws:lambda:us-west-2:359756378197:layer:AWS-AppConfig-Extension:335',
    'ca-central-1': 'arn:aws:lambda:ca-central-1:039592058896:layer:AWS-AppConfig-Extension:228',
    'ca-west-1': 'arn:aws:lambda:ca-west-1:436199621743:layer:AWS-AppConfig-Extension:130',
    'eu-central-1': 'arn:aws:lambda:eu-central-1:066940009817:layer:AWS-AppConfig-Extension:261',
    'eu-central-2': 'arn:aws:lambda:eu-central-2:758369105281:layer:AWS-AppConfig-Extension:178',
    'eu-west-1': 'arn:aws:lambda:eu-west-1:434848589818:layer:AWS-AppConfig-Extension:261',
    'eu-west-2': 'arn:aws:lambda:eu-west-2:282860088358:layer:AWS-AppConfig-Extension:207',
    'eu-west-3': 'arn:aws:lambda:eu-west-3:493207061005:layer:AWS-AppConfig-Extension:235',
    'eu-north-1': 'arn:aws:lambda:eu-north-1:646970417810:layer:AWS-AppConfig-Extension:333',
    'eu-south-1': 'arn:aws:lambda:eu-south-1:203683718741:layer:AWS-AppConfig-Extension:215',
    'eu-south-2': 'arn:aws:lambda:eu-south-2:586093569114:layer:AWS-AppConfig-Extension:176',
    'eusc-de-east-1': 'arn:aws-eusc:lambda:eusc-de-east-1:426221636601:layer:AWS-AppConfig-Extension:42',
    'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:615057806174:layer:AWS-AppConfig-Extension:205',
    'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:615084187847:layer:AWS-AppConfig-Extension:203',
    'ap-east-1': 'arn:aws:lambda:ap-east-1:630222743974:layer:AWS-AppConfig-Extension:217',
    'ap-east-2': 'arn:aws:lambda:ap-east-2:730335625313:layer:AWS-AppConfig-Extension:100',
    'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:980059726660:layer:AWS-AppConfig-Extension:228',
    'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:826293736237:layer:AWS-AppConfig-Extension:239',
    'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:706869817123:layer:AWS-AppConfig-Extension:234',
    'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:421114256042:layer:AWS-AppConfig-Extension:224',
    'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:080788657173:layer:AWS-AppConfig-Extension:272',
    'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:418787028745:layer:AWS-AppConfig-Extension:222',
    'ap-southeast-4': 'arn:aws:lambda:ap-southeast-4:307021474294:layer:AWS-AppConfig-Extension:152',
    'ap-southeast-5': 'arn:aws:lambda:ap-southeast-5:631746059939:layer:AWS-AppConfig-Extension:127',
    'ap-southeast-6': 'arn:aws:lambda:ap-southeast-6:381491832265:layer:AWS-AppConfig-Extension:41',
    'ap-southeast-7': 'arn:aws:lambda:ap-southeast-7:851725616657:layer:AWS-AppConfig-Extension:98',
    'ap-south-1': 'arn:aws:lambda:ap-south-1:554480029851:layer:AWS-AppConfig-Extension:248',
    'ap-south-2': 'arn:aws:lambda:ap-south-2:489524808438:layer:AWS-AppConfig-Extension:179',
    'sa-east-1': 'arn:aws:lambda:sa-east-1:000010852771:layer:AWS-AppConfig-Extension:288',
    'af-south-1': 'arn:aws:lambda:af-south-1:574348263942:layer:AWS-AppConfig-Extension:225',
    'il-central-1': 'arn:aws:lambda:il-central-1:895787185223:layer:AWS-AppConfig-Extension:155',
    'me-central-1': 'arn:aws:lambda:me-central-1:662846165436:layer:AWS-AppConfig-Extension:195',
    'me-south-1': 'arn:aws:lambda:me-south-1:559955524753:layer:AWS-AppConfig-Extension:227',
    'mx-central-1': 'arn:aws:lambda:mx-central-1:891376990304:layer:AWS-AppConfig-Extension:98',
    'us-northeast-1': 'arn:aws:lambda:us-northeast-1:136373027889:layer:AWS-AppConfig-Extension:129',
    'us-gov-east-1': 'arn:aws-us-gov:lambda:us-gov-east-1:946561847325:layer:AWS-AppConfig-Extension:184',
    'us-gov-west-1': 'arn:aws-us-gov:lambda:us-gov-west-1:946746059096:layer:AWS-AppConfig-Extension:182',
  },
  [Platform.ARM_64]: {
    'us-east-1': 'arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension-Arm64:212',
    'us-east-2': 'arn:aws:lambda:us-east-2:728743619870:layer:AWS-AppConfig-Extension-Arm64:187',
    'us-west-1': 'arn:aws:lambda:us-west-1:958113053741:layer:AWS-AppConfig-Extension-Arm64:225',
    'us-west-2': 'arn:aws:lambda:us-west-2:359756378197:layer:AWS-AppConfig-Extension-Arm64:237',
    'ca-central-1': 'arn:aws:lambda:ca-central-1:039592058896:layer:AWS-AppConfig-Extension-Arm64:148',
    'ca-west-1': 'arn:aws:lambda:ca-west-1:436199621743:layer:AWS-AppConfig-Extension-Arm64:120',
    'eu-central-1': 'arn:aws:lambda:eu-central-1:066940009817:layer:AWS-AppConfig-Extension-Arm64:204',
    'eu-central-2': 'arn:aws:lambda:eu-central-2:758369105281:layer:AWS-AppConfig-Extension-Arm64:136',
    'eu-west-1': 'arn:aws:lambda:eu-west-1:434848589818:layer:AWS-AppConfig-Extension-Arm64:199',
    'eu-west-2': 'arn:aws:lambda:eu-west-2:282860088358:layer:AWS-AppConfig-Extension-Arm64:159',
    'eu-west-3': 'arn:aws:lambda:eu-west-3:493207061005:layer:AWS-AppConfig-Extension-Arm64:154',
    'eu-north-1': 'arn:aws:lambda:eu-north-1:646970417810:layer:AWS-AppConfig-Extension-Arm64:192',
    'eu-south-1': 'arn:aws:lambda:eu-south-1:203683718741:layer:AWS-AppConfig-Extension-Arm64:143',
    'eu-south-2': 'arn:aws:lambda:eu-south-2:586093569114:layer:AWS-AppConfig-Extension-Arm64:137',
    'eusc-de-east-1': 'arn:aws-eusc:lambda:eusc-de-east-1:426221636601:layer:AWS-AppConfig-Extension-Arm64:17',
    'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:615057806174:layer:AWS-AppConfig-Extension-Arm64:127',
    'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:615084187847:layer:AWS-AppConfig-Extension-Arm64:125',
    'ap-east-1': 'arn:aws:lambda:ap-east-1:630222743974:layer:AWS-AppConfig-Extension-Arm64:145',
    'ap-east-2': 'arn:aws:lambda:ap-east-2:730335625313:layer:AWS-AppConfig-Extension-Arm64:74',
    'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:980059726660:layer:AWS-AppConfig-Extension-Arm64:181',
    'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:826293736237:layer:AWS-AppConfig-Extension-Arm64:147',
    'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:706869817123:layer:AWS-AppConfig-Extension-Arm64:149',
    'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:421114256042:layer:AWS-AppConfig-Extension-Arm64:176',
    'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:080788657173:layer:AWS-AppConfig-Extension-Arm64:215',
    'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:418787028745:layer:AWS-AppConfig-Extension-Arm64:159',
    'ap-southeast-4': 'arn:aws:lambda:ap-southeast-4:307021474294:layer:AWS-AppConfig-Extension-Arm64:137',
    'ap-southeast-5': 'arn:aws:lambda:ap-southeast-5:631746059939:layer:AWS-AppConfig-Extension-Arm64:102',
    'ap-southeast-6': 'arn:aws:lambda:ap-southeast-6:381491832265:layer:AWS-AppConfig-Extension-Arm64:31',
    'ap-southeast-7': 'arn:aws:lambda:ap-southeast-7:851725616657:layer:AWS-AppConfig-Extension-Arm64:97',
    'ap-south-1': 'arn:aws:lambda:ap-south-1:554480029851:layer:AWS-AppConfig-Extension-Arm64:190',
    'ap-south-2': 'arn:aws:lambda:ap-south-2:489524808438:layer:AWS-AppConfig-Extension-Arm64:137',
    'sa-east-1': 'arn:aws:lambda:sa-east-1:000010852771:layer:AWS-AppConfig-Extension-Arm64:176',
    'af-south-1': 'arn:aws:lambda:af-south-1:574348263942:layer:AWS-AppConfig-Extension-Arm64:153',
    'il-central-1': 'arn:aws:lambda:il-central-1:895787185223:layer:AWS-AppConfig-Extension-Arm64:138',
    'me-central-1': 'arn:aws:lambda:me-central-1:662846165436:layer:AWS-AppConfig-Extension-Arm64:151',
    'me-south-1': 'arn:aws:lambda:me-south-1:559955524753:layer:AWS-AppConfig-Extension-Arm64:155',
    'mx-central-1': 'arn:aws:lambda:mx-central-1:891376990304:layer:AWS-AppConfig-Extension-Arm64:97',
    'us-northeast-1': 'arn:aws:lambda:us-northeast-1:136373027889:layer:AWS-AppConfig-Extension-Arm64:128',
    'us-gov-east-1': 'arn:aws-us-gov:lambda:us-gov-east-1:946561847325:layer:AWS-AppConfig-Extension-Arm64:130',
    'us-gov-west-1': 'arn:aws-us-gov:lambda:us-gov-west-1:946746059096:layer:AWS-AppConfig-Extension-Arm64:128',
  },
};
