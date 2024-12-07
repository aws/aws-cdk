import { Construct } from 'constructs';
import { CfnDeployment, CfnEnvironment } from './appconfig.generated';
import { IApplication } from './application';
import { IConfiguration } from './configuration';
import { ActionPoint, IEventDestination, ExtensionOptions, IExtension, IExtensible, ExtensibleBase } from './extension';
import { getHash } from './private/hash';
import * as cloudwatch from '../../aws-cloudwatch';
import * as iam from '../../aws-iam';
import { Resource, IResource, Stack, ArnFormat, PhysicalName, Names } from '../../core';

/**
 * Attributes of an existing AWS AppConfig environment to import it.
 */
export interface EnvironmentAttributes {
  /**
   * The application associated with the environment.
   */
  readonly application: IApplication;

  /**
   * The ID of the environment.
   */
  readonly environmentId: string;

  /**
   * The name of the environment.
   *
   * @default - None.
   */
  readonly name?: string;

  /**
   * The description of the environment.
   *
   * @default - None.
   */
  readonly description?: string;

  /**
   * The monitors for the environment.
   *
   * @default - None.
   */
  readonly monitors?: Monitor[];
}

abstract class EnvironmentBase extends Resource implements IEnvironment, IExtensible {
  public abstract applicationId: string;
  public abstract environmentId: string;
  public abstract environmentArn: string;
  public abstract name?: string;
  protected extensible!: ExtensibleBase;
  protected deploymentQueue: Array<CfnDeployment> = [];

  public addDeployment(configuration: IConfiguration): void {
    if (this.name === undefined) {
      throw new Error('Environment name must be known to add a Deployment');
    }

    const queueSize = this.deploymentQueue.push(
      new CfnDeployment(configuration, `Deployment${getHash(this.name)}`, {
        applicationId: configuration.application.applicationId,
        configurationProfileId: configuration.configurationProfileId,
        deploymentStrategyId: configuration.deploymentStrategy!.deploymentStrategyId,
        environmentId: this.environmentId,
        configurationVersion: configuration.versionNumber!,
        description: configuration.description,
        kmsKeyIdentifier: configuration.deploymentKey?.keyArn,
      }),
    );

    // This internal member is used to keep track of configuration deployments
    // as they are requested. Each element in this queue will depend on its
    // predecessor, ensuring that the deployments occur sequentially in Cfn.
    if (queueSize > 1) {
      this.deploymentQueue[queueSize - 1].addDependency(this.deploymentQueue[queueSize - 2]);
    }
  }

  public addDeployments(...configurations: IConfiguration[]): void {
    configurations.forEach((config) => this.addDeployment(config));
  }

  public on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.on(actionPoint, eventDestination, options);
  }

  public preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.preCreateHostedConfigurationVersion(eventDestination, options);
  }

  public preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.preStartDeployment(eventDestination, options);
  }

  public onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentStart(eventDestination, options);
  }

  public onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentStep(eventDestination, options);
  }

  public onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentBaking(eventDestination, options);
  }

  public onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentComplete(eventDestination, options);
  }

  public onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.onDeploymentRolledBack(eventDestination, options);
  }

  public atDeploymentTick(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.extensible.atDeploymentTick(eventDestination, options);
  }

  public addExtension(extension: IExtension) {
    this.extensible.addExtension(extension);
  }

  public grant(grantee: iam.IGrantable, ...actions: string[]) {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.environmentArn],
    });
  }

  public grantReadConfig(identity: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: identity,
      actions: [
        'appconfig:GetLatestConfiguration',
        'appconfig:StartConfigurationSession',
      ],
      resourceArns: [`${this.environmentArn}/configuration/*`],
    });
  }
}

/**
 * Options for the Environment construct.
 */
export interface EnvironmentOptions {
  /**
   * The name of the environment.
   *
   * @default - A name is generated.
   */
  readonly environmentName?: string;

  /**
   * The description of the environment.
   *
   * @default - No description.
   */
  readonly description?: string;

  /**
   * The monitors for the environment.
   *
   * @default - No monitors.
   */
  readonly monitors?: Monitor[];
}

/**
 * Properties for the Environment construct.
 */
export interface EnvironmentProps extends EnvironmentOptions {
  /**
   * The application to be associated with the environment.
   */
  readonly application: IApplication;
}

/**
 * An AWS AppConfig environment.
 *
 * @resource AWS::AppConfig::Environment
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/appconfig-creating-environment.html
 */
export class Environment extends EnvironmentBase {
  /**
   * Imports an environment into the CDK using its Amazon Resource Name (ARN).
   *
   * @param scope The parent construct
   * @param id The name of the environment construct
   * @param environmentArn The Amazon Resource Name (ARN) of the environment
   */
  public static fromEnvironmentArn(scope: Construct, id: string, environmentArn: string): IEnvironment {
    const parsedArn = Stack.of(scope).splitArn(environmentArn, ArnFormat.SLASH_RESOURCE_NAME);
    if (!parsedArn.resourceName) {
      throw new Error(`Missing required /$/{applicationId}/environment//$/{environmentId} from environment ARN: ${parsedArn.resourceName}`);
    }

    const resourceName = parsedArn.resourceName.split('/');
    if (resourceName.length != 3 || !resourceName[0] || !resourceName[2]) {
      throw new Error('Missing required parameters for environment ARN: format should be /$/{applicationId}/environment//$/{environmentId}');
    }

    const applicationId = resourceName[0];
    const environmentId = resourceName[2];

    class Import extends EnvironmentBase {
      public readonly applicationId = applicationId;
      public readonly environmentId = environmentId;
      public readonly environmentArn = environmentArn;
      public readonly name?: string;
    }

    return new Import(scope, id, {
      environmentFromArn: environmentArn,
    });
  }

  /**
   * Imports an environment into the CDK from its attributes.
   *
   * @param scope The parent construct
   * @param id The name of the environment construct
   * @param attrs The attributes of the environment
   */
  public static fromEnvironmentAttributes(scope: Construct, id: string, attrs: EnvironmentAttributes): IEnvironment {
    const applicationId = attrs.application.applicationId;
    const environmentId = attrs.environmentId;

    const stack = Stack.of(scope);
    const environmentArn = stack.formatArn({
      service: 'appconfig',
      resource: 'application',
      resourceName: `${applicationId}/environment/${environmentId}`,
    });

    class Import extends EnvironmentBase {
      public readonly application = attrs.application;
      public readonly applicationId = attrs.application.applicationId;
      public readonly name = attrs.name;
      public readonly environmentId = environmentId;
      public readonly environmentArn = environmentArn;
      public readonly description = attrs.description;
      public readonly monitors = attrs.monitors;
    }

    return new Import(scope, id, {
      environmentFromArn: environmentArn,
    });
  }

  /**
   * The application associated with the environment.
   */
  public readonly application?: IApplication;

  /**
   * The name of the environment.
   */
  public readonly name?: string;

  /**
   * The description of the environment.
   */
  public readonly description?: string;

  /**
   * The monitors for the environment.
   */
  public readonly monitors?: Monitor[];

  /**
   * The ID of the environment.
   *
   * @attribute
   */
  public readonly environmentId: string;

  /**
   * The Amazon Resource Name (ARN) of the environment.
   *
   * @attribute
   */
  public readonly environmentArn: string;

  /**
   * The ID of the environment.
   */
  public readonly applicationId: string;

  private readonly _cfnEnvironment: CfnEnvironment;

  constructor(scope: Construct, id: string, props: EnvironmentProps) {
    super(scope, id, {
      physicalName: props.environmentName,
    });

    this.name = props.environmentName || Names.uniqueResourceName(this, {
      maxLength: 64,
      separator: '-',
    });
    this.application = props.application;
    this.applicationId = this.application.applicationId;
    this.description = props.description;
    this.monitors = props.monitors;

    const resource = new CfnEnvironment(this, 'Resource', {
      applicationId: this.applicationId,
      name: this.name,
      description: this.description,
      monitors: this.monitors?.map((monitor) => {
        return {
          alarmArn: monitor.alarmArn,
          ...(monitor.monitorType === MonitorType.CLOUDWATCH
            ? { alarmRoleArn: monitor.alarmRoleArn || this.createOrGetAlarmRole().roleArn }
            : { alarmRoleArn: monitor.alarmRoleArn }),
        };
      }),
    });
    this._cfnEnvironment = resource;

    this.environmentId = this._cfnEnvironment.ref;
    this.environmentArn = this.stack.formatArn({
      service: 'appconfig',
      resource: 'application',
      resourceName: `${this.applicationId}/environment/${this.environmentId}`,
    });
    this.extensible = new ExtensibleBase(this, this.environmentArn, this.name);

    this.application.addExistingEnvironment(this);
  }

  private createOrGetAlarmRole(): iam.IRole {
    // the name is guaranteed to be set in line 243
    const logicalId = `Role${getHash(this.name!)}`;
    const existingRole = this.node.tryFindChild(logicalId) as iam.IRole;
    if (existingRole) {
      return existingRole;
    }
    // this scope is fine for cloudwatch:DescribeAlarms since it is readonly
    // and it is required for composite alarms
    // https://docs.aws.amazon.com/AmazonCloudWatch/latest/APIReference/API_DescribeAlarms.html
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cloudwatch:DescribeAlarms'],
      resources: ['*'],
    });
    const document = new iam.PolicyDocument({
      statements: [policy],
    });
    const role = new iam.Role(this, logicalId, {
      roleName: PhysicalName.GENERATE_IF_NEEDED,
      assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
      inlinePolicies: {
        ['AllowAppConfigMonitorAlarmPolicy']: document,
      },
    });
    return role;
  }
}

/**
 * The type of Monitor.
 */
export enum MonitorType {
  /**
   * A Monitor from a CloudWatch alarm.
   */
  CLOUDWATCH,

  /**
   * A Monitor from a CfnEnvironment.MonitorsProperty construct.
   */
  CFN_MONITORS_PROPERTY,
}

/**
 * Defines monitors that will be associated with an AWS AppConfig environment.
 */
export abstract class Monitor {
  /**
   * Creates a Monitor from a CloudWatch alarm. If the alarm role is not specified, a role will
   * be generated.
   *
   * @param alarm The Amazon CloudWatch alarm.
   * @param alarmRole The IAM role for AWS AppConfig to view the alarm state.
   */
  public static fromCloudWatchAlarm(alarm: cloudwatch.IAlarm, alarmRole?: iam.IRole): Monitor {
    return {
      alarmArn: alarm.alarmArn,
      alarmRoleArn: alarmRole?.roleArn,
      monitorType: MonitorType.CLOUDWATCH,
    };
  }

  /**
   * Creates a Monitor from a CfnEnvironment.MonitorsProperty construct.
   *
   * @param monitorsProperty The monitors property.
   */
  public static fromCfnMonitorsProperty(monitorsProperty: CfnEnvironment.MonitorsProperty): Monitor {
    if (monitorsProperty.alarmArn === undefined) {
      throw new Error('You must specify an alarmArn property to use "fromCfnMonitorsProperty".');
    }
    return {
      alarmArn: monitorsProperty.alarmArn,
      alarmRoleArn: monitorsProperty.alarmRoleArn,
      monitorType: MonitorType.CFN_MONITORS_PROPERTY,
    };
  }

  /**
   * The alarm ARN for AWS AppConfig to monitor.
   */
  public abstract readonly alarmArn: string;

  /**
   * The type of monitor.
   */
  public abstract readonly monitorType: MonitorType;

  /**
   * The IAM role ARN for AWS AppConfig to view the alarm state.
   */
  public abstract readonly alarmRoleArn?: string;

  /**
   * Indicates whether a CloudWatch alarm is a composite alarm.
   */
  public abstract readonly isCompositeAlarm?: boolean;
}

export interface IEnvironment extends IResource {
  /**
   * The application associated with the environment.
   */
  readonly application?: IApplication;

  /**
   * The ID of the application associated to the environment.
   */
  readonly applicationId: string;

  /**
   * The name of the environment.
   */
  readonly name?: string;

  /**
   * The description of the environment.
   */
  readonly description?: string;

  /**
   * The monitors for the environment.
   */
  readonly monitors?: Monitor[];

  /**
   * The ID of the environment.
   * @attribute
   */
  readonly environmentId: string;

  /**
   * The Amazon Resource Name (ARN) of the environment.
   * @attribute
   */
  readonly environmentArn: string;

  /**
   * Creates a deployment of the supplied configuration to this environment.
   * Note that you can only deploy one configuration at a time to an environment.
   * However, you can deploy one configuration each to different environments at the same time.
   * If more than one deployment is requested for this environment, they will occur in the same order they were provided.
   *
   * @param configuration The configuration that will be deployed to this environment.
   */
  addDeployment(configuration: IConfiguration): void;

  /**
   * Creates a deployment for each of the supplied configurations to this environment.
   * These configurations will be deployed in the same order as the input array.
   *
   * @param configurations The configurations that will be deployed to this environment.
   */
  addDeployments(...configurations: Array<IConfiguration>): void;

  /**
   * Adds an extension defined by the action point and event destination and also
   * creates an extension association to the environment.
   *
   * @param actionPoint The action point which triggers the event
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds a PRE_CREATE_HOSTED_CONFIGURATION_VERSION extension with the provided event destination
   * and also creates an extension association to the environment.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds a PRE_START_DEPLOYMENT extension with the provided event destination and also creates
   * an extension association to the environment.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an ON_DEPLOYMENT_START extension with the provided event destination and also creates
   * an extension association to the environment.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination and also
   * creates an extension association to the environment.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
   * also creates an extension association to the environment.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination and
   * also creates an extension association to the environment.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination and
   * also creates an extension association to the environment.
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
   * Adds an extension association to the environment.
   *
   * @param extension The extension to create an association for
   */
  addExtension(extension: IExtension): void;

  /**
   * Adds an IAM policy statement associated with this environment to an IAM principal's policy.
   *
   * @param grantee the principal (no-op if undefined)
   * @param actions the set of actions to allow (i.e., 'appconfig:GetLatestConfiguration', 'appconfig:StartConfigurationSession', etc.)
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Permits an IAM principal to perform read operations on this environment's configurations.
   *
   * Actions: GetLatestConfiguration, StartConfigurationSession.
   *
   * @param grantee Principal to grant read rights to
   */
  grantReadConfig(grantee: iam.IGrantable): iam.Grant;
}
