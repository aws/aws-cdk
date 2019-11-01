import iam = require('@aws-cdk/aws-iam');
import logs = require('@aws-cdk/aws-logs');
import s3 = require('@aws-cdk/aws-s3');
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnFlowLog } from './ec2.generated';
import { ISubnet, IVpc } from './vpc';

export interface IVpcFlowLog extends IResource {
  /**
   * The Id of the VPC Flow Log
   */
  readonly flowLogId: string;
}

/**
 * The type of VPC traffic to log
 */
export enum VpcFlowLogTrafficType {
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
 */
enum VpcFlowLogResourceType {
  NETWORK_INTERFACE = 'NetworkInterface',
  SUBNET = 'Subnet',
  VPC = 'VPC'
}

/**
 * The destination type for the flow log
 */
export enum VpcFlowLogDestinationType {
  /**
   * CloudWatch logs destination
   */
  CLOUD_WATCH_LOGS = 'cloud-watch-logs',

  /**
   * S3 destination
   */
  S3 = 's3'
}

/**
 * Options for the type of resource you
 * are creating the flow log for
 */
export interface ResourceTypeOptions {
  /**
   * The network interface Id that you want to
   * create the flow log for
   */
  readonly networkInterface?: string;

  /**
   * The VPC Subnet that you want to create the
   * flow log for
   */
  readonly subnet?: ISubnet;

  /**
   * The VPC that you want to create the flow log for
   */
  readonly vpc?: IVpc;
}

/**
 * Options to add a flow log to a VPC
 */
export interface VpcFlowLogOptions {
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
  readonly trafficType?: VpcFlowLogTrafficType;

  /**
   * S3 bucket to publish the flow logs to
   *
   * @default - if destinationType is S3 then and this is not
   * provided then it will create a bucket for you. 
   *
   * Should not be provided if destinationType is CLOUD_WATCH_LOGS
   */
  readonly s3Bucket?: s3.IBucket;

  /**
   * Specifies the type of destination to which the flow log data is to be published. 
   * Flow log data can be published to CloudWatch Logs or Amazon S3
   *
   * @default VpcFlowLogDestinationType.CLOUD_WATCH_LOGS
   */
  readonly destinationType?: VpcFlowLogDestinationType;

  /**
   *
   * @default - if destinationType is CLOUD_WATCH_LOGS then the iam
   * role will be created for you. 
   *
   * Should not be provided if desinationType is S3
   */
  readonly iamRole?: iam.IRole;

}

/**
 * Properties of a VPC Flow Log
 */
export interface VpcFlowLogProps  extends VpcFlowLogOptions {
  /**
   * The type of resource for which to create the flow log
   */
  readonly resourceType: ResourceTypeOptions;

}


/**
 * A VPC flow log.
 * @resource AWS::EC2::FlowLog
 */
export class VpcFlowLog extends Resource implements IVpcFlowLog {

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

  constructor(scope: Construct, id: string, props: VpcFlowLogProps) {
    super(scope, id);

    if (!props.resourceType.networkInterface && !props.resourceType.vpc && !props.resourceType.subnet) {
      throw new Error("Must specify either networkInterface, vpc, or subnet in property resourceType");
    }

    if (props.s3Bucket && props.iamRole) {
      throw new Error("IAM role should not be provided if s3Bucket is provided")
    }

    if (props.s3Bucket && props.destinationType !== VpcFlowLogDestinationType.S3) {
      throw new Error("destinationType must be set to S3 if s3Bucket is provided")
    }

    if (props.destinationType === VpcFlowLogDestinationType.S3) {
      this.bucket = props.s3Bucket || new s3.Bucket(this, 'S3Bucket', {encryption: s3.BucketEncryption.UNENCRYPTED});
    } else {
      // only create an iam role if the destination is cloudwatch logs and
      // an iam role is not provided
      this.iamRole = props.iamRole || new iam.Role(this, 'IAMRole', {
        assumedBy: new iam.ServicePrincipal('vpc-flow-logs.amazonaws.com'),
      });
      this.logGroup = new logs.LogGroup(this, 'LogGroup', props.logGroupOptions);
      new iam.Policy(this, 'Policy', {
        roles: [this.iamRole],
        statements: [
          new iam.PolicyStatement({
            actions: [
              "logs:CreateLogStream",
              "logs:PutLogEvents",
              "logs:DescribeLogStreams"
            ],
            effect: iam.Effect.ALLOW,
            resources: [this.logGroup.logGroupArn]
          }),
          new iam.PolicyStatement({
            actions: [
              'iam:PassRole',
            ],
            effect: iam.Effect.ALLOW,
            resources: [this.iamRole.roleArn]
          }),
        ]
      });
    }

    let resource = '';
    let rType =  '';
    if (props.resourceType.vpc) {
      resource = props.resourceType.vpc.vpcId;
      rType = VpcFlowLogResourceType.VPC;
    } else if (props.resourceType.subnet) {
      resource = props.resourceType.subnet.subnetId;
      rType = VpcFlowLogResourceType.SUBNET;
    } else if (props.resourceType.networkInterface) {
      resource = props.resourceType.networkInterface;
      rType = VpcFlowLogResourceType.NETWORK_INTERFACE;
    }

    const flowLog = new CfnFlowLog(this, 'FlowLog', {
      deliverLogsPermissionArn: this.iamRole ? this.iamRole.roleArn : undefined,
      logDestinationType: props.destinationType,
      logGroupName: this.logGroup ? this.logGroup.logGroupName : undefined,
      resourceId: resource,
      resourceType: rType,
      trafficType: props.trafficType ? props.trafficType : VpcFlowLogTrafficType.ALL,
      logDestination: this.bucket ? this.bucket.bucketArn : undefined
    });

    this.flowLogId = flowLog.ref;
  }
}
