import type { Construct } from 'constructs';
import type { IFileSystem } from './file-system';
import { CfnAccessPoint } from './s3files.generated';
import type { IResource } from '../../core';
import { ArnFormat, Resource, Stack, Token, UnscopedValidationError, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { lit } from '../../core/lib/private/literal-string';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { AccessPointReference, IAccessPointRef, IFileSystemRef } from '../../interfaces/generated/aws-s3files-interfaces.generated';

/**
 * Represents an S3 Files Access Point.
 */
export interface IAccessPoint extends IAccessPointRef, IResource {
  /**
   * The ID of the access point.
   *
   * @attribute
   */
  readonly accessPointId: string;

  /**
   * The ARN of the access point.
   *
   * @attribute
   */
  readonly accessPointArn: string;

  /**
   * The file system associated with the access point.
   */
  readonly fileSystem: IFileSystem;
}

/**
 * Permissions to apply to a newly-created access point root directory.
 */
export interface Acl {
  /**
   * POSIX user ID applied to the root directory. Range 0 to 2^32-1 (4294967295).
   */
  readonly ownerUid: string;

  /**
   * POSIX group ID applied to the root directory. Range 0 to 2^32-1 (4294967295).
   */
  readonly ownerGid: string;

  /**
   * POSIX permission bits applied to the root directory, as an octal string.
   */
  readonly permissions: string;
}

/**
 * Full POSIX identity that the access point enforces for all client operations.
 */
export interface PosixUser {
  /**
   * POSIX user ID for all file system operations using this access point.
   */
  readonly uid: string;

  /**
   * POSIX group ID for all file system operations using this access point.
   */
  readonly gid: string;

  /**
   * Secondary POSIX group IDs for all file system operations using this access point.
   *
   * @default - no secondary groups
   */
  readonly secondaryGids?: string[];
}

/**
 * Options to configure an access point on an existing file system.
 */
export interface AccessPointOptions {
  /**
   * Permissions to apply when creating the access point's root directory.
   * Required when the directory specified by `path` does not yet exist.
   *
   * Maps to the L1 `RootDirectory.CreationPermissions` property.
   *
   * @default - the root directory specified by `path` must already exist
   */
  readonly createAcl?: Acl;

  /**
   * Path on the file system exposed as the root directory to clients.
   *
   * @default '/'
   */
  readonly path?: string;

  /**
   * POSIX identity enforced for all client operations using this access point.
   *
   * @default - the client's own POSIX identity is used
   */
  readonly posixUser?: PosixUser;

  /**
   * Opaque string used to ensure idempotent creation. Length 1–64 characters.
   *
   * @default - no client token
   */
  readonly clientToken?: string;
}

/**
 * Properties for creating an access point.
 */
export interface AccessPointProps extends AccessPointOptions {
  /**
   * The file system on which to create the access point.
   */
  readonly fileSystem: IFileSystemRef;
}

/**
 * Attributes for importing an existing access point.
 */
export interface AccessPointAttributes {
  /**
   * The ID of the access point. One of `accessPointId` or `accessPointArn` is required.
   *
   * @default - determined from `accessPointArn`
   */
  readonly accessPointId?: string;

  /**
   * The ARN of the access point. One of `accessPointId` or `accessPointArn` is required.
   *
   * @default - constructed from `accessPointId`
   */
  readonly accessPointArn?: string;

  /**
   * The file system associated with the access point.
   *
   * @default - the imported access point will not expose `fileSystem`
   */
  readonly fileSystem?: IFileSystemRef;
}

abstract class AccessPointBase extends Resource implements IAccessPoint {
  /** @attribute */
  public abstract readonly accessPointArn: string;

  /** @attribute */
  public abstract readonly accessPointId: string;

  public abstract readonly fileSystem: IFileSystem;

  public get accessPointRef(): AccessPointReference {
    return {
      accessPointId: this.accessPointId,
      accessPointArn: this.accessPointArn,
    };
  }
}

/**
 * Represents an S3 Files Access Point.
 *
 * @resource AWS::S3Files::AccessPoint
 */
@propertyInjectable
export class AccessPoint extends AccessPointBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-s3files.AccessPoint';

  /**
   * Import an existing access point by attributes.
   */
  public static fromAccessPointAttributes(scope: Construct, id: string, attrs: AccessPointAttributes): IAccessPoint {
    return new ImportedAccessPoint(scope, id, attrs);
  }

  /**
   * Import an existing access point by ID.
   */
  public static fromAccessPointId(scope: Construct, id: string, accessPointId: string): IAccessPoint {
    return new ImportedAccessPoint(scope, id, { accessPointId });
  }

  /** @attribute */
  public readonly accessPointArn: string;

  /** @attribute */
  public readonly accessPointId: string;

  private readonly _fileSystem: IFileSystemRef;

  public get fileSystem(): IFileSystem {
    return toIFileSystem(this._fileSystem);
  }

  constructor(scope: Construct, id: string, props: AccessPointProps) {
    super(scope, id);
    addConstructMetadata(this, props);

    const clientToken = props.clientToken;
    if (clientToken !== undefined && !Token.isUnresolved(clientToken)) {
      if (clientToken.length < 1 || clientToken.length > 64) {
        throw new ValidationError(
          lit`ClientTokenLength`,
          `'clientToken' must be 1-64 characters long, got ${clientToken.length}`,
          this,
        );
      }
    }

    const resource = new CfnAccessPoint(this, 'Resource', {
      fileSystemId: extractFileSystemId(props.fileSystem),
      rootDirectory: {
        creationPermissions: props.createAcl ? {
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

    this.accessPointId = resource.attrAccessPointId;
    this.accessPointArn = resource.attrAccessPointArn;
    this._fileSystem = props.fileSystem;
  }
}

@propertyInjectable
class ImportedAccessPoint extends AccessPointBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-s3files.ImportedAccessPoint';

  public readonly accessPointId: string;
  public readonly accessPointArn: string;
  private readonly _fileSystem?: IFileSystemRef;

  constructor(scope: Construct, id: string, attrs: AccessPointAttributes) {
    super(scope, id);
    addConstructMetadata(this, attrs);

    if (!!attrs.accessPointId === !!attrs.accessPointArn) {
      throw new ValidationError(
        lit`OneAccessPointIdOrArn`,
        "Exactly one of 'accessPointId' or 'accessPointArn' must be provided.",
        this,
      );
    }

    if (attrs.accessPointArn) {
      this.accessPointArn = attrs.accessPointArn;
      const parsed = Stack.of(scope).splitArn(attrs.accessPointArn, ArnFormat.SLASH_RESOURCE_NAME);
      if (!parsed.resourceName) {
        throw new ValidationError(
          lit`InvalidAccessPointArn`,
          `Invalid access point ARN: ${attrs.accessPointArn}`,
          this,
        );
      }
      this.accessPointId = parsed.resourceName;
    } else {
      this.accessPointId = attrs.accessPointId!;
      this.accessPointArn = Stack.of(scope).formatArn({
        service: 's3files',
        resource: 'access-point',
        resourceName: attrs.accessPointId,
      });
    }

    this._fileSystem = attrs.fileSystem;
  }

  public get fileSystem(): IFileSystem {
    if (!this._fileSystem) {
      throw new ValidationError(
        lit`FileSystemNotAvailable`,
        "fileSystem is only available when 'fromAccessPointAttributes()' is used and a fileSystem is provided.",
        this,
      );
    }
    return toIFileSystem(this._fileSystem);
  }
}

function extractFileSystemId(fs: IFileSystemRef): string {
  if ('fileSystemId' in fs && typeof (fs as IFileSystem).fileSystemId === 'string') {
    return (fs as IFileSystem).fileSystemId;
  }
  return Stack.of(fs as unknown as Construct).splitArn(fs.fileSystemRef.fileSystemArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
}

function toIFileSystem(fs: IFileSystemRef): IFileSystem {
  if (!('fileSystemId' in fs) || !('fileSystemArn' in fs)) {
    throw new UnscopedValidationError(
      lit`FileSystemInstanceShouldImplement`,
      `'fileSystem' must implement IFileSystem, got: ${fs.constructor.name}`,
    );
  }
  return fs as IFileSystem;
}
