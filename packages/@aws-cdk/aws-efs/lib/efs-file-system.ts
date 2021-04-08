import * as ec2 from '@aws-cdk/aws-ec2';
import * as kms from '@aws-cdk/aws-kms';
import { ConcreteDependable, IDependable, IResource, RemovalPolicy, Resource, Size, Tags } from '@aws-cdk/core';
// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports
import { FeatureFlags } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { AccessPoint, AccessPointOptions } from './access-point';
import { CfnFileSystem, CfnMountTarget } from './efs.generated';

/**
 * EFS Lifecycle Policy, if a file is not accessed for given days, it will move to EFS Infrequent Access.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-filesystem.html#cfn-elasticfilesystem-filesystem-lifecyclepolicies
 */
export enum LifecyclePolicy {
  /**
   * After 7 days of not being accessed.
   */
  AFTER_7_DAYS = 'AFTER_7_DAYS',

  /**
   * After 14 days of not being accessed.
   */
  AFTER_14_DAYS = 'AFTER_14_DAYS',

  /**
   * After 30 days of not being accessed.
   */
  AFTER_30_DAYS = 'AFTER_30_DAYS',

  /**
   * After 60 days of not being accessed.
   */
  AFTER_60_DAYS = 'AFTER_60_DAYS',

  /**
   * After 90 days of not being accessed.
   */
  AFTER_90_DAYS = 'AFTER_90_DAYS'
}

/**
 * EFS Performance mode.
 *
 * @see https://docs.aws.amazon.com/efs/latest/ug/performance.html#performancemodes
 */
export enum PerformanceMode {
  /**
   * General Purpose is ideal for latency-sensitive use cases, like web serving
   * environments, content management systems, home directories, and general file serving.
   * Recommended for the majority of Amazon EFS file systems.
   */
  GENERAL_PURPOSE = 'generalPurpose',

  /**
   * File systems in the Max I/O mode can scale to higher levels of aggregate
   * throughput and operations per second. This scaling is done with a tradeoff
   * of slightly higher latencies for file metadata operations.
   * Highly parallelized applications and workloads, such as big data analysis,
   * media processing, and genomics analysis, can benefit from this mode.
   */
  MAX_IO = 'maxIO'
}

/**
 * EFS Throughput mode.
 *
 * @see https://docs.aws.amazon.com/efs/latest/ug/performance.html#throughput-modes
 */
export enum ThroughputMode {
  /**
   * This mode on Amazon EFS scales as the size of the file system in the standard storage class grows.
   */
  BURSTING = 'bursting',

  /**
   * This mode can instantly provision the throughput of the file system (in MiB/s) independent of the amount of data stored.
   */
  PROVISIONED = 'provisioned'
}

/**
 * Represents an Amazon EFS file system
 */
export interface IFileSystem extends ec2.IConnectable, IResource {
  /**
   * The ID of the file system, assigned by Amazon EFS.
   *
   * @attribute
   */
  readonly fileSystemId: string;

  /**
   * Dependable that can be depended upon to ensure the mount targets of the filesystem are ready
   */
  readonly mountTargetsAvailable: IDependable;

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
   * @default - creates new security group which allows all outbound traffic
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
   * @default - If your application has the '@aws-cdk/aws-efs:defaultEncryptionAtRest' feature flag set, the default is true, otherwise, the default is false.
   * @link https://docs.aws.amazon.com/cdk/latest/guide/featureflags.html
   */
  readonly encrypted?: boolean;

  /**
   * The file system's name.
   *
   * @default - CDK generated name
   */
  readonly fileSystemName?: string;

  /**
   * The KMS key used for encryption. This is required to encrypt the data at rest if @encrypted is set to true.
   *
   * @default - if 'encrypted' is true, the default key for EFS (/aws/elasticfilesystem) is used
   */
  readonly kmsKey?: kms.IKey;

  /**
   * A policy used by EFS lifecycle management to transition files to the Infrequent Access (IA) storage class.
   *
   * @default - None. EFS will not transition files to the IA storage class.
   */
  readonly lifecyclePolicy?: LifecyclePolicy;

  /**
   * The performance mode that the file system will operate under.
   * An Amazon EFS file system's performance mode can't be changed after the file system has been created.
   * Updating this property will replace the file system.
   *
   * @default PerformanceMode.GENERAL_PURPOSE
   */
  readonly performanceMode?: PerformanceMode;

  /**
   * Enum to mention the throughput mode of the file system.
   *
   * @default ThroughputMode.BURSTING
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

  /**
   * The removal policy to apply to the file system.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * Whether to enable automatic backups for the file system.
   *
   * @default false
   */
  readonly enableAutomaticBackups?: boolean;
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
   * The default port File System listens on.
   */
  public static readonly DEFAULT_PORT: number = 2049;

  /**
   * Import an existing File System from the given properties.
   */
  public static fromFileSystemAttributes(scope: Construct, id: string, attrs: FileSystemAttributes): IFileSystem {
    return new ImportedFileSystem(scope, id, attrs);
  }

  /**
   * The security groups/rules used to allow network connections to the file system.
   */
  public readonly connections: ec2.Connections;

  /**
   * @attribute
   */
  public readonly fileSystemId: string;

  public readonly mountTargetsAvailable: IDependable;

  private readonly _mountTargetsAvailable = new ConcreteDependable();

  /**
   * Constructor for creating a new EFS FileSystem.
   */
  constructor(scope: Construct, id: string, props: FileSystemProps) {
    super(scope, id);

    if (props.throughputMode === ThroughputMode.PROVISIONED && props.provisionedThroughputPerSecond === undefined) {
      throw new Error('Property provisionedThroughputPerSecond is required when throughputMode is PROVISIONED');
    }

    // we explictly use 'undefined' to represent 'false' to maintain backwards compatibility since
    // its considered an actual change in CloudFormations eyes, even though they have the same meaning.
    const encrypted = props.encrypted ?? (FeatureFlags.of(this).isEnabled(
      cxapi.EFS_DEFAULT_ENCRYPTION_AT_REST) ? true : undefined);

    const filesystem = new CfnFileSystem(this, 'Resource', {
      encrypted: encrypted,
      kmsKeyId: props.kmsKey?.keyArn,
      lifecyclePolicies: (props.lifecyclePolicy ? [{ transitionToIa: props.lifecyclePolicy }] : undefined),
      performanceMode: props.performanceMode,
      throughputMode: props.throughputMode,
      provisionedThroughputInMibps: props.provisionedThroughputPerSecond?.toMebibytes(),
      backupPolicy: props.enableAutomaticBackups ? { status: 'ENABLED' } : undefined,
    });
    filesystem.applyRemovalPolicy(props.removalPolicy);

    this.fileSystemId = filesystem.ref;
    Tags.of(this).add('Name', props.fileSystemName || this.node.path);

    const securityGroup = (props.securityGroup || new ec2.SecurityGroup(this, 'EfsSecurityGroup', {
      vpc: props.vpc,
    }));

    this.connections = new ec2.Connections({
      securityGroups: [securityGroup],
      defaultPort: ec2.Port.tcp(FileSystem.DEFAULT_PORT),
    });

    const subnets = props.vpc.selectSubnets(props.vpcSubnets ?? { onePerAz: true });

    // We now have to create the mount target for each of the mentioned subnet
    let mountTargetCount = 0;
    this.mountTargetsAvailable = [];
    subnets.subnetIds.forEach((subnetId: string) => {
      const mountTarget = new CfnMountTarget(this,
        'EfsMountTarget' + (++mountTargetCount),
        {
          fileSystemId: this.fileSystemId,
          securityGroups: Array.of(securityGroup.securityGroupId),
          subnetId,
        });
      this._mountTargetsAvailable.add(mountTarget);
    });
    this.mountTargetsAvailable = this._mountTargetsAvailable;
  }

  /**
   * create access point from this filesystem
   */
  public addAccessPoint(id: string, accessPointOptions: AccessPointOptions = {}): AccessPoint {
    return new AccessPoint(this, id, {
      fileSystem: this,
      ...accessPointOptions,
    });
  }
}

class ImportedFileSystem extends Resource implements IFileSystem {
  /**
   * The security groups/rules used to allow network connections to the file system.
   */
  public readonly connections: ec2.Connections;

  /**
   * @attribute
   */
  public readonly fileSystemId: string;

  /**
   * Dependable that can be depended upon to ensure the mount targets of the filesystem are ready
   */
  public readonly mountTargetsAvailable: IDependable;

  constructor(scope: Construct, id: string, attrs: FileSystemAttributes) {
    super(scope, id);

    this.fileSystemId = attrs.fileSystemId;

    this.connections = new ec2.Connections({
      securityGroups: [attrs.securityGroup],
      defaultPort: ec2.Port.tcp(FileSystem.DEFAULT_PORT),
    });

    this.mountTargetsAvailable = new ConcreteDependable();
  }
}