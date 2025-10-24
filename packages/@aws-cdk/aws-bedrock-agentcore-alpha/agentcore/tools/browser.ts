import {
  Arn,
  ArnFormat,
  IResource,
  Lazy,
  Resource,
  Token,
  Stack,
} from 'aws-cdk-lib';
import {
  DimensionsMap,
  Metric,
  MetricOptions,
  MetricProps,
  Stats,
} from 'aws-cdk-lib/aws-cloudwatch';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as agent_core from 'aws-cdk-lib/aws-bedrockagentcore';
import { Location } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
// Internal Libs
import * as perms from './perms';
import { validateFieldPattern, validateStringFieldLength, throwIfInvalid } from './validation-helpers';
import { BrowserNetworkConfiguration } from '../network/network-configuration';

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
 *                                Interface
 *****************************************************************************/
/**
 * Interface for Browser resources
 */
export interface IBrowserCustom extends IResource, iam.IGrantable, ec2.IConnectable {
  /**
   * The ARN of the browser resource
   * @attribute
   */
  readonly browserArn: string;

  /**
   * The id of the browser
   * @attribute
   */
  readonly browserId: string;

  /**
   * The IAM role that provides permissions for the browser to access AWS services
   */
  readonly executionRole: iam.IRole;

  /**
   * Timestamp when the browser was last updated
   * @attribute
   */
  readonly lastUpdatedAt?: string;

  /**
   * The status of the browser
   * @attribute
   */
  readonly status?: string;

  /**
   * Timestamp when the browser was created
   * @attribute
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
  public abstract readonly lastUpdatedAt?: string;
  public abstract readonly status?: string;
  public abstract readonly createdAt?: string;
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
      resourceArns: [this.browserArn],
      actions: actions,
    });
  }

  /**
   * Grant read permissions on this browser to an IAM principal.
   * This includes both read permissions on the specific browser and list permissions on all browsers.
   *
   * @param grantee - The IAM principal to grant read permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock-agentcore:GetBrowser', 'bedrock-agentcore:GetBrowserSession'] on this.browserArn
   * - actions: ['bedrock-agentcore:ListBrowsers', 'bedrock-agentcore:ListBrowserSessions'] on all resources (*)
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    const resourceSpecificGrant = this.grant(
      grantee,
      ...perms.BROWSER_READ_PERMS,
    );

    const allResourceGrant = iam.Grant.addToPrincipal({
      grantee: grantee,
      resourceArns: ['*'],
      actions: perms.BROWSER_LIST_PERMS,
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
      ...perms.BROWSER_USE_PERMS,
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
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes for specifying an imported Browser Custom.
 */
export interface BrowserCustomAttributes {
  /**
   * The ARN of the agent.
   * @attribute
   */
  readonly browserArn: string;
  /**
   * The ARN of the IAM role associated to the browser.
   * @attribute
   */
  readonly roleArn: string;
  /**
   * When this browser was last updated.
   * @default undefined - No last updated timestamp is provided
   */
  readonly lastUpdatedAt?: string;
  /**
   * The status of the browser.
   * @default undefined - No status is provided
   */
  readonly status?: string;
  /**
   * The created timestamp of the browser.
   * @default undefined - No created timestamp is provided
   */
  readonly createdAt?: string;
  /**
   * The security groups for this browser, if in a VPC.
   *
   * @default - By default, the browser is not in a VPC.
   */
  readonly securityGroups?: ec2.ISecurityGroup[];
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
@propertyInjectable
export class BrowserCustom extends BrowserCustomBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-agentcore-alpha.BrowserCustom';

  /**
   * Static Method for importing an existing Bedrock AgentCore Browser Custom.
   */
  /**
   * Creates an Browser Custom reference from an existing browser's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing browser custom
   * @returns An IBrowserCustom reference to the existing browser
   */
  public static fromBrowserCustomAttributes(scope: Construct, id: string, attrs: BrowserCustomAttributes): IBrowserCustom {
    class Import extends BrowserCustomBase {
      public readonly browserArn = attrs.browserArn;
      public readonly browserId = Arn.split(attrs.browserArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
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

    // Return new Browser Custom
    return new Import(scope, id);
  }
  // ------------------------------------------------------
  // Attributes
  // ------------------------------------------------------
  /**
   * The ARN of the browser resource.
   * @attribute
   */
  public readonly browserArn: string;
  /**
   * The id of the browser
   * @attribute
   */
  public readonly browserId: string;
  /**
   * The name of the browser
   */
  public readonly name: string;
  /**
   * The description of the browser
   */
  public readonly description?: string;
  /**
   * The last updated timestamp of the browser
   * @attribute
   */
  public readonly lastUpdatedAt?: string;
  /**
   * The status of the browser
   * @attribute
   */
  public readonly status?: string;
  /**
   * The created timestamp of the browser
   * @attribute
   */
  public readonly createdAt?: string;
  /**
   * The failure reason of the browser
   * @attribute
   */
  public readonly failureReason?: string;
  /**
   * The IAM role associated to the browser.
   */
  public readonly executionRole: iam.IRole;
  /**
   * Tags applied to this browser resource
   * A map of key-value pairs for resource tagging
   * @default - No tags applied
   */
  public readonly tags?: { [key: string]: string };
  /**
   * The principal to grant permissions to
   */
  public readonly grantPrincipal: iam.IPrincipal;
  /**
   * The network configuration of the browser
   */
  public readonly networkConfiguration: BrowserNetworkConfiguration;
  /**
   * The recording configuration of the browser
   */
  public readonly recordingConfig?: RecordingConfig;

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
    this.networkConfiguration = props.networkConfiguration ?? BrowserNetworkConfiguration.usingPublicNetwork();
    this.recordingConfig = props.recordingConfig ?? { enabled: false };
    this.executionRole = props.executionRole ?? this._createBrowserRole();
    this.grantPrincipal = this.executionRole;
    this.tags = props.tags;

    // Validate browser name
    throwIfInvalid(this._validateBrowserName, this.name);

    // Validate browser tags
    throwIfInvalid(this._validateBrowserTags, this.tags);

    // Validate recording configuration
    throwIfInvalid(this._validateRecordingConfig, this.recordingConfig);

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
    const cfnProps: agent_core.CfnBrowserCustomProps = {
      name: this.name,
      description: this.description,
      networkConfiguration: Lazy.any({ produce: () => this.networkConfiguration._render(this._connections) }),
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
    this.failureReason = this.__resource.attrFailureReason;

    // if recording is configured, add permissions to the execution role
    if (this.recordingConfig && this.recordingConfig.s3Location) {
      if (!Token.isUnresolved(this.recordingConfig.s3Location.bucketName)) {
        Stack.of(this).resolve(this.recordingConfig.s3Location.bucketName);
      }
      const bucket = s3.Bucket.fromBucketName(
        this,
        `${this.name}RecordingBucket`,
        this.recordingConfig.s3Location.bucketName,
      );
      // Ensure the policy is applied before the browser resource is created
      const grant = bucket.grantReadWrite(this.executionRole);
      grant.applyBefore(this.__resource);
    }
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
    if (!recordingConfig) {
      return errors; // No validation needed if no recording config is provided
    }

    const s3Location = recordingConfig.s3Location;

    // Only validate S3 location if it's actually provided
    if (s3Location) {
      // Both bucket name and object key are required when S3 location is provided
      if (!s3Location.bucketName) {
        errors.push('S3 bucket name is required when S3 location is provided for recording configuration');
      } else {
        // Validate bucket name pattern: ^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$
        const bucketNamePattern = /^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;
        errors.push(...validateFieldPattern(s3Location.bucketName, 'S3 bucket name', bucketNamePattern));
      }

      if (!s3Location.objectKey) {
        errors.push('S3 object key (prefix) is required when S3 location is provided for recording configuration');
      }
    }

    return errors;
  };
}
