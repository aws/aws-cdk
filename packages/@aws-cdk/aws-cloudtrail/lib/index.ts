import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import { Construct, Resource, Stack } from '@aws-cdk/core';
import { CfnTrail } from './cloudtrail.generated';

// AWS::CloudTrail CloudFormation Resources:
export * from './cloudtrail.generated';

export interface TrailProps {
  /**
   * For most services, events are recorded in the region where the action occurred.
   * For global services such as AWS Identity and Access Management (IAM), AWS STS, Amazon CloudFront, and Route 53,
   * events are delivered to any trail that includes global services, and are logged as occurring in US East (N. Virginia) Region.
   *
   * @default true
   */
  readonly includeGlobalServiceEvents?: boolean;

  /**
   * Whether or not this trail delivers log files from multiple regions to a single S3 bucket for a single account.
   *
   * @default true
   */
  readonly isMultiRegionTrail?: boolean;

  /**
   * When an event occurs in your account, CloudTrail evaluates whether the event matches the settings for your trails.
   * Only events that match your trail settings are delivered to your Amazon S3 bucket and Amazon CloudWatch Logs log group.
   *
   * This method sets the management configuration for this trail.
   *
   * Management events provide insight into management operations that are performed on resources in your AWS account.
   * These are also known as control plane operations.
   * Management events can also include non-API events that occur in your account.
   * For example, when a user logs in to your account, CloudTrail logs the ConsoleLogin event.
   *
   * @param managementEvents the management configuration type to log
   *
   * @default - Management events will not be logged.
   */
  readonly managementEvents?: ReadWriteType;

  /**
   * To determine whether a log file was modified, deleted, or unchanged after CloudTrail delivered it,
   * you can use CloudTrail log file integrity validation.
   * This feature is built using industry standard algorithms: SHA-256 for hashing and SHA-256 with RSA for digital signing.
   * This makes it computationally infeasible to modify, delete or forge CloudTrail log files without detection.
   * You can use the AWS CLI to validate the files in the location where CloudTrail delivered them.
   *
   * @default true
   */
  readonly enableFileValidation?: boolean;

  /**
   * If CloudTrail pushes logs to CloudWatch Logs in addition to S3.
   * Disabled for cost out of the box.
   *
   * @default false
   */
  readonly sendToCloudWatchLogs?: boolean;

  /**
   * How long to retain logs in CloudWatchLogs. Ignored if sendToCloudWatchLogs is false
   *
   *  @default logs.RetentionDays.OneYear
   */
  readonly cloudWatchLogsRetention?: logs.RetentionDays;

  /** The AWS Key Management Service (AWS KMS) key ID that you want to use to encrypt CloudTrail logs.
   *
   * @default - No encryption.
   */
  readonly kmsKey?: kms.IKey;

  /** The name of an Amazon SNS topic that is notified when new log files are published.
   *
   * @default - No notifications.
   */
  readonly snsTopic?: string; // TODO: fix to use L2 SNS

  /**
   * The name of the trail. We recoomend customers do not set an explicit name.
   *
   * @default - AWS CloudFormation generated name.
   */
  readonly trailName?: string;

  /** An Amazon S3 object key prefix that precedes the name of all log files.
   *
   * @default - No prefix.
   */
  readonly s3KeyPrefix?: string;

  /** The Amazon S3 bucket
   *
   * @default - if not supplied a bucket will be created with all the correct permisions
   */
  readonly bucket?: s3.IBucket
}

export enum ReadWriteType {
  READ_ONLY = "ReadOnly",
  WRITE_ONLY = "WriteOnly",
  ALL = "All"
}

/**
 * Cloud trail allows you to log events that happen in your AWS account
 * For example:
 *
 * import { CloudTrail } from '@aws-cdk/aws-cloudtrail'
 *
 * const cloudTrail = new CloudTrail(this, 'MyTrail');
 *
 * NOTE the above example creates an UNENCRYPTED bucket by default,
 * If you are required to use an Encrypted bucket you can supply a preconfigured bucket
 * via TrailProps
 *
 */
export class Trail extends Resource {

  /**
   * @attribute
   */
  public readonly trailArn: string;

  /**
   * @attribute
   */
  public readonly trailSnsTopicArn: string;

  private s3bucket: s3.IBucket;
  private eventSelectors: EventSelector[] = [];

  constructor(scope: Construct, id: string, props: TrailProps = {}) {
    super(scope, id, {
      physicalName: props.trailName,
    });

    const cloudTrailPrincipal = new iam.ServicePrincipal("cloudtrail.amazonaws.com");

    this.s3bucket = props.bucket || new s3.Bucket(this, 'S3', {encryption: s3.BucketEncryption.UNENCRYPTED});

    this.s3bucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: [this.s3bucket.bucketArn],
        actions: ['s3:GetBucketAcl'],
        principals: [cloudTrailPrincipal],
      }));

    this.s3bucket.addToResourcePolicy(new iam.PolicyStatement({
        resources: [this.s3bucket.arnForObjects(`AWSLogs/${Stack.of(this).account}/*`)],
        actions: ["s3:PutObject"],
        principals: [cloudTrailPrincipal],
        conditions:  {
          StringEquals: {'s3:x-amz-acl': "bucket-owner-full-control"}
        }
      }));

    let logGroup: logs.CfnLogGroup | undefined;
    let logsRole: iam.IRole | undefined;

    if (props.sendToCloudWatchLogs) {
      logGroup = new logs.CfnLogGroup(this, "LogGroup", {
        retentionInDays: props.cloudWatchLogsRetention || logs.RetentionDays.ONE_YEAR
      });

      logsRole = new iam.Role(this, 'LogsRole', { assumedBy: cloudTrailPrincipal });

      logsRole.addToPolicy(new iam.PolicyStatement({
        actions: ["logs:PutLogEvents", "logs:CreateLogStream"],
        resources: [logGroup.attrArn],
      }));
    }

    if (props.managementEvents) {
      const managementEvent =  {
        includeManagementEvents: true,
        readWriteType: props.managementEvents
      };
      this.eventSelectors.push(managementEvent);
    }

    // TODO: not all regions support validation. Use service configuration data to fail gracefully
    const trail = new CfnTrail(this, 'Resource', {
      isLogging: true,
      enableLogFileValidation: props.enableFileValidation == null ? true : props.enableFileValidation,
      isMultiRegionTrail: props.isMultiRegionTrail == null ? true : props.isMultiRegionTrail,
      includeGlobalServiceEvents: props.includeGlobalServiceEvents == null ? true : props.includeGlobalServiceEvents,
      trailName: this.physicalName,
      kmsKeyId:  props.kmsKey && props.kmsKey.keyArn,
      s3BucketName: this.s3bucket.bucketName,
      s3KeyPrefix: props.s3KeyPrefix,
      cloudWatchLogsLogGroupArn: logGroup && logGroup.attrArn,
      cloudWatchLogsRoleArn: logsRole && logsRole.roleArn,
      snsTopicName: props.snsTopic,
      eventSelectors: this.eventSelectors
    });

    this.trailArn = this.getResourceArnAttribute(trail.attrArn, {
      service: 'cloudtrail',
      resource: 'trail',
      resourceName: this.physicalName,
    });
    this.trailSnsTopicArn = trail.attrSnsTopicArn;

    // Add a dependency on the bucket policy being updated, CloudTrail will test this upon creation.
    if (this.s3bucket.policy) {
      trail.node.addDependency(this.s3bucket.policy);
    }

    // If props.sendToCloudWatchLogs is set to true then the trail needs to depend on the created logsRole
    // so that it can create the log stream for the log group. This ensures the logsRole is created and propagated
    // before the trail tries to create the log stream.
    if (logsRole !== undefined) {
      trail.node.addDependency(logsRole);
    }
  }

  /**
   * When an event occurs in your account, CloudTrail evaluates whether the event matches the settings for your trails.
   * Only events that match your trail settings are delivered to your Amazon S3 bucket and Amazon CloudWatch Logs log group.
   *
   * This method adds an S3 Data Event Selector for filtering events that match S3 operations.
   *
   * Data events: These events provide insight into the resource operations performed on or within a resource.
   * These are also known as data plane operations.
   *
   * @param prefixes the list of object ARN prefixes to include in logging (maximum 250 entries).
   * @param options the options to configure logging of management and data events.
   */
  public addS3EventSelector(prefixes: string[], options: AddS3EventSelectorOptions = {}) {
    if (prefixes.length > 250) {
      throw new Error("A maximum of 250 data elements can be in one event selector");
    }
    if (this.eventSelectors.length > 5) {
      throw new Error("A maximum of 5 event selectors are supported per trail.");
    }
    this.eventSelectors.push({
      includeManagementEvents: options.includeManagementEvents,
      readWriteType: options.readWriteType,
      dataResources: [{
        type: "AWS::S3::Object",
        values: prefixes
      }]
    });
  }

  /**
   * Create an event rule for when an event is recorded by any Trail in the account.
   *
   * Note that the event doesn't necessarily have to come from this Trail, it can
   * be captured from any one.
   *
   * Be sure to filter the event further down using an event pattern.
   */
  public onCloudTrailEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      detailType: ['AWS API Call via CloudTrail']
    });
    return rule;
  }
}

/**
 * Options for adding an S3 event selector.
 */
export interface AddS3EventSelectorOptions {
  /**
   * Specifies whether to log read-only events, write-only events, or all events.
   *
   * @default ReadWriteType.All
   */
  readonly readWriteType?: ReadWriteType;

  /**
   * Specifies whether the event selector includes management events for the trail.
   *
   * @default true
   */
  readonly includeManagementEvents?: boolean;
}

interface EventSelector {
  readonly includeManagementEvents?: boolean;
  readonly readWriteType?: ReadWriteType;
  readonly dataResources?: EventSelectorData[];
}

interface EventSelectorData {
  readonly type: string;
  readonly values: string[];
}
