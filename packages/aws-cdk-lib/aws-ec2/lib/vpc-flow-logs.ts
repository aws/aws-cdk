import { Construct } from 'constructs';
import { CfnFlowLog } from './ec2.generated';
import { ISubnet, IVpc } from './vpc';
import * as iam from '../../aws-iam';
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import { IResource, PhysicalName, RemovalPolicy, Resource, FeatureFlags, Stack, Tags, CfnResource } from '../../core';
import { S3_CREATE_DEFAULT_LOGGING_POLICY } from '../../cx-api';

/**
 * Name tag constant
 */
const NAME_TAG: string = 'Name';

/**
 * A FlowLog
 */
export interface IFlowLog extends IResource {
  /**
   * The Id of the VPC Flow Log
   *
   * @attribute
   */
  readonly flowLogId: string;
}

/**
 * The type of VPC traffic to log
 */
export enum FlowLogTrafficType {
  /**
   * Only log accepts
   */
  ACCEPT = 'ACCEPT',

  /**
   * Log all requests
   */
  ALL = 'ALL',

  /**
   * Only log rejects
   */
  REJECT = 'REJECT'
}

/**
 * The available destination types for Flow Logs
 */
export enum FlowLogDestinationType {
  /**
   * Send flow logs to CloudWatch Logs Group
   */
  CLOUD_WATCH_LOGS = 'cloud-watch-logs',

  /**
   * Send flow logs to S3 Bucket
   */
  S3 = 's3',

  /**
   * Send flow logs to Kinesis Data Firehose
   */
  KINESIS_DATA_FIREHOSE = 'kinesis-data-firehose',
}

/**
 * The type of resource to create the flow log for
 */
export abstract class FlowLogResourceType {
  /**
   * The subnet to attach the Flow Log to
   */
  public static fromSubnet(subnet: ISubnet): FlowLogResourceType {
    return {
      resourceType: 'Subnet',
      resourceId: subnet.subnetId,
    };
  }

  /**
   * The VPC to attach the Flow Log to
   */
  public static fromVpc(vpc: IVpc): FlowLogResourceType {
    return {
      resourceType: 'VPC',
      resourceId: vpc.vpcId,
    };
  }

  /**
   * The Network Interface to attach the Flow Log to
   */
  public static fromNetworkInterfaceId(id: string): FlowLogResourceType {
    return {
      resourceType: 'NetworkInterface',
      resourceId: id,
    };
  }

  /**
   * The Transit Gateway to attach the Flow Log to
   */
  public static fromTransitGatewayId(id: string): FlowLogResourceType {
    return {
      resourceType: 'TransitGateway',
      resourceId: id,
    };
  };

  /**
   * The Transit Gateway Attachment to attach the Flow Log to
   */
  public static fromTransitGatewayAttachmentId(id: string): FlowLogResourceType {
    return {
      resourceType: 'TransitGatewayAttachment',
      resourceId: id,
    };
  };

  /**
   * The type of resource to attach a flow log to.
   */
  public abstract resourceType: string;

  /**
   * The Id of the resource that the flow log should be attached to.
   */
  public abstract resourceId: string;
}

/**
 * The file format for flow logs written to an S3 bucket destination
 */
export enum FlowLogFileFormat {
  /**
   * File will be written as plain text
   *
   * This is the default value
   */
  PLAIN_TEXT = 'plain-text',

  /**
   * File will be written in parquet format
   */
  PARQUET = 'parquet',
}

/**
 * Options for writing logs to a S3 destination
 */
export interface S3DestinationOptions {
  /**
   * Use Hive-compatible prefixes for flow logs
   * stored in Amazon S3
   *
   * @default false
   */
  readonly hiveCompatiblePartitions?: boolean;

  /**
   * The format for the flow log
   *
   * @default FlowLogFileFormat.PLAIN_TEXT
   */
  readonly fileFormat?: FlowLogFileFormat;

  /**
   * Partition the flow log per hour
   *
   * @default false
   */
  readonly perHourPartition?: boolean;
}

/**
 * Options for writing logs to a destination
 *
 * TODO: there are other destination options, currently they are
 * only for s3 destinations (not sure if that will change)
 */
export interface DestinationOptions extends S3DestinationOptions { }

/**
 * The destination type for the flow log
 */
export abstract class FlowLogDestination {
  /**
   * Use CloudWatch logs as the destination
   */
  public static toCloudWatchLogs(logGroup?: logs.ILogGroup, iamRole?: iam.IRole): FlowLogDestination {
    return new CloudWatchLogsDestination({
      logDestinationType: FlowLogDestinationType.CLOUD_WATCH_LOGS,
      logGroup,
      iamRole,
    });
  }

  /**
   * Use S3 as the destination
   *
   * @param bucket optional s3 bucket to publish logs to. If one is not provided
   * a default bucket will be created
   * @param keyPrefix optional prefix within the bucket to write logs to
   * @param options additional s3 destination options
   */
  public static toS3(bucket?: s3.IBucket, keyPrefix?: string, options?: S3DestinationOptions): FlowLogDestination {
    return new S3Destination({
      logDestinationType: FlowLogDestinationType.S3,
      s3Bucket: bucket,
      keyPrefix,
      destinationOptions: options,
    });
  }

  /**
   * Use Kinesis Data Firehose as the destination
   *
   * @param deliveryStreamArn the ARN of Kinesis Data Firehose delivery stream to publish logs to
   */
  public static toKinesisDataFirehoseDestination(deliveryStreamArn: string): FlowLogDestination {
    return new KinesisDataFirehoseDestination({
      logDestinationType: FlowLogDestinationType.KINESIS_DATA_FIREHOSE,
      deliveryStreamArn,
    });
  }

  /**
   * Generates a flow log destination configuration
   */
  public abstract bind(scope: Construct, flowLog: FlowLog): FlowLogDestinationConfig;
}

/**
 * Flow Log Destination configuration
 */
export interface FlowLogDestinationConfig {
  /**
   * The type of destination to publish the flow logs to.
   *
   * @default - CLOUD_WATCH_LOGS
   */
  readonly logDestinationType: FlowLogDestinationType;

  /**
   * The IAM Role that has access to publish to CloudWatch logs
   *
   * @default - default IAM role is created for you
   */
  readonly iamRole?: iam.IRole;

  /**
   * The CloudWatch Logs Log Group to publish the flow logs to
   *
   * @default - default log group is created for you
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * S3 bucket to publish the flow logs to
   *
   * @default - undefined
   */
  readonly s3Bucket?: s3.IBucket;

  /**
   * S3 bucket key prefix to publish the flow logs to
   *
   * @default - undefined
   */
  readonly keyPrefix?: string;

  /**
   * The ARN of Kinesis Data Firehose delivery stream to publish the flow logs to
   *
   * @default - undefined
   */
  readonly deliveryStreamArn?: string;

  /**
   * Options for writing flow logs to a supported destination
   *
   * @default - undefined
   */
  readonly destinationOptions?: DestinationOptions;
}

/**
 *
 */
class S3Destination extends FlowLogDestination {
  constructor(private readonly props: FlowLogDestinationConfig) {
    super();
  }

  public bind(scope: Construct, _flowLog: FlowLog): FlowLogDestinationConfig {
    let s3Bucket: s3.IBucket;
    if (this.props.s3Bucket === undefined) {
      s3Bucket = new s3.Bucket(scope, 'Bucket', {
        removalPolicy: RemovalPolicy.RETAIN,
      });
    } else {
      s3Bucket = this.props.s3Bucket;
    }

    // https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs-s3.html#flow-logs-s3-permissions
    if (FeatureFlags.of(scope).isEnabled(S3_CREATE_DEFAULT_LOGGING_POLICY)) {
      const stack = Stack.of(scope);
      let keyPrefix = this.props.keyPrefix ?? '';
      if (keyPrefix && !keyPrefix.endsWith('/')) {
        keyPrefix = keyPrefix + '/';
      }
      const prefix = this.props.destinationOptions?.hiveCompatiblePartitions
        ? s3Bucket.arnForObjects(`${keyPrefix}AWSLogs/aws-account-id=${stack.account}/*`)
        : s3Bucket.arnForObjects(`${keyPrefix}AWSLogs/${stack.account}/*`);

      s3Bucket.addToResourcePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.ServicePrincipal('delivery.logs.amazonaws.com'),
        ],
        resources: [
          prefix,
        ],
        actions: ['s3:PutObject'],
        conditions: {
          StringEquals: {
            's3:x-amz-acl': 'bucket-owner-full-control',
            'aws:SourceAccount': stack.account,
          },
          ArnLike: {
            'aws:SourceArn': stack.formatArn({
              service: 'logs',
              resource: '*',
            }),
          },
        },
      }));

      s3Bucket.addToResourcePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [
          new iam.ServicePrincipal('delivery.logs.amazonaws.com'),
        ],
        resources: [s3Bucket.bucketArn],
        actions: [
          's3:GetBucketAcl',
          's3:ListBucket',
        ],
        conditions: {
          StringEquals: {
            'aws:SourceAccount': stack.account,
          },
          ArnLike: {
            'aws:SourceArn': stack.formatArn({
              service: 'logs',
              resource: '*',
            }),
          },
        },
      }));
    }
    return {
      logDestinationType: FlowLogDestinationType.S3,
      s3Bucket,
      keyPrefix: this.props.keyPrefix,
      destinationOptions: (this.props.destinationOptions?.fileFormat || this.props.destinationOptions?.perHourPartition
      || this.props.destinationOptions?.hiveCompatiblePartitions)
        ? {
          fileFormat: this.props.destinationOptions.fileFormat ?? FlowLogFileFormat.PLAIN_TEXT,
          perHourPartition: this.props.destinationOptions.perHourPartition ?? false,
          hiveCompatiblePartitions: this.props.destinationOptions.hiveCompatiblePartitions ?? false,
        } : undefined,
    };
  }
}

/**
 *
 */
class CloudWatchLogsDestination extends FlowLogDestination {
  constructor(private readonly props: FlowLogDestinationConfig) {
    super();
  }

  public bind(scope: Construct, _flowLog: FlowLog): FlowLogDestinationConfig {
    let iamRole: iam.IRole;
    let logGroup: logs.ILogGroup;
    if (this.props.iamRole === undefined) {
      iamRole = new iam.Role(scope, 'IAMRole', {
        roleName: PhysicalName.GENERATE_IF_NEEDED,
        assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com'),
      });
    } else {
      iamRole = this.props.iamRole;
    }

    if (this.props.logGroup === undefined) {
      logGroup = new logs.LogGroup(scope, 'LogGroup');
    } else {
      logGroup = this.props.logGroup;
    }

    iamRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: [
          'logs:CreateLogStream',
          'logs:PutLogEvents',
          'logs:DescribeLogStreams',
        ],
        effect: iam.Effect.ALLOW,
        resources: [logGroup.logGroupArn],
      }),
    );

    iamRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['iam:PassRole'],
        effect: iam.Effect.ALLOW,
        resources: [iamRole.roleArn],
      }),
    );

    return {
      logDestinationType: FlowLogDestinationType.CLOUD_WATCH_LOGS,
      logGroup,
      iamRole,
    };
  }
}

/**
 *
 */
class KinesisDataFirehoseDestination extends FlowLogDestination {
  constructor(private readonly props: FlowLogDestinationConfig) {
    super();
  }

  public bind(_scope: Construct, _flowLog: FlowLog): FlowLogDestinationConfig {
    if (this.props.deliveryStreamArn === undefined) {
      throw new Error('deliveryStreamArn is required');
    }
    const deliveryStreamArn = this.props.deliveryStreamArn;

    return {
      logDestinationType: FlowLogDestinationType.KINESIS_DATA_FIREHOSE,
      deliveryStreamArn,
    };
  }
}

/**
 * The maximum interval of time during which a flow of packets
 * is captured and aggregated into a flow log record.
 *
 */
export enum FlowLogMaxAggregationInterval {
  /**
   * 1 minute (60 seconds)
   */
  ONE_MINUTE = 60,

  /**
   * 10 minutes (600 seconds)
   */
  TEN_MINUTES = 600,

}

/**
 * The following table describes all of the available fields for a flow log record.
 */
export class LogFormat {
  /**
   * The VPC Flow Logs version.
   */
  public static readonly VERSION = LogFormat.field('version');

  /**
   * The AWS account ID of the owner of the source network interface for which traffic is recorded.
   */
  public static readonly ACCOUNT_ID = LogFormat.field('account-id');

  /**
   * The ID of the network interface for which the traffic is recorded.
   */
  public static readonly INTERFACE_ID = LogFormat.field('interface-id');

  /**
   * The source address for incoming traffic, or the IPv4 or IPv6 address of the network interface
   * for outgoing traffic on the network interface.
   */
  public static readonly SRC_ADDR = LogFormat.field('srcaddr');

  /**
   * The destination address for outgoing traffic, or the IPv4 or IPv6 address of the network interface
   * for incoming traffic on the network interface.
   */
  public static readonly DST_ADDR = LogFormat.field('dstaddr');

  /**
   * The source port of the traffic.
   */
  public static readonly SRC_PORT = LogFormat.field('srcport');

  /**
   * The destination port of the traffic.
   */
  public static readonly DST_PORT = LogFormat.field('dstport');

  /**
   * The IANA protocol number of the traffic.
   */
  public static readonly PROTOCOL = LogFormat.field('protocol');

  /**
   * The number of packets transferred during the flow.
   */
  public static readonly PACKETS = LogFormat.field('packets');

  /**
   * The number of bytes transferred during the flow.
   */
  public static readonly BYTES = LogFormat.field('bytes');

  /**
   * The time, in Unix seconds, when the first packet of the flow was received within
   * the aggregation interval.
   *
   * This might be up to 60 seconds after the packet was transmitted or received on
   * the network interface.
   */
  public static readonly START_TIMESTAMP = LogFormat.field('start');

  /**
   * The time, in Unix seconds, when the last packet of the flow was received within
   * the aggregation interval.
   *
   * This might be up to 60 seconds after the packet was transmitted or received on
   * the network interface.
   */
  public static readonly END_TIMESTAMP = LogFormat.field('end');

  /**
   * The action that is associated with the traffic.
   */
  public static readonly ACTION = LogFormat.field('action');

  /**
   * The logging status of the flow log.
   */
  public static readonly LOG_STATUS = LogFormat.field('log-status');

  /**
   * The ID of the VPC that contains the network interface for which the traffic is recorded.
   */
  public static readonly VPC_ID = LogFormat.field('vpc-id');

  /**
   * The ID of the subnet that contains the network interface for which the traffic is recorded.
   */
  public static readonly SUBNET_ID = LogFormat.field('subnet-id');

  /**
   * The ID of the instance that's associated with network interface for which the traffic is
   * recorded, if the instance is owned by you.
   *
   * Returns a '-' symbol for a requester-managed network interface; for example, the
   * network interface for a NAT gateway
   */
  public static readonly INSTANCE_ID = LogFormat.field('instance-id');

  /**
   * The bitmask value for TCP flags.
   *
   * - FIN -- 1
   * - SYN -- 2
   * - RST -- 4
   * - SYN-ACK -- 18
   *
   * If no supported flags are recorded, the TCP flag value is 0.
   *
   * TCP flags can be OR-ed during the aggregation interval. For short connections,
   * the flags might be set on the same line in the flow log record, for example,
   * 19 for SYN-ACK and FIN, and 3 for SYN and FIN.
   */
  public static readonly TCP_FLAGS = LogFormat.field('tcp-flags');

  /**
   * The type of traffic.
   *
   * The possible values are IPv4, IPv6, or EFA.
   */
  public static readonly TRAFFIC_TYPE = LogFormat.field('type');

  /**
   * The packet-level (original) source IP address of the traffic.
   */
  public static readonly PKT_SRC_ADDR = LogFormat.field('pkt-srcaddr');

  /**
   * The packet-level (original) destination IP address for the traffic.
   */
  public static readonly PKT_DST_ADDR = LogFormat.field('pkt-dstaddr');

  /**
   * The Region that contains the network interface for which traffic is recorded.
   */
  public static readonly REGION = LogFormat.field('region');

  /**
   * The ID of the Availability Zone that contains the network interface for which traffic is recorded.
   */
  public static readonly AZ_ID = LogFormat.field('az-id');

  /**
   * The type of sublocation that's returned in the sublocation-id field.
   */
  public static readonly SUBLOCATION_TYPE = LogFormat.field('sublocation-type');

  /**
   * The ID of the sublocation that contains the network interface for which traffic is recorded.
   */
  public static readonly SUBLOCATION_ID = LogFormat.field('sublocation-id');

  /**
   * The name of the subset of IP address ranges for the pkt-srcaddr field,
   * if the source IP address is for an AWS service.
   */
  public static readonly PKT_SRC_AWS_SERVICE = LogFormat.field('pkt-src-aws-service');

  /**
   * The name of the subset of IP address ranges for the pkt-dstaddr field,
   * if the destination IP address is for an AWS service.
   */
  public static readonly PKT_DST_AWS_SERVICE = LogFormat.field('pkt-dst-aws-service');

  /**
   * The direction of the flow with respect to the interface where traffic is captured.
   */
  public static readonly FLOW_DIRECTION = LogFormat.field('flow-direction');

  /**
   * The path that egress traffic takes to the destination.
   */
  public static readonly TRAFFIC_PATH = LogFormat.field('traffic-path');

  /**
   * The default format.
   */
  public static readonly ALL_DEFAULT_FIELDS = new LogFormat('${version} ${account-id} ${interface-id} ${srcaddr} ${dstaddr} ${srcport} ${dstport} ${protocol} ${packets} ${bytes} ${start} ${end} ${action} ${log-status}');

  /**
   * A custom format string.
   *
   * Gives full control over the format string fragment.
   */
  public static custom(formatString: string): LogFormat {
    return new LogFormat(formatString);
  }

  /**
   * A custom field name.
   *
   * If there is no ready-made constant for a new field yet, you can use this.
   * The field name will automatically be wrapped in `${ ... }`.
   */
  public static field(field: string): LogFormat {
    return new LogFormat(`\${${field}}`);
  }

  protected constructor(public readonly value: string) {}
}

/**
 * Options to add a flow log to a VPC
 */
export interface FlowLogOptions {
  /**
   * The type of traffic to log. You can log traffic that the resource accepts or rejects, or all traffic.
   * When the target is either TransitGateway or TransitGatewayAttachment, setting the traffic type is not possible.
   *
   * @see https://docs.aws.amazon.com/vpc/latest/tgw/working-with-flow-logs.html
   *
   * @default ALL
   */
  readonly trafficType?: FlowLogTrafficType;

  /**
   * Specifies the type of destination to which the flow log data is to be published.
   * Flow log data can be published to CloudWatch Logs or Amazon S3
   *
   * @default FlowLogDestinationType.toCloudWatchLogs()
   */
  readonly destination?: FlowLogDestination;

  /**
   * The fields to include in the flow log record, in the order in which they should appear.
   *
   * If multiple fields are specified, they will be separated by spaces. For full control over the literal log format
   * string, pass a single field constructed with `LogFormat.custom()`.
   *
   * See https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html#flow-log-records
   *
   * @default - default log format is used.
   */
  readonly logFormat?: LogFormat[];

  /**
   * The maximum interval of time during which a flow of packets is captured
   * and aggregated into a flow log record.
   *
   * @default FlowLogMaxAggregationInterval.TEN_MINUTES
   */
  readonly maxAggregationInterval?: FlowLogMaxAggregationInterval;
}

/**
 * Properties of a VPC Flow Log
 */
export interface FlowLogProps extends FlowLogOptions {
  /**
   * The name of the FlowLog
   *
   * Since the FlowLog resource doesn't support providing a physical name, the value provided here will be recorded in the `Name` tag.
   *
   * @default CDK generated name
   */
  readonly flowLogName?: string;

  /**
   * The type of resource for which to create the flow log
   */
  readonly resourceType: FlowLogResourceType;
}

/**
 * The base class for a Flow Log
 */
abstract class FlowLogBase extends Resource implements IFlowLog {
  /**
   * The Id of the VPC Flow Log
   *
   * @attribute
   */
  public abstract readonly flowLogId: string;
}

/**
 * A VPC flow log.
 * @resource AWS::EC2::FlowLog
 */
export class FlowLog extends FlowLogBase {
  /**
   * Import a Flow Log by it's Id
   */
  public static fromFlowLogId(scope: Construct, id: string, flowLogId: string): IFlowLog {
    class Import extends FlowLogBase {
      public flowLogId = flowLogId;
    }

    return new Import(scope, id);
  }

  /**
   * The Id of the VPC Flow Log
   *
   * @attribute
   */
  public readonly flowLogId: string;

  /**
   * The S3 bucket to publish flow logs to
   */
  public readonly bucket?: s3.IBucket;

  /**
   * S3 bucket key prefix to publish the flow logs under
   */
  readonly keyPrefix?: string;

  /**
   * The iam role used to publish logs to CloudWatch
   */
  public readonly iamRole?: iam.IRole;

  /**
   * The CloudWatch Logs LogGroup to publish flow logs to
   */
  public readonly logGroup?: logs.ILogGroup;

  /**
   * The ARN of the Kinesis Data Firehose delivery stream to publish flow logs to
   */
  public readonly deliveryStreamArn?: string;

  constructor(scope: Construct, id: string, props: FlowLogProps) {
    super(scope, id);

    const destination = props.destination || FlowLogDestination.toCloudWatchLogs();

    const destinationConfig = destination.bind(this, this);
    this.logGroup = destinationConfig.logGroup;
    this.bucket = destinationConfig.s3Bucket;
    this.iamRole = destinationConfig.iamRole;
    this.keyPrefix = destinationConfig.keyPrefix;
    this.deliveryStreamArn = destinationConfig.deliveryStreamArn;

    Tags.of(this).add(NAME_TAG, props.flowLogName || this.node.path);

    let logDestination: string | undefined = undefined;
    if (this.bucket) {
      logDestination = this.keyPrefix ? this.bucket.arnForObjects(this.keyPrefix) : this.bucket.bucketArn;
    }
    if (this.deliveryStreamArn) {
      logDestination = this.deliveryStreamArn;
    }
    let customLogFormat: string | undefined = undefined;
    if (props.logFormat) {
      customLogFormat = props.logFormat.map(elm => {
        return elm.value;
      }).join(' ');
    }

    // In Transit Gateway and Transit Gateway Attachment, `trafficType` is not supported.
    let trafficType: FlowLogTrafficType | undefined = FlowLogTrafficType.ALL;
    if (props.resourceType.resourceType === 'TransitGateway' || props.resourceType.resourceType === 'TransitGatewayAttachment') {
      if (props.trafficType) {
        throw new Error('trafficType is not supported for Transit Gateway and Transit Gateway Attachment');
      }
      trafficType = undefined;
    } else if (props.trafficType) {
      trafficType = props.trafficType;
    }

    const flowLog = new CfnFlowLog(this, 'FlowLog', {
      destinationOptions: destinationConfig.destinationOptions,
      deliverLogsPermissionArn: this.iamRole ? this.iamRole.roleArn : undefined,
      logDestinationType: destinationConfig.logDestinationType,
      logGroupName: this.logGroup ? this.logGroup.logGroupName : undefined,
      maxAggregationInterval: props.maxAggregationInterval,
      resourceId: props.resourceType.resourceId,
      resourceType: props.resourceType.resourceType,
      trafficType,
      logFormat: customLogFormat,
      logDestination,
    });

    // VPC service implicitly tries to create a bucket policy when adding a vpc flow log.
    // To avoid the race condition, we add an explicit dependency here.
    if (this.bucket?.policy?.node.defaultChild instanceof CfnResource) {
      flowLog.addDependency(this.bucket?.policy.node.defaultChild);
    }

    // we must remove a flow log configuration first before deleting objects.
    const deleteObjects = this.bucket?.node.tryFindChild('AutoDeleteObjectsCustomResource')?.node.defaultChild;
    if (deleteObjects instanceof CfnResource) {
      flowLog.addDependency(deleteObjects);
    }

    this.flowLogId = flowLog.ref;
    this.node.defaultChild = flowLog;
  }
}
