import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import { Construct, IResource, Resource, Size, Tag } from '@aws-cdk/core';
import { CfnFileSystem, CfnMountTarget } from './efs.generated';

// tslint:disable:max-line-length
/**
 * EFS Lifecycle Policy, if a file is not accessed for given days, it will move to EFS Infrequent Access.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-elasticfilesystem-filesystem-lifecyclepolicies
 */
// tslint:enable
export enum LifecyclePolicy {
  /**
   * After 7 days of not being accessed.
   */
  AFTER_7_DAYS,

  /**
   * After 14 days of not being accessed.
   */
  AFTER_14_DAYS,

  /**
   * After 30 days of not being accessed.
   */
  AFTER_30_DAYS,

  /**
   * After 60 days of not being accessed.
   */
  AFTER_60_DAYS,

  /**
   * After 90 days of not being accessed.
   */
  AFTER_90_DAYS
}

/**
 * EFS Performance mode.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-efs-filesystem-performancemode
 */
export enum PerformanceMode {
  /**
   * This is the general purpose performance mode for most file systems.
   */
  GENERAL_PURPOSE = 'generalPurpose',

  /**
   * This performance mode can scale to higher levels of aggregate throughput and operations per second with a
   * tradeoff of slightly higher latencies.
   */
  MAX_IO = 'maxIO'
}

/**
 * EFS Throughput mode.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-elasticfilesystem-filesystem-throughputmode
 */
export enum ThroughputMode {
  /**
   *  This mode on Amazon EFS scales as the size of the file system in the standard storage class grows.
   */
  BURSTING = 'bursting',

  /**
   * This mode can instantly provision the throughput of the file system (in MiB/s) independent of the amount of data stored.
   */
  PROVISIONED = 'provisioned'
}

/**
 * Interface to implement AWS File Systems.
 */
export interface IFileSystem extends ec2.IConnectable, IResource {
  /**
   * The ID of the file system, assigned by Amazon EFS.
   *
   * @attribute
   */
  readonly fileSystemId: string;
}

/**
 * Properties of EFS FileSystem.
 */
export interface FileSystemProps {

  /**
   * VPC to launch the file system in.
   */
  readonly vpc: ec2.IVpc;

  /**
   * Security Group to assign to this file system.
   *
   * @default - creates new security group which allow all out bound traffic
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Which subnets to place the mount target in the VPC.
   *
   * @default - the Vpc default strategy if not specified
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Defines if the data at rest in the file system is encrypted or not.
   *
   * @default - false
   */
  readonly encrypted?: boolean;

  /**
   * The filesystem's name.
   *
   * @default - CDK generated name
   */
  readonly fileSystemName?: string;

  /**
   * The KMS key used for encryption. This is required to encrypt the data at rest if @encrypted is set to true.
   *
   * @default - if @encrypted is true, the default key for EFS (/aws/elasticfilesystem) is used
   */
  readonly kmsKey?: kms.IKey;

  /**
   * A policy used by EFS lifecycle management to transition files to the Infrequent Access (IA) storage class.
   *
   * @default - none
   */
  readonly lifecyclePolicy?: LifecyclePolicy;

  /**
   * Enum to mention the performance mode of the file system.
   *
   * @default - GENERAL_PURPOSE
   */
  readonly performanceMode?: PerformanceMode;

  /**
   * Enum to mention the throughput mode of the file system.
   *
   * @default - BURSTING
   */
  readonly throughputMode?: ThroughputMode;

  /**
   * Provisioned throughput for the file system.
   * This is a required property if the throughput mode is set to PROVISIONED.
   * Must be at least 1MiB/s.
   *
   * @default - none, errors out
   */
  readonly provisionedThroughputPerSecond?: Size;
}

/**
 * Properties that describe an existing EFS file system.
 */
export interface FileSystemAttributes {
  /**
   * The security group of the file system
   */
  readonly securityGroup: ec2.ISecurityGroup;

  /**
   * The File System's ID.
   */
  readonly fileSystemId: string;
}

/**
 * The Elastic File System implementation of IFileSystem.
 * It creates a new, empty file system in Amazon Elastic File System (Amazon EFS).
 * It also creates mount target (AWS::EFS::MountTarget) implicitly to mount the
 * EFS file system on an Amazon Elastic Compute Cloud (Amazon EC2) instance or another resource.
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html
 *
 * @resource AWS::EFS::FileSystem
 */
export class FileSystem extends Resource implements IFileSystem {

  /**
   * Import an existing File System from the given properties.
   */
  public static fromFileSystemAttributes(scope: Construct, id: string, attrs: FileSystemAttributes): IFileSystem {
    class Import extends Resource implements IFileSystem {
      public readonly fileSystemId = attrs.fileSystemId;
      public readonly connections = new ec2.Connections({
        securityGroups: [attrs.securityGroup],
        defaultPort: ec2.Port.tcp(FileSystem.DEFAULT_PORT),
      });
    }

    return new Import(scope, id);
  }

  /**
   * The default port File System listens on.
   */
  private static readonly DEFAULT_PORT: number = 2049;

  /**
   * The security groups/rules used to allow network connections to the file system.
   */
  public readonly connections: ec2.Connections;

  /**
   * @attribute
   */
  public readonly fileSystemId: string;

  /**
   * Constructor for creating a new EFS FileSystem.
   */
  constructor(scope: Construct, id: string, props: FileSystemProps) {
    super(scope, id);

    if (props.throughputMode === ThroughputMode.PROVISIONED && props.provisionedThroughputPerSecond === undefined) {
      throw new Error('Property provisionedThroughputPerSecond is required when throughputMode is PROVISIONED');
    }

    const filesystem = new CfnFileSystem(this, 'Resource', {
      encrypted: props.encrypted,
      kmsKeyId: (props.kmsKey ? props.kmsKey.keyId : undefined),
      lifecyclePolicies: (props.lifecyclePolicy ? Array.of({
        transitionToIa: LifecyclePolicy[props.lifecyclePolicy],
      } as CfnFileSystem.LifecyclePolicyProperty) : undefined),
      performanceMode: props.performanceMode,
      throughputMode: props.throughputMode,
      provisionedThroughputInMibps: props.provisionedThroughputPerSecond?.toMebibytes(),
    });

    this.fileSystemId = filesystem.ref;
    Tag.add(this, 'Name', props.fileSystemName || this.node.path);

    const securityGroup = (props.securityGroup || new ec2.SecurityGroup(this, 'EfsSecurityGroup', {
      vpc: props.vpc,
    }));

    this.connections = new ec2.Connections({
      securityGroups: [securityGroup],
      defaultPort: ec2.Port.tcp(FileSystem.DEFAULT_PORT),
    });

    const subnets = props.vpc.selectSubnets(props.vpcSubnets);

    // We now have to create the mount target for each of the mentioned subnet
    let mountTargetCount = 0;
    subnets.subnetIds.forEach((subnetId: string) => {
      new CfnMountTarget(this,
        'EfsMountTarget' + (++mountTargetCount),
        {
          fileSystemId: this.fileSystemId,
          securityGroups: Array.of(securityGroup.securityGroupId),
          subnetId,
        });
    });
  }
}