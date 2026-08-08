import { ArnFormat, type IResource, Resource, Stack, UnscopedValidationError } from 'aws-cdk-lib';
import { CfnAccessPoint } from 'aws-cdk-lib/aws-s3files';
import type { AccessPointReference, IAccessPointRef, IFileSystemRef } from 'aws-cdk-lib/aws-s3files';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { Construct } from 'constructs';

/**
 * Represents the POSIX user identity used for file system operations.
 */
export interface PosixUser {
  /**
   * The POSIX user ID.
   */
  readonly uid: string;

  /**
   * The POSIX group ID.
   */
  readonly gid: string;

  /**
   * Secondary POSIX group IDs.
   *
   * @default - no secondary groups
   */
  readonly secondaryGids?: string[];
}

/**
 * Permissions as POSIX ACL.
 */
export interface Acl {
  /**
   * Specifies the POSIX user ID to apply to the RootDirectory.
   * Accepts values from 0 to 2^32 (4294967295).
   */
  readonly ownerUid: string;

  /**
   * Specifies the POSIX group ID to apply to the RootDirectory.
   * Accepts values from 0 to 2^32 (4294967295).
   */
  readonly ownerGid: string;

  /**
   * Specifies the POSIX permissions to apply to the RootDirectory,
   * in the format of an octal number representing the file's mode bits.
   */
  readonly permissions: string;
}

/**
 * Options for creating an AccessPoint via addAccessPoint().
 */
export interface AccessPointOptions {
  /**
   * Specifies the POSIX IDs and permissions to apply when creating the
   * access point's root directory. If the root directory specified by
   * `path` does not exist, the file system creates the root directory
   * and applies the permissions specified here. If the specified `path`
   * does not exist, you must specify `createAcl`.
   *
   * @default - None. The directory specified by `path` must exist.
   */
  readonly createAcl?: Acl;

  /**
   * Specifies the path on the file system to expose as the root directory
   * to NFS clients using the access point to access the file system.
   *
   * @default '/'
   */
  readonly path?: string;

  /**
   * The full POSIX identity, including the user ID, group ID, and any
   * secondary group IDs, on the access point that is used for all file
   * system operations performed by NFS clients using the access point.
   *
   * @default - user identity not enforced
   */
  readonly posixUser?: PosixUser;
}

/**
 * Properties for the AccessPoint.
 */
export interface AccessPointProps extends AccessPointOptions {
  /**
   * The file system to create the access point on.
   */
  readonly fileSystem: IFileSystemRef;
}

/**
 * Attributes for importing an AccessPoint.
 */
export interface AccessPointAttributes {
  /**
   * The ID of the access point.
   * One of this, or `accessPointArn` is required.
   *
   * @default - determined based on accessPointArn
   */
  readonly accessPointId?: string;

  /**
   * The ARN of the access point.
   * One of this, or `accessPointId` is required.
   *
   * @default - determined based on accessPointId
   */
  readonly accessPointArn?: string;

  /**
   * The file system associated with this access point.
   *
   * @default - no file system
   */
  readonly fileSystem?: IFileSystemRef;
}

/**
 * Represents an S3 Files AccessPoint.
 */
export interface IAccessPoint extends IAccessPointRef, IResource {
  /**
   * The ARN of the access point.
   *
   * @attribute
   */
  readonly accessPointArn: string;

  /**
   * The ID of the access point.
   *
   * @attribute
   */
  readonly accessPointId: string;

  /**
   * The file system associated with this access point.
   */
  readonly fileSystem?: IFileSystemRef;
}

abstract class AccessPointBase extends Resource implements IAccessPoint {
  public abstract readonly accessPointArn: string;
  public abstract readonly accessPointId: string;
  public abstract readonly fileSystem?: IFileSystemRef;

  public get accessPointRef(): AccessPointReference {
    return { accessPointArn: this.accessPointArn, accessPointId: this.accessPointId };
  }
}

/**
 * An S3 Files AccessPoint.
 *
 * @resource AWS::S3Files::AccessPoint
 */
export class AccessPoint extends AccessPointBase {
  /**
   * Import an existing access point by its ID.
   */
  public static fromAccessPointId(scope: Construct, id: string, accessPointId: string): IAccessPoint {
    return AccessPoint.fromAccessPointAttributes(scope, id, { accessPointId });
  }

  /**
   * Import an existing access point from its attributes.
   */
  public static fromAccessPointAttributes(scope: Construct, id: string, attrs: AccessPointAttributes): IAccessPoint {
    if (!attrs.accessPointArn && !attrs.accessPointId) {
      throw new UnscopedValidationError(lit`AccessPointImportInvalid`, 'One of accessPointArn or accessPointId must be provided');
    }

    class Import extends AccessPointBase {
      public readonly accessPointArn: string;
      public readonly accessPointId: string;
      public readonly fileSystem?: IFileSystemRef;

      constructor() {
        super(scope, id);

        if (attrs.accessPointArn) {
          this.accessPointArn = attrs.accessPointArn;
          this.accessPointId = Stack.of(scope).splitArn(attrs.accessPointArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
        } else {
          this.accessPointId = attrs.accessPointId!;
          this.accessPointArn = Stack.of(scope).formatArn({
            service: 's3files',
            resource: 'access-point',
            resourceName: attrs.accessPointId,
          });
        }

        this.fileSystem = attrs.fileSystem;
      }
    }

    return new Import();
  }

  public readonly accessPointArn: string;
  public readonly accessPointId: string;
  public readonly fileSystem?: IFileSystemRef;

  constructor(scope: Construct, id: string, props: AccessPointProps) {
    super(scope, id);

    this.fileSystem = props.fileSystem;

    const resource = new CfnAccessPoint(this, 'Resource', {
      fileSystemId: props.fileSystem.fileSystemRef.fileSystemArn,
      posixUser: props.posixUser ? {
        uid: props.posixUser.uid,
        gid: props.posixUser.gid,
        secondaryGids: props.posixUser.secondaryGids,
      } : undefined,
      rootDirectory: {
        path: props.path ?? '/',
        creationPermissions: props.createAcl ? {
          ownerUid: props.createAcl.ownerUid,
          ownerGid: props.createAcl.ownerGid,
          permissions: props.createAcl.permissions,
        } : undefined,
      },
    });

    this.accessPointArn = resource.attrAccessPointArn;
    this.accessPointId = resource.ref;
  }
}
