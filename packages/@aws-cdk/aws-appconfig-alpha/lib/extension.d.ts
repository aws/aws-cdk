import { IResource, Resource } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
/**
 * Defines Extension action points.
 *
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/working-with-appconfig-extensions-about.html#working-with-appconfig-extensions-how-it-works-step-2
 */
export declare enum ActionPoint {
    PRE_CREATE_HOSTED_CONFIGURATION_VERSION = "PRE_CREATE_HOSTED_CONFIGURATION_VERSION",
    PRE_START_DEPLOYMENT = "PRE_START_DEPLOYMENT",
    ON_DEPLOYMENT_START = "ON_DEPLOYMENT_START",
    ON_DEPLOYMENT_STEP = "ON_DEPLOYMENT_STEP",
    ON_DEPLOYMENT_BAKING = "ON_DEPLOYMENT_BAKING",
    ON_DEPLOYMENT_COMPLETE = "ON_DEPLOYMENT_COMPLETE",
    ON_DEPLOYMENT_ROLLED_BACK = "ON_DEPLOYMENT_ROLLED_BACK"
}
/**
 * Defines the source type for event destinations.
 */
export declare enum SourceType {
    LAMBDA = "lambda",
    SQS = "sqs",
    SNS = "sns",
    EVENTS = "events"
}
/**
 * Implemented by allowed extension event destinations.
 */
export interface IEventDestination {
    /**
     * The URI of the extension event destination.
     */
    readonly extensionUri: string;
    /**
     * The type of the extension event destination.
     */
    readonly type: SourceType;
    /**
     * The IAM policy document to invoke the event destination.
     */
    readonly policyDocument?: iam.PolicyDocument;
}
/**
 * Use an AWS Lambda function as an event destination.
 */
export declare class LambdaDestination implements IEventDestination {
    readonly extensionUri: string;
    readonly type: SourceType;
    readonly policyDocument?: iam.PolicyDocument;
    constructor(func: lambda.IFunction);
}
/**
 * Use an Amazon SQS queue as an event destination.
 */
export declare class SqsDestination implements IEventDestination {
    readonly extensionUri: string;
    readonly type: SourceType;
    readonly policyDocument?: iam.PolicyDocument;
    constructor(queue: sqs.IQueue);
}
/**
 * Use an Amazon SNS topic as an event destination.
 */
export declare class SnsDestination implements IEventDestination {
    readonly extensionUri: string;
    readonly type: SourceType;
    readonly policyDocument?: iam.PolicyDocument;
    constructor(topic: sns.ITopic);
}
/**
 * Use an Amazon EventBridge event bus as an event destination.
 */
export declare class EventBridgeDestination implements IEventDestination {
    readonly extensionUri: string;
    readonly type: SourceType;
    constructor(bus: events.IEventBus);
}
/**
 * Properties for the Action construct
 */
export interface ActionProps {
    /**
     * The action points that will trigger the extension action.
     */
    readonly actionPoints: ActionPoint[];
    /**
     * The event destination for the action.
     */
    readonly eventDestination: IEventDestination;
    /**
     * The name for the action.
     *
     * @default - A name is generated.
     */
    readonly name?: string;
    /**
     * The execution role for the action.
     *
     * @default - A role is generated.
     */
    readonly executionRole?: iam.IRole;
    /**
     * The description for the action.
     *
     * @default - No description.
     */
    readonly description?: string;
    /**
     * The flag that specifies whether or not to create the execution role.
     *
     * If set to true, then the role will not be auto-generated under the assumption
     * there is already the corresponding resource-based policy attached to the event
     * destination. If false, the execution role will be generated if not provided.
     *
     * @default false
     */
    readonly invokeWithoutExecutionRole?: boolean;
}
/**
 * Defines an action for an extension.
 */
export declare class Action {
    /**
     * The action points that will trigger the extension action.
     */
    readonly actionPoints: ActionPoint[];
    /**
     * The event destination for the action.
     */
    readonly eventDestination: IEventDestination;
    /**
     * The name for the action.
     */
    readonly name?: string;
    /**
     * The execution role for the action.
     */
    readonly executionRole?: iam.IRole;
    /**
     * The description for the action.
     */
    readonly description?: string;
    /**
     * The flag that specifies whether to create the execution role.
     */
    readonly invokeWithoutExecutionRole?: boolean;
    constructor(props: ActionProps);
}
/**
 * Defines a parameter for an extension.
 */
export declare class Parameter {
    /**
     * A required parameter for an extension.
     *
     * @param name The name of the parameter
     * @param value The value of the parameter
     * @param description A description for the parameter
     */
    static required(name: string, value: string, description?: string): Parameter;
    /**
     * An optional parameter for an extension.
     *
     * @param name The name of the parameter
     * @param value The value of the parameter
     * @param description A description for the parameter
     */
    static notRequired(name: string, value?: string, description?: string): Parameter;
    /**
     * The name of the parameter.
     */
    readonly name: string;
    /**
     * A boolean that indicates if the parameter is required or optional.
     */
    readonly isRequired: boolean;
    /**
     * The value of the parameter.
     */
    readonly value?: string;
    /**
     * The description of the parameter.
     */
    readonly description?: string;
    private constructor();
}
/**
 * Attributes of an existing AWS AppConfig extension to import.
 */
export interface ExtensionAttributes {
    /**
     * The ID of the extension.
     */
    readonly extensionId: string;
    /**
     * The version number of the extension.
     */
    readonly extensionVersionNumber: number;
    /**
     * The Amazon Resource Name (ARN) of the extension.
     *
     * @default - The extension ARN is generated.
     */
    readonly extensionArn?: string;
    /**
     * The actions of the extension.
     *
     * @default - None.
     */
    readonly actions?: Action[];
    /**
     * The name of the extension.
     *
     * @default - None.
     */
    readonly name?: string;
    /**
     * The description of the extension.
     *
     * @default - None.
     */
    readonly description?: string;
}
/**
 * Options for the Extension construct.
 */
export interface ExtensionOptions {
    /**
     * The name of the extension.
     *
     * @default - A name is generated.
     */
    readonly extensionName?: string;
    /**
     * A description of the extension
     *
     * @default - No description.
     */
    readonly description?: string;
    /**
     * The latest version number of the extension. When you create a new version,
     * specify the most recent current version number. For example, you create version 3,
     * enter 2 for this field.
     *
     * @default - None.
     */
    readonly latestVersionNumber?: number;
    /**
     * The parameters accepted for the extension.
     *
     * @default - None.
     */
    readonly parameters?: Parameter[];
}
/**
 * Properties for the Extension construct.
 */
export interface ExtensionProps extends ExtensionOptions {
    /**
     * The actions for the extension.
     */
    readonly actions: Action[];
}
/**
 * An AWS AppConfig extension.
 *
 * @resource AWS::AppConfig::Extension
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/working-with-appconfig-extensions.html
 */
export declare class Extension extends Resource implements IExtension {
    /**
     * Imports an extension into the CDK using its Amazon Resource Name (ARN).
     *
     * @param scope The parent construct
     * @param id The name of the extension construct
     * @param extensionArn The Amazon Resource Name (ARN) of the extension
     */
    static fromExtensionArn(scope: Construct, id: string, extensionArn: string): IExtension;
    /**
     * Imports an extension into the CDK using its attributes.
     *
     * @param scope The parent construct
     * @param id The name of the extension construct
     * @param attrs The attributes of the extension
     */
    static fromExtensionAttributes(scope: Construct, id: string, attrs: ExtensionAttributes): IExtension;
    /**
     * The actions for the extension.
     */
    readonly actions?: Action[];
    /**
     * The name of the extension.
     */
    readonly name?: string;
    /**
     * The description of the extension.
     */
    readonly description?: string;
    /**
     * The latest version number of the extension.
     */
    readonly latestVersionNumber?: number;
    /**
     * The parameters of the extension.
     */
    readonly parameters?: Parameter[];
    /**
     * The Amazon Resource Name (ARN) of the extension.
     *
     * @attribute
     */
    readonly extensionArn: string;
    /**
     * The ID of the extension.
     *
     * @attribute
     */
    readonly extensionId: string;
    /**
     * The version number of the extension.
     *
     * @attribute
     */
    readonly extensionVersionNumber: number;
    private readonly _cfnExtension;
    private executionRole?;
    constructor(scope: Construct, id: string, props: ExtensionProps);
    private getExecutionRole;
}
export interface IExtension extends IResource {
    /**
     * The actions for the extension.
     */
    readonly actions?: Action[];
    /**
     * The name of the extension.
     */
    readonly name?: string;
    /**
     * The description of the extension.
     */
    readonly description?: string;
    /**
     * The latest version number of the extension.
     */
    readonly latestVersionNumber?: number;
    /**
     * The parameters of the extension.
     */
    readonly parameters?: Parameter[];
    /**
     * The Amazon Resource Name (ARN) of the extension.
     * @attribute
     */
    readonly extensionArn: string;
    /**
     * The ID of the extension.
     * @attribute
     */
    readonly extensionId: string;
    /**
     * The version number of the extension.
     * @attribute
     */
    readonly extensionVersionNumber: number;
}
/**
 * This class is meant to be used by AWS AppConfig resources (application,
 * configuration profile, environment) directly. There is currently no use
 * for this class outside of the AWS AppConfig construct implementation. It is
 * intended to be used with the resources since there is currently no way to
 * inherit from two classes (at least within JSII constraints).
 */
export declare class ExtensibleBase implements IExtensible {
    private resourceArn;
    private resourceName?;
    private scope;
    constructor(scope: Construct, resourceArn: string, resourceName?: string);
    on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions): void;
    preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    addExtension(extension: IExtension): void;
    private getExtensionForActionPoint;
    private addExtensionAssociation;
    private getExtensionHash;
    private getExtensionAssociationHash;
    private getExtensionDefaultName;
}
/**
 * Defines the extensible base implementation for extension association resources.
 */
export interface IExtensible {
    /**
     * Adds an extension defined by the action point and event destination and
     * also creates an extension association to the derived resource.
     *
     * @param actionPoint The action point which triggers the event
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds a PRE_CREATE_HOSTED_CONFIGURATION_VERSION extension with the provided event
     * destination and also creates an extension association to the derived resource.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds a PRE_START_DEPLOYMENT extension with the provided event destination and
     * also creates an extension association to the derived resource.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_START extension with the provided event destination and
     * also creates an extension association to the derived resource.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_STEP extension with the provided event destination and
     * also creates an extension association to the derived resource.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_BAKING extension with the provided event destination and
     * also creates an extension association to the derived resource.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_COMPLETE extension with the provided event destination and
     * also creates an extension association to the derived resource.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an ON_DEPLOYMENT_ROLLED_BACK extension with the provided event destination and
     * also creates an extension association to the derived resource.
     *
     * @param eventDestination The event that occurs during the extension
     * @param options Options for the extension
     */
    onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions): void;
    /**
     * Adds an extension association to the derived resource.
     *
     * @param extension The extension to create an association for
     */
    addExtension(extension: IExtension): void;
}
