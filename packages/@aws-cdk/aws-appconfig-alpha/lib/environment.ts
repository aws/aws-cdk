import { Resource, IResource, Stack, ArnFormat, PhysicalName, Names } from 'aws-cdk-lib';
import { CfnEnvironment } from 'aws-cdk-lib/aws-appconfig';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { IApplication } from './application';
import { ActionPoint, IEventDestination, ExtensionOptions, IExtension, IExtensible, ExtensibleBase } from './extension';

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
  protected extensible!: ExtensibleBase;

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

  public addExtension(extension: IExtension) {
    this.extensible.addExtension(extension);
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
      monitors: this.monitors?.map((monitor, index) => {
        return {
          alarmArn: monitor.alarmArn,
          ...(monitor.monitorType === MonitorType.CLOUDWATCH
            ? { alarmRoleArn: monitor.alarmRoleArn || this.createAlarmRole(monitor, index).roleArn }
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

  private createAlarmRole(monitor: Monitor, index: number): iam.IRole {
    const logicalId = monitor.isCompositeAlarm ? 'RoleCompositeAlarm' : `Role${index}`;
    const existingRole = this.node.tryFindChild(logicalId) as iam.IRole;
    if (existingRole) {
      return existingRole;
    }
    const alarmArn = monitor.isCompositeAlarm
      ? this.stack.formatArn({
        service: 'cloudwatch',
        resource: 'alarm',
        resourceName: '*',
        arnFormat: ArnFormat.COLON_RESOURCE_NAME,
      })
      : monitor.alarmArn;
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['cloudwatch:DescribeAlarms'],
      resources: [alarmArn],
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
      isCompositeAlarm: alarm instanceof cloudwatch.CompositeAlarm,
    };
  }

  /**
   * Creates a Monitor from a CfnEnvironment.MonitorsProperty construct.
   *
   * @param monitorsProperty The monitors property.
   */
  public static fromCfnMonitorsProperty(monitorsProperty: CfnEnvironment.MonitorsProperty): Monitor {
    if (monitorsProperty.alarmArn === undefined) { throw new Error('need this prop'); }
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
   * Adds an extension association to the environment.
   *
   * @param extension The extension to create an association for
   */
  addExtension(extension: IExtension): void;
}