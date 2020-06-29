import * as efs from '@aws-cdk/aws-efs';

/**
 * Represents the filesystem for the Lambda function
 */
export class FileSystem {
  /**
   * mount the filesystem from Amazon EFS
   * @param ap the Amazon EFS access point
   * @param mountPath the target path in the lambda runtime environment
   */
  public static fromEfsAccessPoint(ap: efs.AccessPoint, mountPath: string): FileSystem {
    return new FileSystem({
      LocalMountPath: mountPath,
      Arn: ap.accessPointArn,
    });
  }
  protected constructor(public readonly config: any) { }
}
