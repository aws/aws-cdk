import { Construct } from 'constructs';
import { IFileSystem } from './efs-file-system';
import { CfnAccessPoint } from './efs.generated';
import { ArnFormat, IResource, Resource, Stack, Tags, Token, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';

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

  /**
   * The EFS file system
   */
  readonly fileSystem: IFileSystem;
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

  /**
   * The opaque string specified in the request to ensure idempotent creation.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-efs-accesspoint.html#cfn-efs-accesspoint-clienttoken
   *
   * @default - No client token
   */
  readonly clientToken?: string;
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
 * Attributes that can be specified when importing an AccessPoint
 */
export interface AccessPointAttributes {
  /**
   * The ID of the AccessPoint
   * One of this, or `accessPointArn` is required
   *
   * @default - determined based on accessPointArn
   */
  readonly accessPointId?: string;

  /**
   * The ARN of the AccessPoint
   * One of this, or `accessPointId` is required
   *
   * @default - determined based on accessPointId
   */
  readonly accessPointArn?: string;

  /**
   * The EFS file system
   *
   * @default - no EFS file system
   */
  readonly fileSystem?: IFileSystem;
}

abstract class AccessPointBase extends Resource implements IAccessPoint {
  /**
   * The ARN of the Access Point
   * @attribute
   */
  public abstract readonly accessPointArn: string;

  /**
   * The ID of the Access Point
   * @attribute
   */
  public abstract readonly accessPointId: string;

  /**
   * The file system of the access point
   */
  public abstract readonly fileSystem: IFileSystem;
}

/**
 * Represents the AccessPoint
 */
export class AccessPoint extends AccessPointBase {
  /**
   * Import an existing Access Point by attributes
   */
  public static fromAccessPointAttributes(scope: Construct, id: string, attrs: AccessPointAttributes): IAccessPoint {
    return new ImportedAccessPoint(scope, id, attrs);
  }

  /**
   * Import an existing Access Point by id
   */
  public static fromAccessPointId(scope: Construct, id: string, accessPointId: string): IAccessPoint {
    return new ImportedAccessPoint(scope, id, {
      accessPointId: accessPointId,
    });
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
   * The file system of the access point
   */
  public readonly fileSystem: IFileSystem;

  constructor(scope: Construct, id: string, props: AccessPointProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    const clientToken = props.clientToken;
    if ((clientToken?.length === 0 || (clientToken && clientToken.length > 64)) && !Token.isUnresolved(clientToken)) {
      throw new ValidationError(`The length of \'clientToken\' must range from 1 to 64 characters, got: ${clientToken.length} characters`, this);
    }

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
      clientToken,
    });

    Tags.of(this).add('Name', this.node.path);

    this.accessPointId = resource.ref;
    this.accessPointArn = Stack.of(scope).formatArn({
      service: 'elasticfilesystem',
      resource: 'access-point',
      resourceName: this.accessPointId,
    });
    this.fileSystem = props.fileSystem;
  }
}

class ImportedAccessPoint extends AccessPointBase {
  public readonly accessPointId: string;
  public readonly accessPointArn: string;
  private readonly _fileSystem?: IFileSystem;

  constructor(scope: Construct, id: string, attrs: AccessPointAttributes) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, attrs);

    if (!attrs.accessPointId) {
      if (!attrs.accessPointArn) {
        throw new ValidationError('One of accessPointId or AccessPointArn is required!', this);
      }

      this.accessPointArn = attrs.accessPointArn;
      let maybeApId = Stack.of(scope).splitArn(attrs.accessPointArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;

      if (!maybeApId) {
        throw new ValidationError('ARN for AccessPoint must provide the resource name.', this);
      }

      this.accessPointId = maybeApId;
    } else {
      if (attrs.accessPointArn) {
        throw new ValidationError('Only one of accessPointId or AccessPointArn can be provided!', this);
      }

      this.accessPointId = attrs.accessPointId;
      this.accessPointArn = Stack.of(scope).formatArn({
        service: 'elasticfilesystem',
        resource: 'access-point',
        resourceName: attrs.accessPointId,
      });
    }

    this._fileSystem = attrs.fileSystem;
  }

  public get fileSystem() {
    if (!this._fileSystem) {
      throw new ValidationError("fileSystem is only available if 'fromAccessPointAttributes()' is used and a fileSystem is passed in as an attribute.", this);
    }

    return this._fileSystem;
  }
}
