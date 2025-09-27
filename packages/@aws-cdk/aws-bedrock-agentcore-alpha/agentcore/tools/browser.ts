import { IResource, Resource } from 'aws-cdk-lib';
import {
  DimensionsMap,
  Metric,
  MetricOptions,
  MetricProps,
  Stats,
} from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as agent_core from 'aws-cdk-lib/aws-bedrockagentcore';
import { Location } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
// Internal Libs
import { BrowserPerms } from './perms';
import { validateFieldPattern, validateStringFieldLength, throwIfInvalid } from './validation-helpers';

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/
/**
 * Minimum length for browser name
 * @internal
 */
const BROWSER_NAME_MIN_LENGTH = 1;

/**
 * Maximum length for browser name
 * @internal
 */
const BROWSER_NAME_MAX_LENGTH = 48;

/**
 * Minimum length for browser tags
 * @internal
 */
const BROWSER_TAG_MIN_LENGTH = 1;

/**
 * Maximum length for browser tags
 * @internal
 */
const BROWSER_TAG_MAX_LENGTH = 256;

/******************************************************************************
 *                                 Enums
 *****************************************************************************/
/**
 * Network modes supported by browser
 */
export enum BrowserNetworkMode {
  /**
   * Public network mode - This mode allows the Browser Tool to access public internet resources.
   * It is suitable for scenarios where your agents need to interact with publicly available websites and web applications.
   * VPC mode is not supported with this option.
   */
  PUBLIC = 'PUBLIC',
}

/******************************************************************************
 *                                Interface
 *****************************************************************************/
/**
 * Interface for Browser resources
 */
export interface IBrowserCustom extends IResource {
  /**
   * The ARN of the browser resource.
   * - Format Custom browser: `arn:${Partition}:bedrock-agentcore:${Region}:${Account}:browser-custom/${BrowserId}`
   * - Format AWS browser: `arn:${Partition}:bedrock-agentcore:${Region}:aws:browser/${BrowserId}`
   * @example "arn:aws:bedrock-agentcore:eu-central-1:249522321342:browser/browser_6647g-vko61CBXCd"
   */
  readonly browserArn: string;

  /**
   * The id of the browser
   * @example "browser_6647g-vko61CBXCd"
   */
  readonly browserId: string;

  /**
   * The name of the browser
   */
  readonly name: string;

  /**
   * The description of the browser
   */
  readonly description?: string;

  /**
   * The network configuration for the browser
   */
  readonly networkConfiguration: BrowserNetworkConfiguration;

  /**
   * The recording configuration for the browser
   */
  readonly recordingConfig?: RecordingConfig;

  /**
   * The IAM role that provides permissions for the browser to access AWS services
   */
  readonly executionRole?: iam.IRole;

  /**
   * Timestamp when the browser was last updated
   */
  readonly lastUpdatedAt?: string;

  /**
   * The status of the browser
   */
  readonly status?: string;

  /**
   * Timestamp when the browser was created
   */
  readonly createdAt?: string;

  /**
   * Grants IAM actions to the IAM Principal
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
  /**
   * Grants `Get` and `List` actions on the Browser
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;
  /**
   * Grants `Invoke`, `Start`, and `Update` actions on the Browser
   */
  grantUse(grantee: iam.IGrantable): iam.Grant;

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this browser.
   */
  metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric;

  /**
   * Return the given named metric related to the API operation performed on this browser.
   */
  metricForApiOperation(metricName: string, operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the latency of a specific API operation performed on this browser.
   */
  metricLatencyForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the total number of API requests made for a specific browser operation.
   */
  metricInvocationsForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of errors for a specific API operation performed on this browser.
   */
  metricErrorsForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of throttled requests for a specific API operation performed on this browser.
   */
  metricThrottlesForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of system errors for a specific API operation performed on this browser.
   */
  metricSystemErrorsForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of user errors for a specific API operation performed on this browser.
   */
  metricUserErrorsForApiOperation(operation: string, props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the duration of browser sessions.
   */
  metricSessionDuration(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of user takeovers.
   */
  metricTakeOverCount(props?: MetricOptions): Metric;

  /**
   * Return a metric containing the number of user takeovers released.
   */
  metricTakeOverReleaseCount(props?: MetricOptions): Metric;

  /**
   * Return a metric measuring the duration of user takeovers.
   */
  metricTakeOverDuration(props?: MetricOptions): Metric;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/
/**
 * Abstract base class for a Browser.
 * Contains methods and attributes valid for Browsers either created with CDK or imported.
 */
export abstract class BrowserCustomBase extends Resource implements IBrowserCustom {
  public abstract readonly browserArn: string;
  public abstract readonly browserId: string;
  public abstract readonly name: string;
  public abstract readonly description?: string;
  public abstract readonly networkConfiguration: BrowserNetworkConfiguration;
  public abstract readonly recordingConfig?: RecordingConfig;
  public abstract readonly lastUpdatedAt?: string;
  public abstract readonly status?: string;
  public abstract readonly createdAt?: string;
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
      resourceArns: [this.browserArn],
      actions: actions,
    });
  }

  /**
   * Grant read permissions on this browser to an IAM principal.
   *
   * @param grantee - The IAM principal to grant invoke permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:GetBrowser', 'bedrock-agentcore:GetBrowserSession', 'bedrock-agentcore:ListBrowsers', 'bedrock-agentcore:ListBrowserSessions']
   * - resourceArns: [this.browserArn]
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const resourceSpecificGrant = this.grant(
      grantee,
      ...BrowserPerms.READ_PERMS,
    );

    const allResourceGrant = iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: ['*'],
      actions: BrowserPerms.LIST_PERMS,
    });
    // Return combined grant
    return resourceSpecificGrant.combine(allResourceGrant);
  }

  /**
   * Grant invoke permissions on this browser to an IAM principal.
   *
   * @param grantee - The IAM principal to grant invoke permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:StartBrowserSession', 'bedrock-agentcore:UpdateBrowserStream', 'bedrock-agentcore:StopBrowserSession']
   * - resourceArns: [this.browserArn]
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantUse(grantee: iam.IGrantable): iam.Grant {
    return this.grant(
      grantee,
      ...BrowserPerms.USE_PERMS,
    );
  }

  // ------------------------------------------------------
  // Metrics
  // ------------------------------------------------------
  /**
   * Return the given named metric for this browser.
   *
   * By default, the metric will be calculated as a sum over a period of 5 minutes.
   * You can customize this by using the `statistic` and `period` properties.
   */
  public metric(metricName: string, dimensions: DimensionsMap, props?: MetricOptions): Metric {
    const metricProps: MetricProps = {
      namespace: 'AWS/Bedrock-AgentCore',
      metricName,
      dimensionsMap: { ...dimensions, Resource: this.browserArn },
      ...props,
    };
    return this.configureMetric(metricProps);
  }

  /**
   * Creates a CloudWatch metric for tracking browser api operations..
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: metricName
   * - dimensionsMap: { BrowserId: this.browserId }
   * @returns A CloudWatch Metric configured for browser api operations
   */
  public metricForApiOperation(
    metricName: string,
    operation: string,
    props?: MetricOptions,
  ): Metric {
    return this.metric(metricName, { Operation: operation }, props);
  }

  /**
   * Creates a CloudWatch metric for tracking browser latencies.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Latency
   * @returns A CloudWatch Metric configured for browser latencies
   */
  public metricLatencyForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Latency', operation, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking browser invocations.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Invocations
   * @returns A CloudWatch Metric configured for browser latencies
   */
  public metricInvocationsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Invocations', operation, {
      statistic: Stats.SUM,
      ...props,
    });
  }

  /**
   * Creates a CloudWatch metric for tracking browser errors.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Errors
   * @returns A CloudWatch Metric configured for browser errors
   */
  public metricErrorsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Errors', operation, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking browser throttles.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Throttles
   * @returns A CloudWatch Metric configured for browser throttles
   */
  public metricThrottlesForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('Throttles', operation, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking browser system errors.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: SystemErrors
   * @returns A CloudWatch Metric configured for browser system errors
   */
  public metricSystemErrorsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('SystemErrors', operation, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking browser user errors.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: UserErrors
   * @returns A CloudWatch Metric configured for browser user errors
   */
  public metricUserErrorsForApiOperation(operation: string, props?: MetricOptions): Metric {
    return this.metricForApiOperation('UserErrors', operation, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking browser session duration.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: Duration
   * @returns A CloudWatch Metric configured for browser session duration
   */
  public metricSessionDuration(props?: MetricOptions): Metric {
    return this.metric('Duration', { Operation: 'BrowserSession' }, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking browser user takeovers.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: TakeOverCount
   * @returns A CloudWatch Metric configured for browser user takeovers
   */
  public metricTakeOverCount(props?: MetricOptions): Metric {
    return this.metric('TakeOverCount', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking browser user takeovers released.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: TakeOverReleaseCount
   * @returns A CloudWatch Metric configured for browser user takeovers released
   */
  public metricTakeOverReleaseCount(props?: MetricOptions): Metric {
    return this.metric('TakeOverReleaseCount', {}, { statistic: Stats.SUM, ...props });
  }

  /**
   * Creates a CloudWatch metric for tracking browser user takeovers duration.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock-AgentCore'
   * - metricName: TakeOverDuration
   * @returns A CloudWatch Metric configured for browser user takeovers duration
   */
  public metricTakeOverDuration(props?: MetricOptions): Metric {
    return this.metric('TakeOverDuration', {}, { statistic: Stats.AVERAGE, ...props });
  }

  /**
   * Internal method to create a metric.
   *
   * @param props - Configuration options for the metric
   * @returns A CloudWatch Metric configured for browser api operations
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
 * Network configuration for browser
 */
export interface BrowserNetworkConfiguration {
  /**
   * Network modes supported by browser
   */
  readonly networkMode: BrowserNetworkMode;
}

/******************************************************************************
 *                                Recording Configuration
 *****************************************************************************/

/**
 * Recording configuration for browser
 */
export interface RecordingConfig {
  /**
   * Whether recording is enabled
   * @default - false
   */
  readonly enabled?: boolean;

  /**
   * S3 Location Configuration
   * @default - undefined
   */
  readonly s3Location?: Location;
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a Browser resource
 */
export interface BrowserCustomProps {
  /**
   * The name of the browser
   * Valid characters are a-z, A-Z, 0-9, _ (underscore)
   * The name must start with a letter and can be up to 48 characters long
   * Pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
   * @required - Yes
   */
  readonly browserCustomName: string;

  /**
   * Optional description for the browser
   * Valid characters are a-z, A-Z, 0-9, _ (underscore), - (hyphen) and spaces
   * The description can have up to 200 characters
   * @default - No description
   * @required - No
   */
  readonly description?: string;

  /**
   * Network configuration for browser
   * @required - No
   * @default - PUBLIC network mode
   */
  readonly networkConfiguration?: BrowserNetworkConfiguration;

  /**
   * Recording configuration for browser
   * @required - No
   * @default - No recording configuration
   */
  readonly recordingConfig?: RecordingConfig;

  /**
   * The IAM role that provides permissions for the browser to access AWS services
   * @default - A new role will be created
   * @required - No
   */
  readonly executionRole?: iam.IRole;

  /**
   * Tags (optional)
   * A list of key:value pairs of tags to apply to this Browser resource
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
 * Browser resource for AWS Bedrock Agent Core.
 * Provides a browser environment for web automation and interaction.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/browser.html
 * @resource AWS::BedrockAgentCore::BrowserCustom
 */
export class BrowserCustom extends BrowserCustomBase {
  public readonly browserArn: string;
  public readonly browserId: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly networkConfiguration: BrowserNetworkConfiguration;
  public readonly recordingConfig?: RecordingConfig;
  public readonly lastUpdatedAt?: string;
  public readonly status?: string;
  public readonly createdAt?: string;
  public readonly executionRole?: iam.IRole;
  /**
   * Tags applied to this browser resource
   * A map of key-value pairs for resource tagging
   * @default - No tags applied
   */
  public readonly tags?: { [key: string]: string };

  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  private readonly __resource: agent_core.CfnBrowserCustom;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: BrowserCustomProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.name = props.browserCustomName;
    this.description = props.description;
    this.networkConfiguration = props.networkConfiguration ?? { networkMode: BrowserNetworkMode.PUBLIC };
    this.recordingConfig = props.recordingConfig;
    this.executionRole = props.executionRole ?? this._createBrowserRole();
    this.tags = props.tags;

    // Validate browser name
    throwIfInvalid(this._validateBrowserName, this.name);

    // Validate browser tags
    throwIfInvalid(this._validateBrowserTags, this.tags);

    // Validate recording configuration
    throwIfInvalid(this._validateRecordingConfig, this.recordingConfig);

    // if recording is configured, add permissions to the execution role
    if (this.recordingConfig && this.recordingConfig.s3Location) {
      const bucket = s3.Bucket.fromBucketName(
        this,
        `${this.name}RecordingBucket`,
        this.recordingConfig.s3Location.bucketName,
      );
      bucket.grantReadWrite(this.executionRole);
    }

    // ------------------------------------------------------
    // CFN Props - With Lazy support
    // ------------------------------------------------------
    const cfnProps: agent_core.CfnBrowserCustomProps = {
      name: this.name,
      description: this.description,
      networkConfiguration: this._renderNetworkConfiguration(),
      recordingConfig: this._renderRecordingConfig(),
      executionRoleArn: this.executionRole?.roleArn,
      tags: this.tags,
    };

    // L1 instantiation
    this.__resource = new agent_core.CfnBrowserCustom(this, 'Resource', cfnProps);

    // Get attributes directly from the CloudFormation resource
    this.browserId = this.__resource.attrBrowserId;
    this.browserArn = this.__resource.attrBrowserArn;
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
   * @returns BrowserNetworkConfigurationProperty object in CloudFormation format
   * @default - Network mode is PUBLIC
   * @internal This is an internal core function and should not be called directly.
   */
  private _renderNetworkConfiguration(): agent_core.CfnBrowserCustom.BrowserNetworkConfigurationProperty {
    return {
      networkMode: this.networkConfiguration.networkMode,
    };
  }

  /**
   * Render the recording configuration.
   *
   * @returns RecordingConfigProperty object in CloudFormation format, or undefined if no recording configuration is defined
   * @default - undefined if no recording configuration is provided
   * @internal This is an internal core function and should not be called directly.
   */
  private _renderRecordingConfig(): agent_core.CfnBrowserCustom.RecordingConfigProperty | undefined {
    return this.recordingConfig ? {
      enabled: this.recordingConfig.enabled,
      s3Location: this.recordingConfig.s3Location ? {
        bucket: this.recordingConfig.s3Location.bucketName,
        prefix: this.recordingConfig.s3Location.objectKey,
      } : undefined,
    } : undefined;
  }

  /**
   * Creates execution role needed for the browser to access AWS services
   * @returns The created role
   * @internal This is an internal core function and should not be called directly.
   */
  private _createBrowserRole(): iam.IRole {
    const role = new iam.Role(this, 'ServiceRole', {
      assumedBy: new iam.ServicePrincipal('bedrock-agentcore.amazonaws.com'),
    });

    return role;
  }

  // ------------------------------------------------------
  // Validators
  // ------------------------------------------------------
  /**
   * Validates the browser name format
   * @param name The browser name to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateBrowserName = (name: string): string[] => {
    let errors: string[] = [];

    errors.push(...validateStringFieldLength({
      value: name,
      fieldName: 'Browser name',
      minLength: BROWSER_NAME_MIN_LENGTH,
      maxLength: BROWSER_NAME_MAX_LENGTH,
    }));

    // Check if name matches the AWS API pattern: [a-zA-Z][a-zA-Z0-9_]{0,47}
    // Must start with a letter, followed by up to 47 letters, numbers, or underscores
    const validNamePattern = /^[a-zA-Z][a-zA-Z0-9_]{0,47}$/;
    errors.push(...validateFieldPattern(name, 'Browser name', validNamePattern));

    return errors;
  };

  /**
   * Validates the browser tags format
   * @param tags The tags object to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateBrowserTags = (tags?: { [key: string]: string }): string[] => {
    let errors: string[] = [];
    if (!tags) {
      return errors; // Tags are optional
    }

    // Validate each tag key and value
    for (const [key, value] of Object.entries(tags)) {
      errors.push(...validateStringFieldLength({
        value: key,
        fieldName: 'Tag key',
        minLength: BROWSER_TAG_MIN_LENGTH,
        maxLength: BROWSER_TAG_MAX_LENGTH,
      }));

      // Validate tag key pattern: ^[a-zA-Z0-9\s._:/=+@-]*$
      const validKeyPattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;
      errors.push(...validateFieldPattern(key, 'Tag key', validKeyPattern));

      // Validate tag value
      errors.push(...validateStringFieldLength({
        value: value,
        fieldName: 'Tag value',
        minLength: BROWSER_TAG_MIN_LENGTH,
        maxLength: BROWSER_TAG_MAX_LENGTH,
      }));

      // Validate tag value pattern: ^[a-zA-Z0-9\s._:/=+@-]*$
      const validValuePattern = /^[a-zA-Z0-9\s._:/=+@-]*$/;
      errors.push(...validateFieldPattern(value, 'Tag value', validValuePattern));
    }

    return errors;
  };

  /**
   * Validates the recording configuration
   * @param recordingConfig The recording configuration to validate
   * @returns Array of validation error messages, empty if valid
   */
  private _validateRecordingConfig = (recordingConfig?: RecordingConfig): string[] => {
    let errors: string[] = [];
    if (!recordingConfig || !recordingConfig.enabled || !recordingConfig.s3Location) {
      return errors; // No validation needed if no S3 location is provided or recording is disabled
    }

    const s3Location = recordingConfig.s3Location;

    // Both bucket name and object key are required when S3 location is provided
    if (!s3Location.bucketName) {
      errors.push('S3 bucket name is required when S3 location is provided for recording configuration');
    }

    if (!s3Location.objectKey) {
      errors.push('S3 object key (prefix) is required when S3 location is provided for recording configuration');
    }

    // Validate bucket name pattern: ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$
    const bucketNamePattern = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;
    errors.push(...validateFieldPattern(s3Location.bucketName, 'S3 bucket name', bucketNamePattern));

    return errors;
  };
}
