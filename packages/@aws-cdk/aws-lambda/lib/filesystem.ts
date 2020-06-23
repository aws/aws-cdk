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
  public static fromEfsFileSystem(scope: cdk.Construct, fileSystem: efs.FileSystem, accessPointRootPath?: string): LambdaFileSystem {
    const accessPoint = new efs.AccessPoint(scope, 'AccessPoint', {
      fileSystem,
      createAcl: {
        ownerGid: '1000',
        ownerUid: '1000',
        permissions: '755',
      },
      path: accessPointRootPath ?? '/lambda',
      posixUser: {
        uid: '1000',
        gid: '1000',
      },
    });
    return {
      accessPointArn: accessPoint.accessPointArn,
      resource: fileSystem,
    };
  }
  private constructor(public readonly accessPointArn: string, public readonly resource: cdk.IResource) { }
}
