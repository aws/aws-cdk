import iam = require('@aws-cdk/aws-iam');
import logs = require('@aws-cdk/aws-logs');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, IResource, PhysicalName, Resource } from '@aws-cdk/core';
import { CfnFlowLog } from './ec2.generated';
import { ISubnet, IVpc } from './vpc';

/**
 * A FlowLog
 *
 * @experimental
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
 * @experimental
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
 * The type of resource to create the flow log for
 *
 * @experimental
 */
export abstract class FlowLogResourceType {
  /**
   * The subnet to attach the Flow Log to
   */
  public static fromSubnet(subnet: ISubnet): FlowLogResourceType {
    return {
      resourceType: 'Subnet',
      resourceId: subnet.subnetId
    };
  }

  /**
   * The VPC to attach the Flow Log to
   */
  public static fromVpc(vpc: IVpc): FlowLogResourceType {
    return {
      resourceType: 'VPC',
      resourceId: vpc.vpcId
    };
  }

  /**
   * The Network Interface to attach the Flow Log to
   */
  public static fromNetworkInterfaceId(id: string): FlowLogResourceType {
    return {
      resourceType: 'NetworkInterface',
      resourceId: id
    };
  }

  public abstract resourceType: string;
  public abstract resourceId: string;
}

/**
 * The destination type for the flow log
 *
 * @experimental
 */
export abstract class FlowLogDestination {
  /**
   * Use CloudWatch logs as the destination
   */
  public static toCloudWatchLogs(iamRole?: iam.IRole): FlowLogDestination {
    return new FlowLogDestinationImpl({
      logDestinationType: 'cloud-watch-logs',
      iamRole
    });
  }

  /**
   * Use S3 as the destination
   */
  public static toS3(bucket?: s3.IBucket): FlowLogDestination {
    return new FlowLogDestinationImpl({
      logDestinationType: 's3',
      s3Bucket: bucket
    });
  }

  public abstract toDestination(): FlowLogDestinationConfig;
}

/**
 * Flow Log Destination configuration
 *
 * @experimental
 */
export interface FlowLogDestinationConfig {
  /**
   * The type of destination to publish the flow logs to.
   */
  readonly logDestinationType: string;

  /**
   * S3 bucket to publish the flow logs to
   *
   * @default - undefined
   */
  readonly s3Bucket?: s3.IBucket;

  /**
   * The IAM Role that has access to publish to CloudWatch logs
   *
   * @default - undefined
   */
  readonly iamRole?: iam.IRole;
}

class FlowLogDestinationImpl extends FlowLogDestination {
  constructor(private readonly config: FlowLogDestinationConfig) {
    super();
  }

  public toDestination(): FlowLogDestinationConfig {
    return this.config;
  }
}

/**
 * Options to add a flow log to a VPC
 *
 * @experimental
 */
export interface FlowLogOptions {
  /**
   * The options for creating a CloudWatch log group
   *
   * @default - will use logs.LogGroupProps defaults
   */
  readonly logGroupOptions?: logs.LogGroupProps;

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
   * @default FlowLogDestinationType.toCloudWatchLogs
   */
  readonly destination?: FlowLogDestination;
}

/**
 * Properties of a VPC Flow Log
 *
 * @experimental
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
 * @experimental
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
 * @experimental
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
   * The iam role used to publish logs to CloudWatch
   */
  public readonly iamRole?: iam.IRole;

  /**
   * The CloudWatch Logs LogGroup to publish flow logs to
   */
  public readonly logGroup?: logs.ILogGroup;

  constructor(scope: Construct, id: string, props: FlowLogProps) {
    super(scope, id, {
      physicalName: props.flowLogName
    });

    const destination = props.destination || new FlowLogDestinationImpl({
      logDestinationType: 'cloud-watch-logs'
    });

    const destinationConfig = destination.toDestination();

    if (destinationConfig.logDestinationType === 'cloud-watch-logs') {
      this.iamRole = destinationConfig.iamRole || new iam.Role(this, 'IAMRole', {
        roleName: PhysicalName.GENERATE_IF_NEEDED,
        assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com')
      });

      this.logGroup = new logs.LogGroup(this, 'LogGroup', props.logGroupOptions);

      new iam.Policy(this, 'Policy', {
        roles: [this.iamRole],
        statements: [
          new iam.PolicyStatement({
            actions: [
              'logs:CreateLogStream',
              'logs:PutLogEvents',
              'logs:DescribeLogStreams'
            ],
            effect: iam.Effect.ALLOW,
            resources: [this.logGroup.logGroupArn]
          }),
          new iam.PolicyStatement({
            actions: ['iam:PassRole'],
            effect: iam.Effect.ALLOW,
            resources: [this.iamRole.roleArn]
          })
        ]
      });
    } else {
      this.bucket = destinationConfig.s3Bucket || new s3.Bucket(this, 'S3Bucket', {
        encryption: s3.BucketEncryption.UNENCRYPTED
      });
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
      logDestination: this.bucket ? this.bucket.bucketArn : undefined
    });

    this.flowLogId = flowLog.ref;
  }
}
