import { Construct } from 'constructs';
import { DirectoryBucketAccessPointGrants } from './access-point-grants';
import { IDirectoryBucket } from './directory-bucket';
import { CfnAccessPoint } from './s3express.generated';
import {
  ArnFormat,
  IResource,
  Resource,
  Stack,
} from '../../core';
import { UnscopedValidationError } from '../../core/lib/errors';
import { IAccessPointRef, AccessPointReference } from '../../interfaces/generated/aws-s3express-interfaces.generated';

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
   * Collection of grant methods for this access point
   */
  readonly grants: DirectoryBucketAccessPointGrants;
}

/**
 * Attributes for importing an existing S3 Express directory bucket access point
 */
export interface DirectoryBucketAccessPointAttributes {
  /**
   * The ARN of the access point.
   * At least one of accessPointArn or accessPointName must be specified.
   *
   * @default - Required if accessPointName is not provided
   */
  readonly accessPointArn?: string;

  /**
   * The name of the access point.
   * At least one of accessPointArn or accessPointName must be specified.
   *
   * @default - Required if accessPointArn is not provided
   */
  readonly accessPointName?: string;
}

/**
 * Properties for defining an S3 Express One Zone directory bucket access point
 */
export interface DirectoryBucketAccessPointProps {
  /**
   * The directory bucket to which this access point belongs.
   *
   * [disable-awslint:prefer-ref-interface]
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
export class DirectoryBucketAccessPoint extends Resource implements IDirectoryBucketAccessPoint, IAccessPointRef {
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

    class Import extends Resource implements IDirectoryBucketAccessPoint, IAccessPointRef {
      public readonly accessPointArn = accessPointArn;
      public readonly accessPointName = accessPointName;

      public get accessPointRef(): AccessPointReference {
        return {
          accessPointName: this.accessPointName,
          accessPointArn: this.accessPointArn,
        };
      }

      public readonly grants = DirectoryBucketAccessPointGrants.fromAccessPoint(this);
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

  /**
   * A reference to this access point resource for use in other constructs.
   */
  public get accessPointRef(): AccessPointReference {
    return {
      accessPointName: this.accessPointName,
      accessPointArn: this.accessPointArn,
    };
  }

  /**
   * Collection of grant methods for this access point
   */
  public readonly grants = DirectoryBucketAccessPointGrants.fromAccessPoint(this);

  constructor(scope: Construct, id: string, props: DirectoryBucketAccessPointProps) {
    super(scope, id, {
      physicalName: props.accessPointName,
    });

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
}
