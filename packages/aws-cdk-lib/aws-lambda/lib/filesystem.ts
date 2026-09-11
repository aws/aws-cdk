import type { IDependable } from 'constructs';
import type { Connections } from '../../aws-ec2';
import * as ec2 from '../../aws-ec2';
import type * as efs from '../../aws-efs';
import * as iam from '../../aws-iam';
import type * as s3files from '../../aws-s3files';
import { AccessPointReflection } from '../../aws-s3files/lib/private/access-point-reflection';
import { Stack } from '../../core';

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
  readonly dependency?: IDependable[];

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
   * Mount the filesystem from Amazon S3 Files
   * @param ap the S3 Files access point
   * @param mountPath the target path in the lambda runtime environment
   */
  public static fromS3FilesAccessPoint(ap: s3files.IAccessPointRef, mountPath: string): FileSystem {
    const reflection = AccessPointReflection.of(ap);

    return new FileSystem({
      localMountPath: mountPath,
      arn: ap.accessPointRef.accessPointArn,
      dependency: reflection.mountTargets,
      connections: new ec2.Connections({
        securityGroups: reflection.mountTargetSecurityGroups.map((cfnSg, i) =>
          ec2.SecurityGroup.fromSecurityGroupId(ap, `MountTargetSG${i}`, cfnSg.attrGroupId),
        ),
        defaultPort: ec2.Port.tcp(FileSystem.NFS_PORT),
      }),
      policies: [
        new iam.PolicyStatement({
          actions: ['s3files:ClientMount'],
          resources: [ap.accessPointRef.accessPointArn],
        }),
        new iam.PolicyStatement({
          actions: ['s3files:ClientMount', 's3files:ClientWrite'],
          resources: [reflection.fileSystem.fileSystemRef.fileSystemArn],
        }),
      ],
    });
  }

  private static readonly NFS_PORT = 2049;

  /**
   * @param config the FileSystem configurations for the Lambda function
   */
  protected constructor(public readonly config: FileSystemConfig) { }
}
