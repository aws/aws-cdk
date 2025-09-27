import { IResource, Resource } from 'aws-cdk-lib';
import {
  DimensionsMap,
  Metric,
  MetricOptions,
  MetricProps,
  Stats,
} from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as agent_core from 'aws-cdk-lib/aws-bedrockagentcore';
import { Construct } from 'constructs';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
// Internal Libs
import { CodeInterpreterPerms } from './perms';
import { validateFieldPattern, validateStringFieldLength, throwIfInvalid } from './validation-helpers';

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
export const CODE_INTERPRETER_TAG_MAX_LENGTH = 256;

/******************************************************************************
 *                                 Enums
 *****************************************************************************/
/**
 * Network modes supported by code interpreter
 */
export enum CodeInterpreterNetworkMode {
  /**
   * Public network mode - allows internet access
   * This mode allows the code interpreter to access public internet resources.
   * This is suitable for scenarios where the code needs to interact with external APIs,
   * download libraries, or access public datasets.
   */
  PUBLIC = 'PUBLIC',

  /**
   * Sandbox network mode - isolated network environment
   * This mode provides a fully isolated environment with no external network access.
   * It is the most secure option, preventing the AI-generated code from accessing any external systems,
   * which is ideal for sensitive operations or when strict isolation is required.
   */
  SANDBOX = 'SANDBOX',
}

/******************************************************************************
 *                                Interface
 *****************************************************************************/
/**
 * Interface for CodeInterpreterCustom resources
 */
export interface ICodeInterpreterCustom extends IResource {
  /**
   * The ARN of the code interpreter resource
   * @example "arn:aws:bedrock-agentcore:eu-central-1:249522321342:codeinterpreter/codeinterpreter_6647g-vko61CBXCd"
   */
  readonly codeInterpreterArn: string;

  /**
   * The id of the code interpreter
   * @example "codeinterpreter_6647g-vko61CBXCd"
   */
  readonly codeInterpreterId: string;

  /**
   * The name of the code interpreter
   */
  readonly name: string;

  /**
   * The description of the code interpreter
   */
  readonly description?: string;

  /**
   * The network configuration for the code interpreter
   */
  readonly networkConfiguration: CodeInterpreterNetworkConfiguration;

  /**
   * The status of the code interpreter
   */
  readonly status?: string;

  /**
   * Timestamp when the code interpreter was created
   */
  readonly createdAt?: string;

  /**
   * Timestamp when the code interpreter was last updated
   */
  readonly lastUpdatedAt?: string;

  /**
   * The IAM role that provides permissions for the code interpreter to access AWS services.
   */
  readonly executionRole?: iam.IRole;

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
  public abstract readonly name: string;
  public abstract readonly description?: string;
  public abstract readonly networkConfiguration: CodeInterpreterNetworkConfiguration;
  public abstract readonly status?: string;
  public abstract readonly createdAt?: string;
  public abstract readonly lastUpdatedAt?: string;
  public abstract readonly executionRole?: iam.IRole;

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
   *
   * @param grantee - The IAM principal to grant invoke permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:GetCodeInterpreter', 'bedrock-agentcore:GetCodeInterpreterSession', 'bedrock-agentcore:ListCodeInterpreters', 'bedrock-agentcore:ListCodeInterpreterSessions']
   * - resourceArns: [this.codeInterpreterArn]
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const resourceSpecificGrant = this.grant(
      grantee,
      ...CodeInterpreterPerms.READ_PERMS,
    );

    const allResourceGrant = iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: ['*'],
      actions: CodeInterpreterPerms.LIST_PERMS,
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
    const resourceSpecificGrant = this.grant(
      grantee,
      ...CodeInterpreterPerms.USE_PERMS,
    );
    return resourceSpecificGrant;
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
    return this.grant(grantee, ...CodeInterpreterPerms.INVOKE_PERMS);
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
 *                                Network Configuration
 *****************************************************************************/

/**
 * Network configuration for code interpreter
 */
export interface CodeInterpreterNetworkConfiguration {
  /**
   * Network modes supported by code interpreter
   */
  readonly networkMode: CodeInterpreterNetworkMode;
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
 *                                Class
 *****************************************************************************/
/**
 * Custom code interpreter resource for AWS Bedrock Agent Core.
 * Provides a sandboxed environment for code execution with configurable network access.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/code-interpreter.html
 * @resource AWS::BedrockAgentCore::CodeInterpreterCustom
 */
export class CodeInterpreterCustom extends CodeInterpreterCustomBase {
  public readonly codeInterpreterArn: string;
  public readonly codeInterpreterId: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly networkConfiguration: CodeInterpreterNetworkConfiguration;
  public readonly status?: string;
  public readonly createdAt?: string;
  public readonly lastUpdatedAt?: string;
  public readonly executionRole?: iam.IRole;
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
    this.networkConfiguration = props.networkConfiguration ?? { networkMode: CodeInterpreterNetworkMode.PUBLIC };
    this.executionRole = props.executionRole ?? this._createCodeInterpreterRole();
    this.tags = props.tags;

    // Validate code interpreter name
    throwIfInvalid(this._validateCodeInterpreterName, this.name);

    // Validate code interpreter tags
    throwIfInvalid(this._validateCodeInterpreterTags, this.tags);

    // ------------------------------------------------------
    // CFN Props - With Lazy support
    // ------------------------------------------------------
    const cfnProps: agent_core.CfnCodeInterpreterCustomProps = {
      name: this.name,
      description: this.description,
      networkConfiguration: this._renderNetworkConfiguration(),
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
  }

  // ------------------------------------------------------
  // Lazy Renderers
  // ------------------------------------------------------

  /**
   * Render the network configuration.
   *
   * @returns CodeInterpreterNetworkConfigurationProperty object in CloudFormation format
   * @default - Network mode is PUBLIC
   * @internal This is an internal core function and should not be called directly.
   */
  private _renderNetworkConfiguration(): agent_core.CfnCodeInterpreterCustom.CodeInterpreterNetworkConfigurationProperty {
    return {
      networkMode: this.networkConfiguration.networkMode,
    };
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
