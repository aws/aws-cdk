import { Construct, IResource, Resource, Stack } from '@aws-cdk/core';
import { IFileSystem } from './efs-file-system';
import { CfnAccessPoint } from './efs.generated';

/**
 * Represents an EFS AccessPoint
 */
export interface IAccessPoint extends IResource {
  /**
   * The ID of the AccessPoint
   *
   * @attribute
   */
  readonly accessPointId: string;

  /**
   * The ARN of the AccessPoint
   *
   * @attribute
   */
  readonly accessPointArn: string;
}

/**
 * Represents the CreateionInfo
 */
export interface CreationInfo {
  /**
   * Specifies the POSIX user ID to apply to the RootDirectory. Accepts values from 0 to 2^32 (4294967295).
   */
  readonly ownerUid: string;

  /**
   * Specifies the POSIX group ID to apply to the RootDirectory. Accepts values from 0 to 2^32 (4294967295).
   */
  readonly ownerGid: string;

  /**
   * Specifies the POSIX permissions to apply to the RootDirectory, in the format of an octal number representing
   * the file's mode bits.
   */
  readonly permissions: string;
}

/**
 * Represents the PosixUser
 */
export interface PosixUser {
  /**
   * The POSIX user ID used for all file system operations using this access point.
   */
  readonly uid: string;

  /**
   * The POSIX group ID used for all file system operations using this access point.
   */
  readonly gid: string;

  /**
   * Secondary POSIX group IDs used for all file system operations using this access point.
   *
   * @default - None
   */
  readonly secondaryGids?: string[];
}

/**
 * Properties for the AccessPoint
 */
export interface AccessPointProps {
  /**
   * The efs filesystem
   */
  readonly fileSystem: IFileSystem;

  /**
   * Specifies the POSIX IDs and permissions to apply when creating the access point's root directory. If the
   * root directory specified by `path` does not exist, EFS creates the root directory and applies the
   * permissions specified here.
   *  settings when a client connects to an access point.
   *
   * @default - None
   */
  readonly creationInfo?: CreationInfo;

  /**
   * Specifies the path on the EFS file system to expose as the root directory to NFS clients using the access point
   * to access the EFS file system
   *
   * @default - root(/) directory of the efs filesystem
   */
  readonly path?: string;

  /**
   * The full POSIX identity, including the user ID, group ID, and any secondary group IDs, on the access point
   *  that is used for all file system operations performed by NFS clients using the access point.
   *
   * @default - None
   */
  readonly posixUser?: PosixUser;
}

/**
 * Attributes of the Access Point
 */
export interface AccessPointAttributes {
  /**
   * ID of the Access Point
   */
  readonly accessPointId: string;

  /**
   * ARN of the Access Point
   */
  readonly accessPointArn: string;
}

/**
 * Represents the AccessPoint
 */
export class AccessPoint extends Resource implements IAccessPoint {
  /**
   * Import an existing Access Point
   */
  public static fromAccessPointAttributes(scope: Construct, id: string, attrs: AccessPointAttributes): IAccessPoint {
    class Import extends Resource implements IAccessPoint {
      public readonly accessPointId = attrs.accessPointId;
      public readonly accessPointArn = attrs.accessPointArn;
    }
    return new Import(scope, id);
  }

  /**
   * The ARN of the Access Point
   * @attribute
   */
  public readonly accessPointArn: string;

  /**
   * The ID of the Access Point
   * @attribute
   */
  public readonly accessPointId: string;

  constructor(scope: Construct, id: string, props: AccessPointProps) {
    super(scope, id);

    const resource = new CfnAccessPoint(scope, 'Resource', {
      fileSystemId: props.fileSystem.fileSystemId,
      rootDirectory: {
        creationInfo: props.creationInfo ? {
          ownerGid: props.creationInfo.ownerGid,
          ownerUid: props.creationInfo.ownerUid,
          permissions: props.creationInfo.permissions,
        } : undefined,
        path: props.path,
      },
      posixUser: props.posixUser ? {
        uid: props.posixUser.uid,
        gid: props.posixUser.gid,
        secondaryGids: props.posixUser.secondaryGids,
      } : undefined,
    });

    this.accessPointId = resource.ref;
    this.accessPointArn = Stack.of(scope).formatArn({
      service: 'elasticfilesystem',
      resource: 'access-point',
      resourceName: this.accessPointId,
    });
  }
}
