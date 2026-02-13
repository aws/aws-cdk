import type { Construct } from 'constructs';
import type * as dynamodb from '../../aws-dynamodb';
import type * as ec2 from '../../aws-ec2';
import { Stack } from '../../core';
import type { aws_rds } from '../../interfaces';
import type { IFileSystemRef } from '../../interfaces/generated/aws-efs-interfaces.generated';

/**
 * An operation that is applied to a key-value pair
 */
export enum TagOperation {
  /**
   * StringEquals
   */
  STRING_EQUALS = 'STRINGEQUALS',

  /**
   * Dummy member
   */
  DUMMY = 'dummy',
}

/**
 * A tag condition
 */
export interface TagCondition {
  /**
   * The key in a key-value pair.
   *
   * For example, in `"ec2:ResourceTag/Department": "accounting"`,
   * `ec2:ResourceTag/Department` is the key.
   */
  readonly key: string;

  /**
   * An operation that is applied to a key-value pair used to filter
   * resources in a selection.
   *
   * @default STRING_EQUALS
   */
  readonly operation?: TagOperation;

  /**
   * The value in a key-value pair.
   *
   * For example, in `"ec2:ResourceTag/Department": "accounting"`,
   * `accounting` is the value.
   */
  readonly value: string;
}

/**
 * A resource to backup
 */
export class BackupResource {
  /**
   * Adds all supported resources in a construct
   *
   * @param construct The construct containing resources to backup
   */
  public static fromConstruct(construct: Construct) {
    return new BackupResource(undefined, undefined, construct);
  }

  /**
   * A DynamoDB table
   */
  public static fromDynamoDbTable(table: dynamodb.ITableRef) {
    return BackupResource.fromArn(table.tableRef.tableArn);
  }

  /**
   * An EC2 instance
   */
  public static fromEc2Instance(instance: ec2.IInstanceRef) {
    return BackupResource.fromArn(Stack.of(instance).formatArn({
      service: 'ec2',
      resource: 'instance',
      resourceName: instance.instanceRef.instanceId,
    }));
  }

  /**
   * An EFS file system
   */
  public static fromEfsFileSystem(fileSystem: IFileSystemRef) {
    return BackupResource.fromArn(Stack.of(fileSystem).formatArn({
      service: 'elasticfilesystem',
      resource: 'file-system',
      resourceName: fileSystem.fileSystemRef.fileSystemId,
    }));
  }

  /**
   * A RDS database instance
   */
  public static fromRdsDatabaseInstance(instance: aws_rds.IDBInstanceRef) {
    return BackupResource.fromArn(instance.dbInstanceRef.dbInstanceArn);
  }

  /**
   * A RDS database cluter
   */
  public static fromRdsDatabaseCluster(cluster: aws_rds.IDBClusterRef) {
    const stack = Stack.of(cluster);
    return BackupResource.fromArn(`arn:${stack.partition}:rds:${stack.region}:${stack.account}:cluster:${cluster.dbClusterRef.dbClusterIdentifier}`);
  }

  /**
   * An Aurora database instance
   */
  public static fromRdsServerlessCluster(cluster: aws_rds.IDBClusterRef) {
    return BackupResource.fromArn(cluster.dbClusterRef.dbClusterArn);
  }

  /**
   * A list of ARNs or match patterns such as
   * `arn:aws:ec2:us-east-1:123456789012:volume/*`
   */
  public static fromArn(arn: string) {
    return new BackupResource(arn);
  }

  /**
   * A tag condition
   */
  public static fromTag(key: string, value: string, operation?: TagOperation) {
    return new BackupResource(undefined, {
      key,
      value,
      operation,
    });
  }

  /**
   * A resource
   */
  public readonly resource?: string;

  /**
   * A condition on a tag
   */
  public readonly tagCondition?: TagCondition;

  /**
   * A construct
   */
  public readonly construct?: Construct;

  constructor(resource?: string, tagCondition?: TagCondition, construct?: Construct) {
    this.resource = resource;
    this.tagCondition = tagCondition;
    this.construct = construct;
  }
}
