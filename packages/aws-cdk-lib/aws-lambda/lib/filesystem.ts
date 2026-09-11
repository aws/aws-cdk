import type { IDependable } from 'constructs';
import type { Connections } from '../../aws-ec2';
import * as ec2 from '../../aws-ec2';
import type * as efs from '../../aws-efs';
import * as iam from '../../aws-iam';
import type * as s3 from '../../aws-s3';
import type * as s3files from '../../aws-s3files';
import { AccessPointReflection } from '../../aws-s3files/lib/private/access-point-reflection';
import { Stack } from '../../core';

/**
 * The DirectS3Read configuration for an S3 Files filesystem mount.
 *
 * Direct reads let Lambda read objects straight from the backing S3 bucket for
 * higher throughput, instead of routing every read through the file system mount.
 *
 * Create one with a factory method:
 *
 * - `DirectS3Read.enabled(bucket)` — turn direct reads on and grant the execution
 *   role read access to `bucket`.
 * - `DirectS3Read.enabledWithoutGrant()` — turn direct reads on but add no S3
 *   permissions; grant read access to the execution role yourself.
 * - `DirectS3Read.auto()` — let the service decide based on the function's memory.
 * - `DirectS3Read.disabled()` — always read through the mount.
 */
export class DirectS3Read {
  /**
   * Enable direct S3 reads, bypassing the mount for higher throughput, and grant the
   * function's execution role `s3:GetObject` and `s3:GetObjectVersion` on the bucket's
   * objects so that direct reads can succeed.
   *
   * Unlike `auto()`, this enables direct reads regardless of the function's memory size,
   * including functions with less than 512 MB of memory.
   *
   * If the bucket is encrypted with a customer-managed KMS key, also grant the execution
   * role `kms:Decrypt` on that key yourself.
   *
   * @param bucket the S3 bucket backing the S3 Files file system
   */
  public static enabled(bucket: s3.IBucket): DirectS3Read {
    return new DirectS3Read('ENABLED', bucket);
  }

  /**
   * Enable direct S3 reads, bypassing the mount for higher throughput, without adding any
   * S3 read permissions.
   *
   * Like `enabled()`, this enables direct reads regardless of the function's memory size,
   * including functions with less than 512 MB of memory.
   *
   * Use this when the execution role already has `s3:GetObject`/`s3:GetObjectVersion` on the
   * backing bucket (for example through a managed policy or a bucket policy). You are
   * responsible for granting those permissions; without them, direct reads silently fall
   * back to reading through the file system.
   */
  public static enabledWithoutGrant(): DirectS3Read {
    return new DirectS3Read('ENABLED');
  }

  /**
   * Let the service decide whether to use direct S3 read based on the function's memory
   * configuration: direct reads are active for functions with 512 MB or more of memory.
   *
   * No S3 read permissions are added; the execution role must already hold them for a
   * service-initiated direct read to succeed, otherwise reads fall back to the mount.
   */
  public static auto(): DirectS3Read {
    return new DirectS3Read('AUTO');
  }

  /**
   * Disable direct S3 read; all reads are routed through the S3 Files file system's
   * high-performance storage.
   */
  public static disabled(): DirectS3Read {
    return new DirectS3Read('DISABLED');
  }

  /**
   * The DirectS3Read mode (`ENABLED`, `DISABLED`, or `AUTO`) rendered into the
   * CloudFormation `S3FilesConfig`.
   * @internal
   */
  public readonly _mode: string;

  /**
   * The bucket to grant the execution role read access to, when direct reads are enabled.
   * @internal
   */
  public readonly _bucket?: s3.IBucket;

  private constructor(mode: string, bucket?: s3.IBucket) {
    this._mode = mode;
    this._bucket = bucket;
  }
}

/**
 * Options for mounting an S3 Files filesystem.
 */
export interface S3FilesOptions {
  /**
   * The DirectS3Read configuration for the S3 Files filesystem.
   *
   * Use `DirectS3Read.enabled(bucket)`, `DirectS3Read.enabledWithoutGrant()`,
   * `DirectS3Read.auto()`, or `DirectS3Read.disabled()` to control whether Lambda reads
   * objects directly from S3 instead of through the mount.
   *
   * @default - DirectS3Read is not set. The service default is AUTO.
   */
  readonly directS3Read?: DirectS3Read;
}

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

  /**
   * The DirectS3Read mode (`ENABLED`, `DISABLED`, or `AUTO`), applied only for
   * S3 Files access-point mounts.
   *
   * Set internally by `fromS3FilesAccessPoint`; not applicable to EFS mounts.
   *
   * @default - DirectS3Read is not set. The service default is AUTO.
   */
  readonly s3FilesDirectRead?: string;
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
   * @param options optional S3 Files mount options such as DirectS3Read mode
   */
  public static fromS3FilesAccessPoint(ap: s3files.IAccessPointRef, mountPath: string, options?: S3FilesOptions): FileSystem {
    const reflection = AccessPointReflection.of(ap);

    const policies = [
      new iam.PolicyStatement({
        actions: ['s3files:ClientMount'],
        resources: [ap.accessPointRef.accessPointArn],
      }),
      new iam.PolicyStatement({
        actions: ['s3files:ClientMount', 's3files:ClientWrite'],
        resources: [reflection.fileSystem.fileSystemRef.fileSystemArn],
      }),
    ];

    // Direct reads bypass the mount and read objects straight from the backing bucket,
    // so they require s3:GetObject/s3:GetObjectVersion on the execution role. Grant them
    // when the caller enabled direct reads with a bucket (`DirectS3Read.enabled(bucket)`).
    // `enabledWithoutGrant()` and `auto()` add nothing: the former opts out of the grant
    // explicitly, the latter is service-decided at runtime.
    const directS3Read = options?.directS3Read;
    if (directS3Read?._mode === 'ENABLED' && directS3Read._bucket) {
      policies.push(new iam.PolicyStatement({
        actions: ['s3:GetObject', 's3:GetObjectVersion'],
        resources: [directS3Read._bucket.arnForObjects('*')],
      }));
    }

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
      policies,
      s3FilesDirectRead: directS3Read?._mode,
    });
  }

  private static readonly NFS_PORT = 2049;

  /**
   * @param config the FileSystem configurations for the Lambda function
   */
  protected constructor(public readonly config: FileSystemConfig) { }
}
