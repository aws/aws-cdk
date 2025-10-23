import {
  Arn,
  ArnFormat,
  IResource,
  Lazy,
  Resource,
} from 'aws-cdk-lib';
import {
  DimensionsMap,
  Metric,
  MetricOptions,
  MetricProps,
  Stats,
} from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as agent_core from 'aws-cdk-lib/aws-bedrockagentcore';
import { Construct } from 'constructs';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
// Internal Libs
import * as perms from './perms';
import { validateFieldPattern, validateStringFieldLength, throwIfInvalid } from './validation-helpers';
import { CodeInterpreterNetworkConfiguration } from '../network/network-configuration';

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/

/**
 * Minimum length for code interpreter name
 * @internal
 */
const CODE_INTERPRETER_NAME_MIN_LENGTH = 1;

/**
 * Maximum length for code interpreter name
 * @internal
 */
const CODE_INTERPRETER_NAME_MAX_LENGTH = 48;

/**
 * Minimum length for code interpreter tag
 * @internal
 */
const CODE_INTERPRETER_TAG_MIN_LENGTH = 1;

/**
 * Maximum length for code interpreter tag
 * @internal
 */
const CODE_INTERPRETER_TAG_MAX_LENGTH = 256;

/******************************************************************************
 *                                Interface
 *****************************************************************************/
/**
 * Interface for CodeInterpreterCustom resources
 */
export interface ICodeInterpreterCustom extends IResource, iam.IGrantable, ec2.IConnectable {
  /**
   * The ARN of the code interpreter resource
   * @attribute
   */
  readonly codeInterpreterArn: string;

  /**
   * The id of the code interpreter
   * @attribute
   */
  readonly codeInterpreterId: string;

  /**
   * The status of the code interpreter
   * @attribute
   */
  readonly status?: string;

  /**
   * Timestamp when the code interpreter was created
   * @attribute
   */
  readonly createdAt?: string;

  /**
   * Timestamp when the code interpreter was last updated
   * @attribute
   */
  readonly lastUpdatedAt?: string;

  /**
   * The IAM role that provides permissions for the code interpreter to access AWS services.
   */
  readonly executionRole: iam.IRole;

  /**
   *  Grants IAM actions to the IAM Principal
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants `Get` and `List` actions on the Code Interpreter
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grants `Invoke`, `Start`, and `Stop` actions on the Code Interpreter
   */
  grantUse(grantee: iam.IGrantable): iam.Grant;

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this code interpreter.
   */
  metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric;

  /**
   * Return the given named metric related to the API operation performed on this code interpreter.
   */
  metricForApiOperation(metricName: string, operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the latency of a specific API operation performed on this code interpreter.
   */
  metricLatencyForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the total number of API requests made for a specific code interpreter operation.
   */
  metricInvocationsForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of errors for a specific API operation performed on this code interpreter.
   */
  metricErrorsForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of throttled requests for a specific API operation performed on this code interpreter.
   */
  metricThrottlesForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of system errors for a specific API operation performed on this code interpreter.
   */
  metricSystemErrorsForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of user errors for a specific API operation performed on this code interpreter.
   */
  metricUserErrorsForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the duration of code interpreter sessions.
   */
  metricSessionDuration(props?: MetricOptions): Metric;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/
/**
 * Abstract base class for a Code Interpreter.
 * Contains methods and attributes valid for Code Interpreters either created with CDK or imported.
 */
export abstract class CodeInterpreterCustomBase extends Resource implements ICodeInterpreterCustom {
  public abstract readonly codeInterpreterArn: string;
  public abstract readonly codeInterpreterId: string;
  public abstract readonly status?: string;
  public abstract readonly createdAt?: string;
  public abstract readonly lastUpdatedAt?: string;
  public abstract readonly executionRole: iam.IRole;
  /**
   * The principal to grant permissions to
   */
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /**
   * An accessor for the Connections object that will fail if this Browser does not have a VPC
   * configured.
   */
  public get connections(): ec2.Connections {
    if (!this._connections) {
      throw new Error('Cannot manage network access without configuring a VPC');
    }
    return this._connections;
  }
  /**
   * The actual Connections object for this Browser. This may be unset in the event that a VPC has not
   * been configured.
   * @internal
   */
  protected _connections: ec2.Connections | undefined;

  constructor(scope: Construct, id: string) {
    super(scope, id);
  }

  /**
   * Grants IAM actions to the IAM Principal
   * @param grantee - The IAM principal to grant permissions to
   * @param actions - The actions to grant
   * @returns An IAM Grant object representing the granted permissions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: [this.codeInterpreterArn],
      actions: actions,
    });
  }

  /**
   * Grant read permissions on this code interpreter to an IAM principal.
   * This includes both read permissions on the specific code interpreter and list permissions on all code interpreters.
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:GetCodeInterpreter', 'bedrock-agentcore:GetCodeInterpreterSession'] on this.codeInterpreterArn
   * - actions: ['bedrock-agentcore:ListCodeInterpreters', 'bedrock-agentcore:ListCodeInterpreterSessions'] on all resources (*)
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const resourceSpecificGrant = this.grant(
      grantee,
      ...perms.CODE_INTERPRETER_READ_PERMS,
    );

    const allResourceGrant = iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: ['*'],
      actions: perms.CODE_INTERPRETER_LIST_PERMS,
    });
    // Return combined grant
    return resourceSpecificGrant.combine(allResourceGrant);
  }

  /**
   * Grant invoke permissions on this code interpreter to an IAM principal.
   *
   * @param grantee - The IAM principal to grant invoke permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:StartCodeInterpreterSession', 'bedrock-agentcore:InvokeCodeInterpreter', 'bedrock-agentcore:StopCodeInterpreterSession']
   * - resourceArns: [this.codeInterpreterArn]
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantUse(grantee: iam.IGrantable): iam.Grant {
    return this.grant(
      grantee,
      ...perms.CODE_INTERPRETER_USE_PERMS,
    );
  }

  /**
   * Grant invoke permissions on this code interpreter to an IAM principal.
   *
   * @param grantee - The IAM principal to grant invoke permissions to
   * @returns An IAM Grant object representing the granted permissions
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:InvokeCodeInterpreter']
   * - resourceArns: [this.codeInterpreterArn]
   */
  public grantInvoke(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, ...perms.CODE_INTERPRETER_INVOKE_PERMS);
  }

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this code interpreter.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      namespace: 'AWS/Bedrock-AgentCore',
      metricName,
      dimensionsMap: { ...dimensions, Resource: this.codeInterpreterArn },
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Creates a CloudWatch metric for tracking code interpreter api operations..
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: metricName
   * - dimensionsMap: { CodeInterpreterId: this.codeInterpreterId }
   * @returns A CloudWatch Metric configured for code interpreter api operations
   */
  public metricForApiOperation(
    metricName: string,
    operation: string,
    props?: MetricOptions,
  ): Metric {
    return this.metric(metricName, { Operation: operation }, props);
  }

  /**
   * Creates a CloudWatch metric for tracking code interpreter latencies.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Latency
   * @returns A CloudWatch Metric configured for code interpreter latencies
   */
  public metricLatencyForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Latency', operation, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking code interpreter invocations.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Invocations
   * @returns A CloudWatch Metric configured for code interpreter invocations
   */
  public metricInvocationsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Invocations', operation, {
      statistic: Stats.SUM,
      ...props,
    });
  }

  /**
   * Creates a CloudWatch metric for tracking code interpreter errors.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Errors
   * @returns A CloudWatch Metric configured for code interpreter errors
   */
  public metricErrorsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Errors', operation, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking code interpreter throttles.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Throttles
   * @returns A CloudWatch Metric configured for code interpreter throttles
   */
  public metricThrottlesForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Throttles', operation, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking code interpreter system errors.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: SystemErrors
   * @returns A CloudWatch Metric configured for code interpreter system errors
   */
  public metricSystemErrorsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('SystemErrors', operation, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking code interpreter user errors.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: UserErrors
   * @returns A CloudWatch Metric configured for code interpreter user errors
   */
  public metricUserErrorsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('UserErrors', operation, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking code interpreter session duration.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Duration
   * @returns A CloudWatch Metric configured for code interpreter session duration
   */
  public metricSessionDuration(props?: MetricOptions): Metric {
    return this.metric('Duration', { Operation: 'CodeInterpreterSession' }, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Internal method to create a metric.
   *
   * @param props - Configuration options for the metric
   * @returns A CloudWatch Metric configured for code interpreter api operations
   */
  private configureMetric(props: MetricProps) {
    return new Metric({
      ...props,
      region: props?.region ?? this.stack.region,
      account: props?.account ?? this.stack.account,
    });
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a CodeInterpreter resource
 */
export interface CodeInterpreterCustomProps {
  /**
   * The name of the code interpreter
   * Valid characters are a-z, A-Z, 0-9, _ (underscore)
   * The name must start with a letter and can be up to 48 characters long
   * Pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
   * @required - Yes
   */
  readonly codeInterpreterCustomName: string;

  /**
   * Optional description for the code interpreter
   * Valid characters are a-z, A-Z, 0-9, _ (underscore), - (hyphen) and spaces
   * The description can have up to 200 characters
   * @default - No description
   * @required - No
   */
  readonly description?: string;

  /**
   * The IAM role that provides permissions for the code interpreter to access AWS services.
   *
   * @default - A new role will be created.
   * @required - No
   */
  readonly executionRole?: iam.IRole;

  /**
   * Network configuration for code interpreter
   * @required - No
   * @default - PUBLIC network mode
   */
  readonly networkConfiguration?: CodeInterpreterNetworkConfiguration;

  /**
   * Tags (optional)
   * A list of key:value pairs of tags to apply to this Code Interpreter resource
   *
   * @default {} - no tags
   * @required - No
   */
  readonly tags?: { [key: string]: string };
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes for specifying an imported Code Interpreter Custom.
 */
export interface CodeInterpreterCustomAttributes {
  /**
   * The ARN of the agent.
   * @attribute
   */
  readonly codeInterpreterArn: string;
  /**
   * The ARN of the IAM role associated to the code interpreter.
   * @attribute
   */
  readonly roleArn: string;
  /**
   * When this code interpreter was last updated.
   * @default undefined - No last updated timestamp is provided
   */
  readonly lastUpdatedAt?: string;
  /**
   * The status of the code interpreter.
   * @default undefined - No status is provided
   */
  readonly status?: string;
  /**
   * The created timestamp of the code interpreter.
   * @default undefined - No created timestamp is provided
   */
  readonly createdAt?: string;
  /**
   * The security groups for this code interpreter, if in a VPC.
   *
   * @default - By default, the code interpreter is not in a VPC.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
}

/******************************************************************************
 *                                Class
 *****************************************************************************/
/**
 * Custom code interpreter resource for AWS Bedrock Agent Core.
 * Provides a sandboxed environment for code execution with configurable network access.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter.html
 * @resource AWS::BedrockAgentCore::CodeInterpreterCustom
 */
@propertyInjectable
export class CodeInterpreterCustom extends CodeInterpreterCustomBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.CodeInterpreterCustom';

  /**
   * Static Method for importing an existing Bedrock AgentCore Code Interpreter Custom.
   */
  /**
   * Creates an Code Interpreter Custom reference from an existing code interpreter's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing code interpreter custom
   * @returns An ICodeInterpreterCustom reference to the existing code interpreter
   */
  public static fromCodeInterpreterCustomAttributes(scope: Construct, id: string, attrs: CodeInterpreterCustomAttributes): ICodeInterpreterCustom {
    class Import extends CodeInterpreterCustomBase {
      public readonly codeInterpreterArn = attrs.codeInterpreterArn;
      public readonly codeInterpreterId = Arn.split(attrs.codeInterpreterArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly executionRole = iam.Role.fromRoleArn(scope, `${id}Role`, attrs.roleArn);
      public readonly lastUpdatedAt = attrs.lastUpdatedAt;
      public readonly grantPrincipal = this.executionRole;
      public readonly status = attrs.status;
      public readonly createdAt = attrs.createdAt;

      constructor(s: Construct, i: string) {
        super(s, i);

        this.grantPrincipal = this.executionRole || new iam.UnknownPrincipal({ resource: this });
        if (attrs.securityGroups) {
          this._connections = new ec2.Connections({
            securityGroups: attrs.securityGroups,
          });
        }
      }
    }

    // Return new Code Interpreter Custom
    return new Import(scope, id);
  }
  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------
  /**
   * The ARN of the code interpreter resource
   * @attribute
   */
  public readonly codeInterpreterArn: string;
  /**
   * The id of the code interpreter
   * @attribute
   */
  public readonly codeInterpreterId: string;
  /**
   * The name of the code interpreter
   */
  public readonly name: string;
  /**
   * The description of the code interpreter
   */
  public readonly description?: string;
  /**
   * The network configuration of the code interpreter
   */
  public readonly networkConfiguration: CodeInterpreterNetworkConfiguration;
  /**
   * The status of the code interpreter
   * @attribute
   */
  public readonly status?: string;
  /**
   * The created timestamp of the code interpreter
   * @attribute
   */
  public readonly createdAt?: string;
  /**
   * The last updated timestamp of the code interpreter
   * @attribute
   */
  public readonly lastUpdatedAt?: string;
  /**
   * The failure reason of the code interpreter
   * @attribute
   */
  public readonly failureReason?: string;
  /**
   * The IAM role that provides permissions for the code interpreter to access AWS services.
   */
  public readonly executionRole: iam.IRole;
  /**
   * The principal to grant permissions to
   */
  public readonly grantPrincipal: iam.IPrincipal;
  /**
   * Tags applied to this code interpreter resource
   * A map of key-value pairs for resource tagging
   * @default - No tags applied
   */
  public readonly tags?: { [key: string]: string };

  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  private readonly __resource: agent_core.CfnCodeInterpreterCustom;

  constructor(scope: Construct, id: string, props: CodeInterpreterCustomProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.name = props.codeInterpreterCustomName;
    this.description = props.description;
    this.networkConfiguration = props.networkConfiguration ?? CodeInterpreterNetworkConfiguration.usingPublicNetwork();
    this.executionRole = props.executionRole ?? this._createCodeInterpreterRole();
    this.grantPrincipal = this.executionRole;
    this.tags = props.tags;

    // Validate code interpreter name
    throwIfInvalid(this._validateCodeInterpreterName, this.name);

    // Validate code interpreter tags
    throwIfInvalid(this._validateCodeInterpreterTags, this.tags);

    // Network configuration and validation is done in the network configuration class
    // So we don't need to validate it here

    // Set connections - create a shared connections object
    if (this.networkConfiguration.connections) {
      // Use the network configuration's connections as the shared object
      this._connections = this.networkConfiguration.connections;
    }

    // ------------------------------------------------------
    // CFN Props - With Lazy support
    // ------------------------------------------------------
    const cfnProps: agent_core.CfnCodeInterpreterCustomProps = {
      name: this.name,
      description: this.description,
      networkConfiguration: Lazy.any({ produce: () => this.networkConfiguration._render(this._connections) }),
      executionRoleArn: this.executionRole?.roleArn,
      tags: this.tags,
    };

    // L1 instantiation
    this.__resource = new agent_core.CfnCodeInterpreterCustom(this, 'Resource', cfnProps);

    // Get attributes directly from the CloudFormation resource
    this.codeInterpreterId = this.__resource.attrCodeInterpreterId;
    this.codeInterpreterArn = this.__resource.attrCodeInterpreterArn;
    this.status = this.__resource.attrStatus;
    this.createdAt = this.__resource.attrCreatedAt;
    this.lastUpdatedAt = this.__resource.attrLastUpdatedAt;
    this.failureReason = this.__resource.attrFailureReason;
  }

  // ------------------------------------------------------
  // Validators
  // ------------------------------------------------------
  /**
   * Validates the code interpreter name format
   * @param name The code interpreter name to validate
   * @returns Array of validation error messages, empty if valid
   * @internal This is an internal core function and should not be called directly.
   */
  private _validateCodeInterpreterName = (name: string): string[] => {
    let errors: string[] = [];

    errors.push(...validateStringFieldLength({
      value: name,
      fieldName: 'Code interpreter name',
      minLength: CODE_INTERPRETER_NAME_MIN_LENGTH,
      maxLength: CODE_INTERPRETER_NAME_MAX_LENGTH,
    }));

    // Check if name matches the AWS API pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
    // Must start with a letter, followed by up to 47 letters, numbers, or underscores
    const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;
    errors.push(...validateFieldPattern(name, 'Code interpreter name', validNamePattern));

    return errors;
  };

  /**
   * Validates the code interpreter tags format
   * @param tags The tags object to validate
   * @returns Array of validation error messages, empty if valid
   * @internal This is an internal core function and should not be called directly.
   */
  private _validateCodeInterpreterTags = (tags?: { [key: string]: string }): string[] => {
    let errors: string[] = [];
    if (!tags) {
      return errors; // Tags are optional
    }

    // Validate each tag key and value
    for (const [key, value] of Object.entries(tags)) {
      errors.push(...validateStringFieldLength({
        value: key,
        fieldName: 'Tag key',
        minLength: CODE_INTERPRETER_TAG_MIN_LENGTH,
        maxLength: CODE_INTERPRETER_TAG_MAX_LENGTH,
      }));

      // Validate tag key pattern: ^[a-zA-Z0-9\s._:/=+@-]*$
      const validKeyPattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;
      errors.push(...validateFieldPattern(key, 'Tag key', validKeyPattern));

      // Validate tag value
      errors.push(...validateStringFieldLength({
        value: value,
        fieldName: 'Tag value',
        minLength: CODE_INTERPRETER_TAG_MIN_LENGTH,
        maxLength: CODE_INTERPRETER_TAG_MAX_LENGTH,
      }));

      // Validate tag value pattern: ^[a-zA-Z0-9\s._:/=+@-]*$
      const validValuePattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;
      errors.push(...validateFieldPattern(value, 'Tag value', validValuePattern));
    }

    return errors;
  };

  /**
   * Creates execution role needed for the code interpreter to access AWS services
   * @returns The created role
   * @internal This is an internal core function and should not be called directly.
   */
  private _createCodeInterpreterRole(): iam.IRole {
    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    return role;
  }
}
