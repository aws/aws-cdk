import { Connections } from '@aws-cdk/aws-ec2';
import * as efs from '@aws-cdk/aws-efs';
import * as iam from '@aws-cdk/aws-iam';
import { Stack } from '@aws-cdk/core';
import { IDependable } from 'constructs';

/**
 * FileSystem configurations for the Lambda function
 */
export interface FileSystemConfig {
  /**
   * mount path in the lambda runtime environment
   */
  readonly localMountPath: string;

  /**
   * ARN of the access point
   */
  readonly arn: string;

  /**
   * array of IDependable that lambda function depends on
   *
   * @default - no dependency
   */
  readonly dependency?: IDependable[]

  /**
   * connections object used to allow ingress traffic from lambda function
   *
   * @default - no connections required to add extra ingress rules for Lambda function
   */
  readonly connections?: Connections;

  /**
   * additional IAM policies required for the lambda function
   *
   * @default - no additional policies required
   */
  readonly policies?: iam.PolicyStatement[];
}

/**
 * Represents the filesystem for the Lambda function
 */
export class FileSystem {
  /**
   * mount the filesystem from Amazon EFS
   * @param ap the Amazon EFS access point
   * @param mountPath the target path in the lambda runtime environment
   */
  public static fromEfsAccessPoint(ap: efs.IAccessPoint, mountPath: string): FileSystem {
    return new FileSystem({
      localMountPath: mountPath,
      arn: ap.accessPointArn,
      dependency: [ap.fileSystem.mountTargetsAvailable],
      connections: ap.fileSystem.connections,
      policies: [
        new iam.PolicyStatement({
          actions: ['elasticfilesystem:ClientMount'],
          resources: ['*'],
          conditions: {
            StringEquals: {
              'elasticfilesystem:AccessPointArn': ap.accessPointArn,
            },
          },
        }),
        new iam.PolicyStatement({
          actions: ['elasticfilesystem:ClientWrite'],
          resources: [Stack.of(ap).formatArn({
            service: 'elasticfilesystem',
            resource: 'file-system',
            resourceName: ap.fileSystem.fileSystemId,
          })],
        }),
      ],
    });
  }

  /**
   * @param config the FileSystem configurations for the Lambda function
   */
  protected constructor(public readonly config: FileSystemConfig) { }
}
