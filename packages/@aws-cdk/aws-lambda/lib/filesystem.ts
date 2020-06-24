import * as efs from '@aws-cdk/aws-efs';

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
  /**
   * mount the efs filesystem via the efs access point
   */
  public static fromEfsFileSystem(accessPoint: efs.IAccessPoint): LambdaFileSystem {
    return {
      accessPointArn: accessPoint.accessPointArn,
    };
  }
  private constructor(public readonly accessPointArn: string) { }
}
