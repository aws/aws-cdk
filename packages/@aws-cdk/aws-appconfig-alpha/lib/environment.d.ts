import { Resource, IResource } from 'aws-cdk-lib';
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
declare abstract class EnvironmentBase extends Resource implements IEnvironment, IExtensible {
    abstract applicationId: string;
    abstract environmentId: string;
    abstract environmentArn: string;
    protected extensible: ExtensibleBase;
    on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions): void;
    preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    addExtension(extension: IExtension): void;
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
export declare class Environment extends EnvironmentBase {
    /**
     * Imports an environment into the CDK using its Amazon Resource Name (ARN).
     *
     * @param scope The parent construct
     * @param id The name of the environment construct
     * @param environmentArn The Amazon Resource Name (ARN) of the environment
     */
    static fromEnvironmentArn(scope: Construct, id: string, environmentArn: string): IEnvironment;
    /**
     * Imports an environment into the CDK from its attributes.
     *
     * @param scope The parent construct
     * @param id The name of the environment construct
     * @param attrs The attributes of the environment
     */
    static fromEnvironmentAttributes(scope: Construct, id: string, attrs: EnvironmentAttributes): IEnvironment;
    /**
     * The application associated with the environment.
     */
    readonly application?: IApplication;
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
     *
     * @attribute
     */
    readonly environmentId: string;
    /**
     * The Amazon Resource Name (ARN) of the environment.
     *
     * @attribute
     */
    readonly environmentArn: string;
    /**
     * The ID of the environment.
     */
    readonly applicationId: string;
    private readonly _cfnEnvironment;
    constructor(scope: Construct, id: string, props: EnvironmentProps);
    private createOrGetAlarmRole;
}
/**
 * The type of Monitor.
 */
export declare enum MonitorType {
    /**
     * A Monitor from a CloudWatch alarm.
     */
    CLOUDWATCH = 0,
    /**
     * A Monitor from a CfnEnvironment.MonitorsProperty construct.
     */
    CFN_MONITORS_PROPERTY = 1
}
/**
 * Defines monitors that will be associated with an AWS AppConfig environment.
 */
export declare abstract class Monitor {
    /**
     * Creates a Monitor from a CloudWatch alarm. If the alarm role is not specified, a role will
     * be generated.
     *
     * @param alarm The Amazon CloudWatch alarm.
     * @param alarmRole The IAM role for AWS AppConfig to view the alarm state.
     */
    static fromCloudWatchAlarm(alarm: cloudwatch.IAlarm, alarmRole?: iam.IRole): Monitor;
    /**
     * Creates a Monitor from a CfnEnvironment.MonitorsProperty construct.
     *
     * @param monitorsProperty The monitors property.
     */
    static fromCfnMonitorsProperty(monitorsProperty: CfnEnvironment.MonitorsProperty): Monitor;
    /**
     * The alarm ARN for AWS AppConfig to monitor.
     */
    abstract readonly alarmArn: string;
    /**
     * The type of monitor.
     */
    abstract readonly monitorType: MonitorType;
    /**
     * The IAM role ARN for AWS AppConfig to view the alarm state.
     */
    abstract readonly alarmRoleArn?: string;
    /**
     * Indicates whether a CloudWatch alarm is a composite alarm.
     */
    abstract readonly isCompositeAlarm?: boolean;
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
export {};
