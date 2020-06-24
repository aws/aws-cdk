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
 *
 * @param accessPoint the EFS Access Point
 */
export class LambdaFileSystem {
  public static fromEfsFileSystem(accessPoint: efs.IAccessPoint): LambdaFileSystem {
    return {
      accessPointArn: accessPoint.accessPointArn,
      resource: accessPoint,
    };
  }
  private constructor(public readonly accessPointArn: string, public readonly resource: cdk.IResource) { }
}
