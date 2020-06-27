import * as efs from '@aws-cdk/aws-efs';

/**
 * Represents a filesystem for lambda function
 */
export interface FileSystem {
  /**
   * the mount target of the filesystem
   */
  readonly target: IFilesystemTarget;

  /**
   * the target directory in the lambda runtime environment
   */
  readonly mountPath: string;
}

/**
 * Represents a filesystem target containing the resource ARN
 */
export interface IFilesystemTarget {
  /**
   * ARN of the target
   */
  readonly targetArn: string;
}

/**
 * Represents the filesystem configuration of the lambda function
 */
export interface FilesystemConfig {
  /**
   * The resource ARN of the filesystem target
   */
  readonly arn: string;

  /**
   * The mount path in the lambda runtime environment
   */
  readonly mountPath: string;
}

/**
 * Represents the mount target of the Amazon EFS access point
 * @param accessPoint the Amazon EFS access point
 */
export class EfsAccessPointTarget implements IFilesystemTarget {
  constructor(readonly accessPoint: efs.IAccessPoint) {
  }
  public get targetArn(): string {
    return this.accessPoint.accessPointArn;
  }
}