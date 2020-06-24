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
  public static fromEfsFileSystem(accessPoint: efs.AccessPoint): LambdaFileSystem {
    return {
      accessPointArn: accessPoint.accessPointArn,
      resource: accessPoint,
    };
  }
  private constructor(public readonly accessPointArn: string, public readonly resource: cdk.IResource) { }
}
