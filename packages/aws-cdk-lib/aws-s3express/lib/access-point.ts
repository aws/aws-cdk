import { Construct } from 'constructs';
import { IDirectoryBucket } from './directory-bucket';
import { CfnAccessPoint } from './s3express.generated';
import * as iam from '../../aws-iam';
import {
  ArnFormat,
  IResource,
  Resource,
  Stack,
} from '../../core';
import { UnscopedValidationError } from '../../core/lib/errors';

/**
 * Represents an S3 Express One Zone directory bucket access point
 */
export interface IDirectoryBucketAccessPoint extends IResource {
  /**
   * The ARN of the access point.
   * @attribute
   */
  readonly accessPointArn: string;

  /**
   * The name of the access point.
   * @attribute
   */
  readonly accessPointName: string;

  /**
   * Grants read permissions for objects accessed through this access point to an IAM principal.
   *
   * @param identity The principal
   */
  grantRead(identity: iam.IGrantable): iam.Grant;

  /**
   * Grants write permissions for objects accessed through this access point to an IAM principal.
   *
   * @param identity The principal
   */
  grantWrite(identity: iam.IGrantable): iam.Grant;

  /**
   * Grants read/write permissions for objects accessed through this access point to an IAM principal.
   *
   * @param identity The principal
   */
  grantReadWrite(identity: iam.IGrantable): iam.Grant;
}

/**
 * Attributes for importing an existing S3 Express directory bucket access point
 */
export interface DirectoryBucketAccessPointAttributes {
  /**
   * The ARN of the access point.
   * At least one of accessPointArn or accessPointName must be specified.
   */
  readonly accessPointArn?: string;

  /**
   * The name of the access point.
   * At least one of accessPointArn or accessPointName must be specified.
   */
  readonly accessPointName?: string;
}

/**
 * Properties for defining an S3 Express One Zone directory bucket access point
 */
export interface DirectoryBucketAccessPointProps {
  /**
   * The directory bucket to which this access point belongs.
   */
  readonly bucket: IDirectoryBucket;

  /**
   * The name of the access point.
   *
   * Access point names consist of a base name you provide, followed by the zone ID,
   * followed by the suffix `--x-s3`.
   *
   * @default - Automatically generated name
   */
  readonly accessPointName?: string;

  /**
   * The AWS account ID associated with the S3 directory bucket.
   *
   * Use this property for cross-account access points.
   *
   * @default - Same account as the stack
   */
  readonly bucketAccountId?: string;
}

/**
 * An S3 Express One Zone directory bucket access point
 *
 * Access points simplify data access management for directory buckets by providing
 * named network endpoints with customized access policies.
 *
 * @resource AWS::S3Express::AccessPoint
 */
export class DirectoryBucketAccessPoint extends Resource implements IDirectoryBucketAccessPoint {
  /**
   * Import an existing directory bucket access point from its attributes
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param attrs The attributes of the access point to import
   */
  public static fromAccessPointAttributes(
    scope: Construct,
    id: string,
    attrs: DirectoryBucketAccessPointAttributes,
  ): IDirectoryBucketAccessPoint {
    const stack = Stack.of(scope);
    let accessPointArn: string;
    let accessPointName: string;

    if (attrs.accessPointArn) {
      accessPointArn = attrs.accessPointArn;
      accessPointName = attrs.accessPointName ?? stack.splitArn(accessPointArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
    } else if (attrs.accessPointName) {
      accessPointName = attrs.accessPointName;
      accessPointArn = stack.formatArn({
        service: 's3express',
        resource: 'accesspoint',
        resourceName: accessPointName,
      });
    } else {
      throw new UnscopedValidationError('Either accessPointArn or accessPointName must be specified in DirectoryBucketAccessPointAttributes');
    }

    class Import extends Resource implements IDirectoryBucketAccessPoint {
      public readonly accessPointArn = accessPointArn;
      public readonly accessPointName = accessPointName;

      public grantRead(identity: iam.IGrantable): iam.Grant {
        return this.grant(identity, perms.OBJECT_READ_ACTIONS);
      }

      public grantWrite(identity: iam.IGrantable): iam.Grant {
        return this.grant(identity, perms.OBJECT_WRITE_ACTIONS);
      }

      public grantReadWrite(identity: iam.IGrantable): iam.Grant {
        return this.grant(identity, [...perms.OBJECT_READ_ACTIONS, ...perms.OBJECT_WRITE_ACTIONS]);
      }

      private grant(grantee: iam.IGrantable, actions: string[]): iam.Grant {
        return iam.Grant.addToPrincipal({
          grantee,
          actions,
          resourceArns: [this.accessPointArn, `${this.accessPointArn}/object/*`],
        });
      }
    }

    return new Import(scope, id);
  }

  /**
   * Import an existing directory bucket access point given its ARN
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param accessPointArn The ARN of the access point
   */
  public static fromAccessPointArn(
    scope: Construct,
    id: string,
    accessPointArn: string,
  ): IDirectoryBucketAccessPoint {
    return DirectoryBucketAccessPoint.fromAccessPointAttributes(scope, id, { accessPointArn });
  }

  /**
   * Import an existing directory bucket access point given its name
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param accessPointName The name of the access point
   */
  public static fromAccessPointName(
    scope: Construct,
    id: string,
    accessPointName: string,
  ): IDirectoryBucketAccessPoint {
    return DirectoryBucketAccessPoint.fromAccessPointAttributes(scope, id, { accessPointName });
  }

  public readonly accessPointArn: string;
  public readonly accessPointName: string;

  private readonly bucket: IDirectoryBucket;

  constructor(scope: Construct, id: string, props: DirectoryBucketAccessPointProps) {
    super(scope, id, {
      physicalName: props.accessPointName,
    });

    this.bucket = props.bucket;

    const accessPoint = new CfnAccessPoint(this, 'Resource', {
      bucket: props.bucket.bucketName,
      bucketAccountId: props.bucketAccountId,
      name: props.accessPointName,
    });

    this.accessPointName = accessPoint.ref;
    this.accessPointArn = Stack.of(this).formatArn({
      service: 's3express',
      resource: 'accesspoint',
      resourceName: this.accessPointName,
    });
  }

  /**
   * Grants read permissions for objects accessed through this access point to an IAM principal.
   *
   * @param identity The principal
   */
  public grantRead(identity: iam.IGrantable): iam.Grant {
    return this.grant(identity, perms.OBJECT_READ_ACTIONS);
  }

  /**
   * Grants write permissions for objects accessed through this access point to an IAM principal.
   *
   * @param identity The principal
   */
  public grantWrite(identity: iam.IGrantable): iam.Grant {
    return this.grant(identity, perms.OBJECT_WRITE_ACTIONS);
  }

  /**
   * Grants read/write permissions for objects accessed through this access point to an IAM principal.
   *
   * @param identity The principal
   */
  public grantReadWrite(identity: iam.IGrantable): iam.Grant {
    return this.grant(identity, [...perms.OBJECT_READ_ACTIONS, ...perms.OBJECT_WRITE_ACTIONS]);
  }

  private grant(grantee: iam.IGrantable, actions: string[]): iam.Grant {
    const grant = iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.accessPointArn, `${this.accessPointArn}/object/*`],
    });

    // Also grant CreateSession permission on the underlying bucket
    this.bucket.grantRead(grantee);

    return grant;
  }
}

/**
 * S3 Express access point permission actions
 */
class perms {
  public static readonly OBJECT_READ_ACTIONS = [
    's3:GetObject',
    's3:ListBucket',
  ];

  public static readonly OBJECT_WRITE_ACTIONS = [
    's3:PutObject',
    's3:DeleteObject',
    's3:AbortMultipartUpload',
  ];
}
