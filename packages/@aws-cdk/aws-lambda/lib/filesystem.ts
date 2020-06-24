import * as efs from '@aws-cdk/aws-efs';

/**
 * Options for filesystem configuration
 */
export interface FileSystemOptions {
  /**
   *
   * The filesystem definition
   */
  readonly filesystem: FileSystem,

}

/**
 *
 * @param accessPoint the EFS Access Point
 */
export class FileSystem {
  /**
   * mount the efs filesystem via the efs access point
   */
  public static fromEfsAccessPoint(accessPoint: efs.IAccessPoint, targetPath: string): FileSystem {
    return {
      accessPointArn: accessPoint.accessPointArn,
      targetPath,
    };
  }
  private constructor(public readonly accessPointArn: string, public readonly targetPath: string) { }
}
