import { IDirectoryBucketRef } from '../../interfaces/generated/aws-s3express-interfaces.generated';
import { Grant, IGrantable } from '../../aws-iam';

/**
 * Collection of grant methods for a DirectoryBucket
 */
export class DirectoryBucketGrants {
  /**
   * Creates grants for an IDirectoryBucketRef
   */
  public static fromBucket(bucket: IDirectoryBucketRef): DirectoryBucketGrants {
    return new DirectoryBucketGrants(bucket);
  }

  private constructor(private readonly bucket: IDirectoryBucketRef) {
  }

  /**
   * Grant read permissions for this directory bucket and its contents to an IAM principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public read(identity: IGrantable, objectsKeyPattern: string = '*'): Grant {
    return this.grant(identity, perms.BUCKET_READ_ACTIONS,
      this.bucket.directoryBucketRef.directoryBucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grant write permissions to this directory bucket to an IAM principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public write(identity: IGrantable, objectsKeyPattern: string = '*'): Grant {
    return this.grant(identity, perms.BUCKET_WRITE_ACTIONS,
      this.bucket.directoryBucketRef.directoryBucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grant read/write permissions for this directory bucket and its contents to an IAM principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public readWrite(identity: IGrantable, objectsKeyPattern: string = '*'): Grant {
    const bucketActions = [...perms.BUCKET_READ_ACTIONS, ...perms.BUCKET_WRITE_ACTIONS];
    return this.grant(identity, bucketActions,
      this.bucket.directoryBucketRef.directoryBucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  private grant(
    grantee: IGrantable,
    bucketActions: string[],
    resourceArn: string,
    ...otherResourceArns: string[]
  ): Grant {
    const resources = [resourceArn, ...otherResourceArns];

    return Grant.addToPrincipal({
      grantee,
      actions: bucketActions,
      resourceArns: resources,
    });
  }

  private arnForObjects(keyPattern: string): string {
    return `${this.bucket.directoryBucketRef.directoryBucketArn}/${keyPattern}`;
  }
}

/**
 * S3 Express permission actions
 */
class perms {
  public static readonly BUCKET_READ_ACTIONS = [
    's3express:CreateSession',
    's3:GetObject',
    's3:ListBucket',
  ];

  public static readonly BUCKET_WRITE_ACTIONS = [
    's3express:CreateSession',
    's3:PutObject',
    's3:DeleteObject',
    's3:AbortMultipartUpload',
  ];
}
