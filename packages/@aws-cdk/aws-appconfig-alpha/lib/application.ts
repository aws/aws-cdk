import * as cdk from 'aws-cdk-lib';
import { Names } from 'aws-cdk-lib';
import { CfnApplication } from 'aws-cdk-lib/aws-appconfig';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';
import { HostedConfiguration, HostedConfigurationOptions, SourcedConfiguration, SourcedConfigurationOptions } from './configuration';
import { Environment, EnvironmentOptions, IEnvironment } from './environment';
import { ActionPoint, IEventDestination, ExtensionOptions, IExtension, IExtensible, ExtensibleBase } from './extension';

/**
 * Defines the platform for the AWS AppConfig Lambda extension.
 */
export enum Platform {
  X86_64 = 'x86-64',
  ARM_64 = 'ARM64',
}

export interface IApplication extends cdk.IResource {
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
  addExistingEnvironment(environment: IEnvironment): void;

  /**
   * Returns the list of associated environments.
   */
  get environments(): IEnvironment[];
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
  private _environments: IEnvironment[] = [];
  protected abstract extensible: ExtensibleBase;

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

  public addExistingEnvironment(environment: IEnvironment) {
    this._environments.push(environment);
  }

  get environments(): IEnvironment[] {
    return this._environments;
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
export class Application extends ApplicationBase {
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
      throw new Error('Missing required application id from application ARN');
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
   * @param taskDef The ECS task definition
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

    this.description = props.description;
    this.name = props.applicationName || Names.uniqueResourceName(this, {
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
    'us-east-1': 'arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:110',
    'us-east-2': 'arn:aws:lambda:us-east-2:728743619870:layer:AWS-AppConfig-Extension:79',
    'us-west-1': 'arn:aws:lambda:us-west-1:958113053741:layer:AWS-AppConfig-Extension:121',
    'us-west-2': 'arn:aws:lambda:us-west-2:359756378197:layer:AWS-AppConfig-Extension:143',
    'ca-central-1': 'arn:aws:lambda:ca-central-1:039592058896:layer:AWS-AppConfig-Extension:79',
    'eu-central-1': 'arn:aws:lambda:eu-central-1:066940009817:layer:AWS-AppConfig-Extension:91',
    'eu-central-2': 'arn:aws:lambda:eu-central-2:758369105281:layer:AWS-AppConfig-Extension:29',
    'eu-west-1': 'arn:aws:lambda:eu-west-1:434848589818:layer:AWS-AppConfig-Extension:108',
    'eu-west-2': 'arn:aws:lambda:eu-west-2:282860088358:layer:AWS-AppConfig-Extension:79',
    'eu-west-3': 'arn:aws:lambda:eu-west-3:493207061005:layer:AWS-AppConfig-Extension:80',
    'eu-north-1': 'arn:aws:lambda:eu-north-1:646970417810:layer:AWS-AppConfig-Extension:139',
    'eu-south-1': 'arn:aws:lambda:eu-south-1:203683718741:layer:AWS-AppConfig-Extension:71',
    'eu-south-2': 'arn:aws:lambda:eu-south-2:586093569114:layer:AWS-AppConfig-Extension:26',
    'cn-north-1': 'arn:aws-cn:lambda:cn-north-1:615057806174:layer:AWS-AppConfig-Extension:66',
    'cn-northwest-1': 'arn:aws-cn:lambda:cn-northwest-1:615084187847:layer:AWS-AppConfig-Extension:66',
    'ap-east-1': 'arn:aws:lambda:ap-east-1:630222743974:layer:AWS-AppConfig-Extension:71',
    'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:980059726660:layer:AWS-AppConfig-Extension:82',
    'ap-northeast-2': 'arn:aws:lambda:ap-northeast-2:826293736237:layer:AWS-AppConfig-Extension:91',
    'ap-northeast-3': 'arn:aws:lambda:ap-northeast-3:706869817123:layer:AWS-AppConfig-Extension:84',
    'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:421114256042:layer:AWS-AppConfig-Extension:89',
    'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:080788657173:layer:AWS-AppConfig-Extension:91',
    'ap-southeast-3': 'arn:aws:lambda:ap-southeast-3:418787028745:layer:AWS-AppConfig-Extension:60',
    'ap-southeast-4': 'arn:aws:lambda:ap-southeast-4:307021474294:layer:AWS-AppConfig-Extension:2',
    'ap-south-1': 'arn:aws:lambda:ap-south-1:554480029851:layer:AWS-AppConfig-Extension:92',
    'ap-south-2': 'arn:aws:lambda:ap-south-2:489524808438:layer:AWS-AppConfig-Extension:29',
    'sa-east-1': 'arn:aws:lambda:sa-east-1:000010852771:layer:AWS-AppConfig-Extension:110',
    'af-south-1': 'arn:aws:lambda:af-south-1:574348263942:layer:AWS-AppConfig-Extension:71',
    'me-central-1': 'arn:aws:lambda:me-central-1:662846165436:layer:AWS-AppConfig-Extension:31',
    'me-south-1': 'arn:aws:lambda:me-south-1:559955524753:layer:AWS-AppConfig-Extension:71',
    'us-gov-east-1': 'arn:aws-us-gov:lambda:us-gov-east-1:946561847325:layer:AWS-AppConfig-Extension:44',
    'us-gov-west-1': 'arn:aws-us-gov:lambda:us-gov-west-1:946746059096:layer:AWS-AppConfig-Extension:44',
  },
  [Platform.ARM_64]: {
    'us-east-1': 'arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension-Arm64:43',
    'us-east-2': 'arn:aws:lambda:us-east-2:728743619870:layer:AWS-AppConfig-Extension-Arm64:31',
    'us-west-2': 'arn:aws:lambda:us-west-2:359756378197:layer:AWS-AppConfig-Extension-Arm64:45',
    'eu-central-1': 'arn:aws:lambda:eu-central-1:066940009817:layer:AWS-AppConfig-Extension-Arm64:34',
    'eu-west-1': 'arn:aws:lambda:eu-west-1:434848589818:layer:AWS-AppConfig-Extension-Arm64:46',
    'eu-west-2': 'arn:aws:lambda:eu-west-2:282860088358:layer:AWS-AppConfig-Extension-Arm64:31',
    'ap-northeast-1': 'arn:aws:lambda:ap-northeast-1:980059726660:layer:AWS-AppConfig-Extension-Arm64:35',
    'ap-southeast-1': 'arn:aws:lambda:ap-southeast-1:421114256042:layer:AWS-AppConfig-Extension-Arm64:41',
    'ap-southeast-2': 'arn:aws:lambda:ap-southeast-2:080788657173:layer:AWS-AppConfig-Extension-Arm64:34',
    'ap-south-1': 'arn:aws:lambda:ap-south-1:554480029851:layer:AWS-AppConfig-Extension-Arm64:34',
  },
};