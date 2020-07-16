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
 * Permissions as POSIX ACL
 */
export interface Acl {
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
 * Options to create an AccessPoint
 */
export interface AccessPointOptions {
  /**
   * Specifies the POSIX IDs and permissions to apply when creating the access point's root directory. If the
   * root directory specified by `path` does not exist, EFS creates the root directory and applies the
   * permissions specified here. If the specified `path` does not exist, you must specify `createAcl`.
   *
   * @default - None. The directory specified by `path` must exist.
   */
  readonly createAcl?: Acl;

  /**
   * Specifies the path on the EFS file system to expose as the root directory to NFS clients using the access point
   * to access the EFS file system
   *
   * @default '/'
   */
  readonly path?: string;

  /**
   * The full POSIX identity, including the user ID, group ID, and any secondary group IDs, on the access point
   * that is used for all file system operations performed by NFS clients using the access point.
   *
   * Specify this to enforce a user identity using an access point.
   *
   * @see - [Enforcing a User Identity Using an Access Point](https://docs.aws.amazon.com/efs/latest/ug/efs-access-points.html)
   *
   * @default - user identity not enforced
   */
  readonly posixUser?: PosixUser;
}

/**
 * Properties for the AccessPoint
 */
export interface AccessPointProps extends AccessPointOptions {
  /**
   * The efs filesystem
   */
  readonly fileSystem: IFileSystem;
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
      public readonly accessPointArn = Stack.of(scope).formatArn({
        service: 'elasticfilesystem',
        resource: 'access-point',
        resourceName: accessPointId,
      });
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

  /**
   * The filesystem of the access point
   */
  public readonly fileSystem: IFileSystem;

  constructor(scope: Construct, id: string, props: AccessPointProps) {
    super(scope, id);

    const resource = new CfnAccessPoint(this, 'Resource', {
      fileSystemId: props.fileSystem.fileSystemId,
      rootDirectory: {
        creationInfo: props.createAcl ? {
          ownerGid: props.createAcl.ownerGid,
          ownerUid: props.createAcl.ownerUid,
          permissions: props.createAcl.permissions,
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
    this.fileSystem = props.fileSystem;
  }
}
