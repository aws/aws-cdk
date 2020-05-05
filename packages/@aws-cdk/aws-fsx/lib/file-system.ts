import {Connections, IConnectable, ISecurityGroup,  IVpc} from '@aws-cdk/aws-ec2';
import {IKey} from '@aws-cdk/aws-kms';
import {Resource} from '@aws-cdk/core';

/**
 * Interface to implement FSx File Systems.
 */
export interface IFileSystem extends IConnectable {
  /**
   * The ID of the file system, assigned by Amazon FSx.
   * @attribute
   */
  readonly fileSystemId: string;
}

/**
 * Properties for the FSx file system
 *
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-fsx-filesystem.html
 */
export interface FileSystemProps {
  /**
   * The VPC to launch the file system in.
   */
  readonly vpc: IVpc;

  /**
   * The ID of the backup. Specifies the backup to use if you're creating a file system from an existing backup.
   *
   * @default - no backup will be used.
   */
  readonly backupId?: string;

  /**
   * The KMS key used for encryption to protect your data at rest.
   *
   * @default - the aws/fsx default KMS key for the AWS account being deployed into.
   */
  readonly kmsKey?: IKey;

  /**
   * Security Group to assign to this file system.
   *
   * @default - creates new security group which allows all outbound traffic.
   */
  readonly securityGroup?: ISecurityGroup;

  /**
   * The storage capacity of the file system being created.
   * For Windows file systems, valid values are 32 GiB to 65,536 GiB.
   * For SCRATCH_1 deployment types, valid values are 1,200, 2,400, 3,600, then continuing in increments of 3,600 GiB.
   * For SCRATCH_2 and PERSISTENT_1 types, valid values are 1,200, 2,400, then continuing in increments of 2,400 GiB.
   */
  readonly storageCapacityGiB: number;
}

/**
 * A new or imported FSx file system.
 */
export abstract class FileSystemBase extends Resource implements IFileSystem {
  /**
   * The security groups/rules used to allow network connections to the file system.
   * @attribute
   */
  public abstract readonly connections: Connections;

  /**
   * The DNS name assigned to this file system.
   * @attribute
   */
  public abstract readonly dnsName: string;

  /**
   * The ID of the file system, assigned by Amazon FSx.
   * @attribute
   */
  public abstract readonly fileSystemId: string;
}

/**
 * Properties that describe an existing FSx file system.
 */
export interface FileSystemAttributes {
  /**
   * The DNS name assigned to this file system.
   */
  readonly dnsName: string;

  /**
   * The ID of the file system, assigned by Amazon FSx.
   */
  readonly fileSystemId: string;

  /**
   * The security group of the file system.
   */
  readonly securityGroup: ISecurityGroup;
}