import * as iam from '@aws-cdk/aws-iam';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import { IResource, PhysicalName, RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnFlowLog } from './ec2.generated';
import { ISubnet, IVpc } from './vpc';

/**
 * A FlowLog
 *
 *
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
 *
 *
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
 *
 */
export enum FlowLogDestinationType {
  /**
   * Send flow logs to CloudWatch Logs Group
   */
  CLOUD_WATCH_LOGS = 'cloud-watch-logs',

  /**
   * Send flow logs to S3 Bucket
   */
  S3 = 's3'
}

/**
 * The type of resource to create the flow log for
 *
 *
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
   * The type of resource to attach a flow log to.
   */
  public abstract resourceType: string;

  /**
   * The Id of the resource that the flow log should be attached to.
   */
  public abstract resourceId: string;
}

/**
 * The destination type for the flow log
 *
 *
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
   */
  public static toS3(bucket?: s3.IBucket, keyPrefix?: string): FlowLogDestination {
    return new S3Destination({
      logDestinationType: FlowLogDestinationType.S3,
      s3Bucket: bucket,
      keyPrefix,
    });
  }

  /**
   * Generates a flow log destination configuration
   */
  public abstract bind(scope: Construct, flowLog: FlowLog): FlowLogDestinationConfig;
}

/**
 * Flow Log Destination configuration
 *
 *
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
        encryption: s3.BucketEncryption.UNENCRYPTED,
        removalPolicy: RemovalPolicy.RETAIN,
      });
    } else {
      s3Bucket = this.props.s3Bucket;
    }
    return {
      logDestinationType: FlowLogDestinationType.S3,
      s3Bucket,
      keyPrefix: this.props.keyPrefix,
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
 * Options to add a flow log to a VPC
 *
 *
 */
export interface FlowLogOptions {
  /**
   * The type of traffic to log. You can log traffic that the resource accepts or rejects, or all traffic.
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
}

/**
 * Properties of a VPC Flow Log
 *
 *
 */
export interface FlowLogProps extends FlowLogOptions {
  /**
   * The name of the FlowLog
   *
   * It is not recommended to use an explicit name.
   *
   * @default If you don't specify a flowLogName, AWS CloudFormation generates a
   * unique physical ID and uses that ID for the group name.
   */
  readonly flowLogName?: string;

  /**
   * The type of resource for which to create the flow log
   */
  readonly resourceType: FlowLogResourceType;
}

/**
 * The base class for a Flow Log
 *
 *
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
 *
 *
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

  constructor(scope: Construct, id: string, props: FlowLogProps) {
    super(scope, id, {
      physicalName: props.flowLogName,
    });

    const destination = props.destination || FlowLogDestination.toCloudWatchLogs();

    const destinationConfig = destination.bind(this, this);
    this.logGroup = destinationConfig.logGroup;
    this.bucket = destinationConfig.s3Bucket;
    this.iamRole = destinationConfig.iamRole;
    this.keyPrefix = destinationConfig.keyPrefix;

    let logDestination: string | undefined = undefined;
    if (this.bucket) {
      logDestination = this.keyPrefix ? this.bucket.arnForObjects(this.keyPrefix) : this.bucket.bucketArn;
    }

    const flowLog = new CfnFlowLog(this, 'FlowLog', {
      deliverLogsPermissionArn: this.iamRole ? this.iamRole.roleArn : undefined,
      logDestinationType: destinationConfig.logDestinationType,
      logGroupName: this.logGroup ? this.logGroup.logGroupName : undefined,
      resourceId: props.resourceType.resourceId,
      resourceType: props.resourceType.resourceType,
      trafficType: props.trafficType
        ? props.trafficType
        : FlowLogTrafficType.ALL,
      logDestination,
    });

    this.flowLogId = flowLog.ref;
  }
}
