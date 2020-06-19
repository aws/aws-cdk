import { Construct, IResource, Resource, Stack } from '@aws-cdk/core';
import { IFileSystem } from './efs-file-system';
import { CfnAccessPoint } from './efs.generated';

/**
 * Interface to implement AccessPoint
 */
export interface IAccessPoint extends IResource {
  /**
   * The ID of the AccessPoint
   *
   * @attribute
   */
  readonly accessPointId: string;
}

/**
 * Properties for the AccessPoint
 */
export interface AccessPointProps {
  /**
   * The efs filesystem
   */
  readonly filesystem: IFileSystem;

  /**
   * Specifies the POSIX user ID to apply to the RootDirectory. Accepts values from 0 to 2^32 (4294967295).
   *
   * @default 1000
   */
  readonly ownerUid?: string;

  /**
   * Specifies the POSIX group ID to apply to the RootDirectory. Accepts values from 0 to 2^32 (4294967295).
   *
   * @default 1000
   */
  readonly ownerGid?: string;

  /**
   * Specifies the POSIX permissions to apply to the RootDirectory, in the format of an octal number representing
   * the file's mode bits.
   *
   * @default 755
   */
  readonly permissions?: string;

  /**
   * Specifies the path on the EFS file system to expose as the root directory to NFS clients using the access point
   * to access the EFS file system
   *
   * @default /export
   */
  readonly path?: string;

  /**
   * The POSIX user ID used for all file system operations using this access point.
   *
   * @default 1000
   */
  readonly posixUserUid?: string;

  /**
   * Secondary POSIX group IDs used for all file system operations using this access point.
   *
   * @default - None
   */
  readonly secondaryGids?: string[];

  /**
   * The POSIX group ID used for all file system operations using this access point.
   *
   * @default 1000
   */
  readonly posixUserGid?: string;
}

/**
 * Represents the AccessPoint
 */
export class AccessPoint extends Resource implements IAccessPoint {
  /**
   * Import an existing Access Point
   */
  public static fromAccessPointId(scope: Construct, id: string, accessPointId: string): IAccessPoint {
    class Import extends Resource implements IAccessPoint {
      public readonly accessPointId = accessPointId;
    }
    return new Import(scope, id);
  }

  /**
   * resource ARN
   * @attribute
   */
  public readonly accessPointArn: string;

  /**
   * resource ID
   * @attribute
   */
  public readonly accessPointId: string;

  constructor(scope: Construct, id: string, props: AccessPointProps) {
    super(scope, id);

    const resource = new CfnAccessPoint(scope, 'Resource', {
      fileSystemId: props.filesystem.fileSystemId,
      rootDirectory: {
        creationInfo: {
          ownerGid: props.ownerGid ?? '1000',
          ownerUid: props.ownerUid ?? '1000',
          permissions: props.permissions ?? '755',
        },
        path: props.path ?? '/export',
      },
      posixUser: {
        gid: props.posixUserGid ?? '1000',
        uid: props.posixUserUid ?? '1000',
        secondaryGids: props.secondaryGids,
      },
    });

    this.accessPointId = resource.ref;
    this.accessPointArn = Stack.of(scope).formatArn({
      service: 'elasticfilesystem',
      resource: 'access-point',
      resourceName: this.accessPointId,
    });
  }
}
