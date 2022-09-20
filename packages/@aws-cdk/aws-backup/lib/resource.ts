import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as rds from '@aws-cdk/aws-rds';
import * as s3 from '@aws-cdk/aws-s3';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';

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
  DUMMY = 'dummy'
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
  public static fromDynamoDbTable(table: dynamodb.ITable) {
    return BackupResource.fromArn(table.tableArn);
  }

  /**
   * An EC2 instance
   */
  public static fromEc2Instance(instance: ec2.IInstance) {
    return BackupResource.fromArn(Stack.of(instance).formatArn({
      service: 'ec2',
      resource: 'instance',
      resourceName: instance.instanceId,
    }));
  }

  /**
   * An EFS file system
   */
  public static fromEfsFileSystem(fileSystem: efs.IFileSystem) {
    return BackupResource.fromArn(Stack.of(fileSystem).formatArn({
      service: 'elasticfilesystem',
      resource: 'file-system',
      resourceName: fileSystem.fileSystemId,
    }));
  }

  /**
   * A RDS database instance
   */
  public static fromRdsDatabaseInstance(instance: rds.IDatabaseInstance) {
    return BackupResource.fromArn(instance.instanceArn);
  }

  /**
   * A RDS database cluster
   */
  public static fromRdsDatabaseCluster(cluster: rds.IDatabaseCluster) {
    const stack = Stack.of(cluster);
    return BackupResource.fromArn(`arn:${stack.partition}:rds:${stack.region}:${stack.account}:cluster:${cluster.clusterIdentifier}`);
  }

  /**
   * An Aurora database instance
   */
  public static fromRdsServerlessCluster(cluster: rds.IServerlessCluster) {
    return BackupResource.fromArn(cluster.clusterArn);
  }

  /**
   * A S3 Bucket
   */
  public static fromS3Bucket(bucket: s3.IBucket) {
    return BackupResource.fromArn(bucket.bucketArn);
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
