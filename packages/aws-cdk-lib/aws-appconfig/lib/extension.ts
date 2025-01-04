import { Construct } from 'constructs';
import { CfnExtension, CfnExtensionAssociation } from './appconfig.generated';
import { getHash, stringifyObjects } from './private/hash';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as sns from '../../aws-sns';
import * as sqs from '../../aws-sqs';
import { ArnFormat, IResource, Names, PhysicalName, Resource, Stack } from '../../core';

/**
 * Defines Extension action points.
 *
 * @see https://docs.aws.amazon.com/appconfig/latest/userguide/working-with-appconfig-extensions-about.html#working-with-appconfig-extensions-how-it-works-step-2
 */
export enum ActionPoint {
  PRE_CREATE_HOSTED_CONFIGURATION_VERSION = 'PRE_CREATE_HOSTED_CONFIGURATION_VERSION',
  PRE_START_DEPLOYMENT = 'PRE_START_DEPLOYMENT',
  ON_DEPLOYMENT_START = 'ON_DEPLOYMENT_START',
  ON_DEPLOYMENT_STEP = 'ON_DEPLOYMENT_STEP',
  ON_DEPLOYMENT_BAKING = 'ON_DEPLOYMENT_BAKING',
  ON_DEPLOYMENT_COMPLETE = 'ON_DEPLOYMENT_COMPLETE',
  ON_DEPLOYMENT_ROLLED_BACK = 'ON_DEPLOYMENT_ROLLED_BACK',
  AT_DEPLOYMENT_TICK = 'AT_DEPLOYMENT_TICK',
}

/**
 * Defines the source type for event destinations.
 */
export enum SourceType {
  LAMBDA = 'lambda',
  SQS = 'sqs',
  SNS = 'sns',
  EVENTS = 'events',
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
export class LambdaDestination implements IEventDestination {
  public readonly extensionUri: string;
  public readonly type: SourceType;
  public readonly policyDocument?: iam.PolicyDocument;

  constructor(func: lambda.IFunction) {
    this.extensionUri = func.functionArn;
    this.type = SourceType.LAMBDA;
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [this.extensionUri],
      actions: [
        'lambda:InvokeFunction',
        'lambda:InvokeAsync',
      ],
    });
    this.policyDocument = new iam.PolicyDocument({
      statements: [policy],
    });

    if (!func.permissionsNode.tryFindChild('AppConfigPermission')) {
      func.addPermission('AppConfigPermission', {
        principal: new iam.ServicePrincipal('appconfig.amazonaws.com'),
      });
    }
  }
}

/**
 * Use an Amazon SQS queue as an event destination.
 */
export class SqsDestination implements IEventDestination {
  public readonly extensionUri: string;
  public readonly type: SourceType;
  public readonly policyDocument?: iam.PolicyDocument;

  constructor(queue: sqs.IQueue) {
    this.extensionUri = queue.queueArn;
    this.type = SourceType.SQS;
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [this.extensionUri],
      actions: ['sqs:SendMessage'],
    });
    this.policyDocument = new iam.PolicyDocument({
      statements: [policy],
    });
  }
}

/**
 * Use an Amazon SNS topic as an event destination.
 */
export class SnsDestination implements IEventDestination {
  public readonly extensionUri: string;
  public readonly type: SourceType;
  public readonly policyDocument?: iam.PolicyDocument;

  constructor(topic: sns.ITopic) {
    this.extensionUri = topic.topicArn;
    this.type = SourceType.SNS;
    const policy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [this.extensionUri],
      actions: ['sns:Publish'],
    });
    this.policyDocument = new iam.PolicyDocument({
      statements: [policy],
    });
  }
}

/**
 * Use an Amazon EventBridge event bus as an event destination.
 */
export class EventBridgeDestination implements IEventDestination {
  public readonly extensionUri: string;
  public readonly type: SourceType;

  constructor(bus: events.IEventBus) {
    this.extensionUri = bus.eventBusArn;
    this.type = SourceType.EVENTS;
  }
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
export class Action {
  /**
   * The action points that will trigger the extension action.
   */
  public readonly actionPoints: ActionPoint[];

  /**
   * The event destination for the action.
   */
  public readonly eventDestination: IEventDestination;

  /**
   * The name for the action.
   */
  public readonly name?: string;

  /**
   * The execution role for the action.
   */
  public readonly executionRole?: iam.IRole;

  /**
   * The description for the action.
   */
  public readonly description?: string;

  /**
   * The flag that specifies whether to create the execution role.
   */
  readonly invokeWithoutExecutionRole?: boolean;

  public constructor(props: ActionProps) {
    this.actionPoints = props.actionPoints;
    this.eventDestination = props.eventDestination;
    this.name = props.name;
    this.executionRole = props.executionRole;
    this.description = props.description;
    this.invokeWithoutExecutionRole = props.invokeWithoutExecutionRole || false;
  }
}

/**
 * Defines a parameter for an extension.
 */
export class Parameter {
  /**
   * A required parameter for an extension.
   *
   * @param name The name of the parameter
   * @param value The value of the parameter
   * @param description A description for the parameter
   */
  public static required(name: string, value: string, description?: string): Parameter {
    return new Parameter(name, true, value, description);
  }

  /**
   * An optional parameter for an extension.
   *
   * @param name The name of the parameter
   * @param value The value of the parameter
   * @param description A description for the parameter
   */
  public static notRequired(name: string, value?: string, description?: string): Parameter {
    return new Parameter(name, false, value, description);
  }

  /**
   * The name of the parameter.
   */
  public readonly name: string;

  /**
   * A boolean that indicates if the parameter is required or optional.
   */
  public readonly isRequired: boolean;

  /**
   * The value of the parameter.
   */
  public readonly value?: string;

  /**
   * The description of the parameter.
   */
  public readonly description?: string;

  private constructor(name: string, isRequired: boolean, value?: string, description?: string) {
    this.name = name;
    this.isRequired = isRequired;
    this.value = value;
    this.description = description;
  }
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
export class Extension extends Resource implements IExtension {
  /**
   * Imports an extension into the CDK using its Amazon Resource Name (ARN).
   *
   * @param scope The parent construct
   * @param id The name of the extension construct
   * @param extensionArn The Amazon Resource Name (ARN) of the extension
   */
  public static fromExtensionArn(scope: Construct, id: string, extensionArn: string): IExtension {
    const parsedArn = Stack.of(scope).splitArn(extensionArn, ArnFormat.SLASH_RESOURCE_NAME);
    if (!parsedArn.resourceName) {
      throw new Error(`Missing required /$/{extensionId}//$/{extensionVersionNumber} from configuration profile ARN: ${parsedArn.resourceName}`);
    }

    const resourceName = parsedArn.resourceName.split('/');
    if (resourceName.length != 2 || !resourceName[0] || !resourceName[1]) {
      throw new Error('Missing required parameters for extension ARN: format should be /$/{extensionId}//$/{extensionVersionNumber}');
    }

    const extensionId = resourceName[0];
    const extensionVersionNumber = resourceName[1];

    class Import extends Resource implements IExtension {
      public readonly extensionId = extensionId;
      public readonly extensionVersionNumber = parseInt(extensionVersionNumber);
      public readonly extensionArn = extensionArn;
    }

    return new Import(scope, id, {
      environmentFromArn: extensionArn,
    });
  }

  /**
   * Imports an extension into the CDK using its attributes.
   *
   * @param scope The parent construct
   * @param id The name of the extension construct
   * @param attrs The attributes of the extension
   */
  public static fromExtensionAttributes(scope: Construct, id: string, attrs: ExtensionAttributes): IExtension {
    const stack = Stack.of(scope);
    const extensionArn = attrs.extensionArn || stack.formatArn({
      service: 'appconfig',
      resource: 'extension',
      resourceName: `${attrs.extensionId}/${attrs.extensionVersionNumber}`,
    });

    class Import extends Resource implements IExtension {
      public readonly extensionId = attrs.extensionId;
      public readonly extensionVersionNumber = attrs.extensionVersionNumber;
      public readonly extensionArn = extensionArn;
      public readonly name = attrs.name;
      public readonly actions = attrs.actions;
      public readonly description = attrs.description;
    }

    return new Import(scope, id, {
      environmentFromArn: extensionArn,
    });
  }

  /**
   * The actions for the extension.
   */
  public readonly actions?: Action[];

  /**
   * The name of the extension.
   */
  public readonly name?: string;

  /**
   * The description of the extension.
   */
  public readonly description?: string;

  /**
   * The latest version number of the extension.
   */
  public readonly latestVersionNumber?: number;

  /**
   * The parameters of the extension.
   */
  public readonly parameters?: Parameter[];

  /**
   * The Amazon Resource Name (ARN) of the extension.
   *
   * @attribute
   */
  public readonly extensionArn: string;

  /**
   * The ID of the extension.
   *
   * @attribute
   */
  public readonly extensionId: string;

  /**
   * The version number of the extension.
   *
   * @attribute
   */
  public readonly extensionVersionNumber: number;

  private readonly _cfnExtension: CfnExtension;
  private executionRole?: iam.IRole;

  constructor(scope: Construct, id: string, props: ExtensionProps) {
    super(scope, id, {
      physicalName: props.extensionName,
    });

    this.actions = props.actions;
    this.name = props.extensionName || Names.uniqueResourceName(this, {
      maxLength: 64,
      separator: '-',
    });
    this.description = props.description;
    this.latestVersionNumber = props.latestVersionNumber;
    this.parameters = props.parameters;

    const resource = new CfnExtension(this, 'Resource', {
      actions: this.actions.reduce((acc: {[key: string]: {[key: string]: string}[]}, cur: Action, index: number) => {
        const extensionUri = cur.eventDestination.extensionUri;
        const sourceType = cur.eventDestination.type;
        this.executionRole = cur.executionRole;
        const name = cur.name ?? `${this.name}-${index}`;
        cur.actionPoints.forEach((actionPoint) => {
          acc[actionPoint] = [
            {
              Name: name,
              Uri: extensionUri,
              ...(sourceType === SourceType.EVENTS || cur.invokeWithoutExecutionRole
                ? {}
                : { RoleArn: this.executionRole?.roleArn || this.getExecutionRole(cur.eventDestination, name).roleArn }),
              ...(cur.description ? { Description: cur.description } : {}),
            },
          ];
        });
        return acc;
      }, {}),
      name: this.name,
      description: this.description,
      latestVersionNumber: this.latestVersionNumber,
      parameters: this.parameters?.reduce((acc: {[key: string]: CfnExtension.ParameterProperty}, cur: Parameter) => {
        acc[cur.name] = {
          required: cur.isRequired,
          description: cur.description,
        };
        return acc;
      }, {}),
    });
    this._cfnExtension = resource;

    this.extensionId = this._cfnExtension.attrId;
    this.extensionVersionNumber = this._cfnExtension.attrVersionNumber;
    this.extensionArn = this.getResourceArnAttribute(this._cfnExtension.attrArn, {
      service: 'appconfig',
      resource: 'extension',
      resourceName: `${this.extensionId}/${this.extensionVersionNumber}`,
    });
  }

  private getExecutionRole(eventDestination: IEventDestination, actionName: string): iam.IRole {
    const versionNumber = this.latestVersionNumber ? this.latestVersionNumber + 1 : 1;
    const combinedObjects = stringifyObjects(this.name, versionNumber, actionName);
    this.executionRole = new iam.Role(this, `Role${getHash(combinedObjects)}`, {
      roleName: PhysicalName.GENERATE_IF_NEEDED,
      assumedBy: new iam.ServicePrincipal('appconfig.amazonaws.com'),
      inlinePolicies: {
        ['AllowAppConfigInvokeExtensionEventSourcePolicy']: eventDestination.policyDocument!,
      },
    });

    return this.executionRole;
  }
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
export class ExtensibleBase implements IExtensible {
  private resourceArn: string;
  private resourceName?: string;
  private scope: Construct;

  public constructor(scope: Construct, resourceArn: string, resourceName?: string) {
    this.resourceArn = resourceArn;
    this.resourceName = resourceName;
    this.scope = scope;
  }

  public on(actionPoint: ActionPoint, eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.getExtensionForActionPoint(eventDestination, actionPoint, options);
  }

  public preCreateHostedConfigurationVersion(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.getExtensionForActionPoint(eventDestination, ActionPoint.PRE_CREATE_HOSTED_CONFIGURATION_VERSION, options);
  }

  public preStartDeployment(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.getExtensionForActionPoint(eventDestination, ActionPoint.PRE_START_DEPLOYMENT, options);
  }

  public onDeploymentStart(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_START, options);
  }

  public onDeploymentStep(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_STEP, options);
  }

  public onDeploymentBaking(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_BAKING, options);
  }

  public onDeploymentComplete(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_COMPLETE, options);
  }

  public onDeploymentRolledBack(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.getExtensionForActionPoint(eventDestination, ActionPoint.ON_DEPLOYMENT_ROLLED_BACK, options);
  }

  public atDeploymentTick(eventDestination: IEventDestination, options?: ExtensionOptions) {
    this.getExtensionForActionPoint(eventDestination, ActionPoint.AT_DEPLOYMENT_TICK, options);
  }

  public addExtension(extension: IExtension) {
    this.addExtensionAssociation(extension);
  }

  private getExtensionForActionPoint(eventDestination: IEventDestination, actionPoint: ActionPoint, options?: ExtensionOptions) {
    const name = options?.extensionName || this.getExtensionDefaultName();
    const versionNumber = options?.latestVersionNumber ? options?.latestVersionNumber + 1 : 1;
    const extension = new Extension(this.scope, `Extension${this.getExtensionHash(name, versionNumber)}`, {
      actions: [
        new Action({
          eventDestination,
          actionPoints: [
            actionPoint,
          ],
        }),
      ],
      extensionName: name,
      ...(options?.description ? { description: options.description } : {}),
      ...(options?.latestVersionNumber ? { latestVersionNumber: options.latestVersionNumber } : {}),
      ...(options?.parameters ? { parameters: options.parameters } : {}),
    });
    this.addExtensionAssociation(extension);
  }

  private addExtensionAssociation(extension: IExtension) {
    const versionNumber = extension?.latestVersionNumber ? extension?.latestVersionNumber + 1 : 1;
    const name = extension.name ?? this.getExtensionDefaultName();
    new CfnExtensionAssociation(this.scope, `AssociationResource${this.getExtensionAssociationHash(name, versionNumber)}`, {
      extensionIdentifier: extension.extensionId,
      resourceIdentifier: this.resourceArn,
      extensionVersionNumber: extension.extensionVersionNumber,
      parameters: extension.parameters?.reduce((acc: {[key: string]: string}, cur: Parameter) => {
        if (cur.value) {
          acc[cur.name] = cur.value;
        }
        return acc;
      }, {}),
    });
  }

  private getExtensionHash(name: string, versionNumber: number) {
    const combinedString = stringifyObjects(name, versionNumber);
    return getHash(combinedString);
  }

  private getExtensionAssociationHash(name: string, versionNumber: number) {
    const resourceIdentifier = this.resourceName ?? this.resourceArn;
    const combinedString = stringifyObjects(resourceIdentifier, name, versionNumber);
    return getHash(combinedString);
  }

  private getExtensionDefaultName() {
    return Names.uniqueResourceName(this.scope, {
      maxLength: 54,
      separator: '-',
    }) + '-Extension';
  }
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
   * Adds an AT_DEPLOYMENT_TICK extension with the provided event destination and
   * also creates an extension association to the derived resource.
   *
   * @param eventDestination The event that occurs during the extension
   * @param options Options for the extension
   */
  atDeploymentTick(eventDestination: IEventDestination, options?: ExtensionOptions): void;

  /**
   * Adds an extension association to the derived resource.
   *
   * @param extension The extension to create an association for
   */
  addExtension(extension: IExtension): void;
}
