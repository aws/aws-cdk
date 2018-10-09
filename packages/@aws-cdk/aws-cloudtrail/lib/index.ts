import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import logs = require('@aws-cdk/aws-logs');
import s3 = require('@aws-cdk/aws-s3');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './cloudtrail.generated';

// AWS::CloudTrail CloudFormation Resources:
export * from './cloudtrail.generated';

export interface CloudTrailProps {
  /**
   * For most services, events are recorded in the region where the action occurred.
   * For global services such as AWS Identity and Access Management (IAM), AWS STS, Amazon CloudFront, and Route 53,
   * events are delivered to any trail that includes global services, and are logged as occurring in US East (N. Virginia) Region.
   * @default true
   */
  includeGlobalServiceEvents?: boolean;

  /**
   * Whether or not this trail delivers log files from multiple regions to a single S3 bucket for a single account.
   * @default true
   */
  isMultiRegionTrail?: boolean;

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
   * If managementEvents is undefined, we'll not log management events by default.
   * @param managementEvents the management configuration type to log
   */
  managementEvents?: ReadWriteType;

  /**
   * To determine whether a log file was modified, deleted, or unchanged after CloudTrail delivered it,
   * you can use CloudTrail log file integrity validation.
   * This feature is built using industry standard algorithms: SHA-256 for hashing and SHA-256 with RSA for digital signing.
   * This makes it computationally infeasible to modify, delete or forge CloudTrail log files without detection.
   * You can use the AWS CLI to validate the files in the location where CloudTrail delivered them.
   * @default true
   */
  enableFileValidation?: boolean;

  /**
   * If CloudTrail pushes logs to CloudWatch Logs in addition to S3.
   * Disabled for cost out of the box.
   * @default false
   */
  sendToCloudWatchLogs?: boolean;

  /**
   * How long to retain logs in CloudWatchLogs. Ignored if sendToCloudWatchLogs is false
   *  @default LogRetention.OneYear
   */
  cloudWatchLogsRetentionTimeDays?: LogRetention;

  /** The AWS Key Management Service (AWS KMS) key ID that you want to use to encrypt CloudTrail logs.
   * @default none
   */
  kmsKey?: kms.EncryptionKeyRef;

  /** The name of an Amazon SNS topic that is notified when new log files are published.
   * @default none
   */
  snsTopic?: string; // TODO: fix to use L2 SNS

  /**
   * The name of the trail. We recoomend customers do not set an explicit name.
   * @default the CloudFormation generated neme
   */
  trailName?: string;

  /** An Amazon S3 object key prefix that precedes the name of all log files.
   * @default none
   */
  s3KeyPrefix?: string;
}

export enum ReadWriteType {
  ReadOnly = "ReadOnly",
  WriteOnly = "WriteOnly",
  All = "All"
}

// TODO: This belongs in a CWL L2
export enum LogRetention {
  OneDay = 1,
  ThreeDays = 3,
  FiveDays = 5,
  OneWeek = 7,
  TwoWeeks =  14,
  OneMonth = 30,
  TwoMonths = 60,
  ThreeMonths = 90,
  FourMonths = 120,
  FiveMonths = 150,
  HalfYear = 180,
  OneYear = 365,
  FourHundredDays = 400,
  EighteenMonths = 545,
  TwoYears = 731,
  FiveYears = 1827,
  TenYears = 3653
}
/**
 * Cloud trail allows you to log events that happen in your AWS account
 * For example:
 *
 * import { CloudTrail } from '@aws-cdk/aws-cloudtrail'
 *
 * const cloudTrail = new CloudTrail(this, 'MyTrail');
 *
 */
export class CloudTrail extends cdk.Construct {

  public readonly cloudTrailArn: string;
  private readonly cloudWatchLogsRoleArn?: string;
  private readonly cloudWatchLogsGroupArn?: string;
  private eventSelectors: EventSelector[] = [];

  constructor(parent: cdk.Construct, name: string, props: CloudTrailProps = {}) {
    super(parent, name);

    const s3bucket = new s3.Bucket(this, 'S3', {encryption: s3.BucketEncryption.Unencrypted});
    const cloudTrailPrincipal = "cloudtrail.amazonaws.com";

    s3bucket.addToResourcePolicy(new cdk.PolicyStatement()
      .addResource(s3bucket.bucketArn)
      .addActions('s3:GetBucketAcl')
      .addServicePrincipal(cloudTrailPrincipal));

    s3bucket.addToResourcePolicy(new cdk.PolicyStatement()
      .addResource(s3bucket.arnForObjects(new cdk.FnConcat('/AWSLogs/', new cdk.AwsAccountId())))
      .addActions("s3:PutObject")
      .addServicePrincipal(cloudTrailPrincipal)
      .setCondition("StringEquals", {'s3:x-amz-acl': "bucket-owner-full-control"}));

    if (props.sendToCloudWatchLogs) {
      const logGroup = new logs.cloudformation.LogGroupResource(this, "LogGroup", {
        retentionInDays: props.cloudWatchLogsRetentionTimeDays || LogRetention.OneYear
      });
      this.cloudWatchLogsGroupArn = logGroup.logGroupArn;

      const logsRole = new iam.Role(this, 'LogsRole', {assumedBy: new cdk.ServicePrincipal(cloudTrailPrincipal) });

      const streamArn = `${this.cloudWatchLogsRoleArn}:log-stream:*`;
      logsRole.addToPolicy(new cdk.PolicyStatement()
        .addActions("logs:PutLogEvents", "logs:CreateLogStream")
        .addResource(streamArn));
      this.cloudWatchLogsRoleArn = logsRole.roleArn;

    }
    if (props.managementEvents) {
      const managementEvent =  {
        includeManagementEvents: true,
        readWriteType: props.managementEvents
      };
      this.eventSelectors.push(managementEvent);
    }

    // TODO: not all regions support validation. Use service configuration data to fail gracefully
    const trail = new cloudformation.TrailResource(this, 'Resource', {
      isLogging: true,
      enableLogFileValidation: props.enableFileValidation == null ? true : props.enableFileValidation,
      isMultiRegionTrail: props.isMultiRegionTrail == null ? true : props.isMultiRegionTrail,
      includeGlobalServiceEvents: props.includeGlobalServiceEvents == null ? true : props.includeGlobalServiceEvents,
      trailName: props.trailName,
      kmsKeyId:  props.kmsKey && props.kmsKey.keyArn,
      s3BucketName: s3bucket.bucketName,
      s3KeyPrefix: props.s3KeyPrefix,
      cloudWatchLogsLogGroupArn: this.cloudWatchLogsGroupArn,
      cloudWatchLogsRoleArn: this.cloudWatchLogsRoleArn,
      snsTopicName: props.snsTopic,
      eventSelectors: this.eventSelectors
    });
    this.cloudTrailArn = trail.trailArn;
  }

  /**
   * When an event occurs in your account, CloudTrail evaluates whether the event matches the settings for your trails.
   * Only events that match your trail settings are delivered to your Amazon S3 bucket and Amazon CloudWatch Logs log group.
   *
   * This method adds an S3 Data Event Selector for filtering events that match S3 operations.
   *
   * Data events: These events provide insight into the resource operations performed on or within a resource.
   * These are also known as data plane operations.
   * @param readWriteType the configuration type to log for this data event
   * Eg, ReadWriteType.ReadOnly will only log "read" events for S3 objects that match a filter)
   */
  public addS3EventSelector(prefixes: string[], readWriteType: ReadWriteType) {
    if (prefixes.length > 250) {
      throw new Error("A maximum of 250 data elements can be in one event selector");
    }
    if (this.eventSelectors.length > 5) {
      throw new Error("A maximum of 5 event selectors are supported per trail.");
    }
    this.eventSelectors.push({
      includeManagementEvents: false,
      readWriteType,
      dataResources: [{
        type: "AWS::S3::Object",
        values: prefixes
      }]
    });
  }
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
