import * as efs from '@aws-cdk/aws-efs';
import * as cdk from '@aws-cdk/core';

/**
 * Options for filesystem configuration
 */
export interface FileSystemOptions {
  /**
   *
   * The filesystem definition
   */
  readonly filesystem: LambdaFileSystem,

  /**
   * target mount path for lambda function
   *
   * @default - /mnt/lambdafs
   */
  readonly localMountPath?: string,
}

/**
 * Options for EFS filesystem
 */
export interface EfsFileSystemOptions {
  /**
   * Represents the efs.FileSystem resource
   */
  readonly filesystem: efs.FileSystem,

  /**
   * The root path of the efs filesystem for the access point
   *
   * @default - /lambda
   */
  readonly accessPointRootPath?: string,
}

/**
 *
 * @param scope the cdk scope
 * @param filesystem the EFS FileSystem
 * @param accessPointRootPath the root directory of the access point in the efs filesystem
 */
export class LambdaFileSystem {
  public static fromEfsFileSystem(scope: cdk.Construct, filesystem: efs.FileSystem, accessPointRootPath?: string): LambdaFileSystem {
    const cfnEfsAccessPoint = new efs.CfnAccessPoint(scope, 'AccessPoint', {
      fileSystemId: filesystem.fileSystemId,
      rootDirectory: {
        path: accessPointRootPath ?? '/lambda',
        creationInfo: {
          ownerUid: '1000',
          ownerGid: '1000',
          permissions: '755',
        }
      },
        posixUser: {
          gid: '1000',
          uid: '1000',
        }
    });
    const resourceArn = cdk.Stack.of(scope).formatArn({
    service: 'elasticfilesystem',
    resource: 'access-point',
    resourceName: cfnEfsAccessPoint.ref,
    });

    return {
      accessPointArn: resourceArn,
      resource: filesystem,
    };
  }
  private constructor(public readonly accessPointArn: string, public readonly resource: cdk.IResource) { }
}
