import { Grant, IGrantable } from '../../aws-iam';
import { IDirectoryBucket } from './directory-bucket';

/**
 * Collection of grant methods for a DirectoryBucket
 */
export class DirectoryBucketGrants {
  /**
   * Creates grants for an IDirectoryBucket
   */
  public static fromBucket(bucket: IDirectoryBucket): DirectoryBucketGrants {
    return new DirectoryBucketGrants(bucket);
  }

  private constructor(private readonly bucket: IDirectoryBucket) {
  }

  /**
   * Grant read permissions for this directory bucket and its contents to an IAM principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public read(identity: IGrantable, objectsKeyPattern: string = '*'): Grant {
    return this.grant(identity, perms.BUCKET_READ_ACTIONS, perms.KEY_READ_ACTIONS,
      this.bucket.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grant write permissions to this directory bucket to an IAM principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public write(identity: IGrantable, objectsKeyPattern: string = '*'): Grant {
    return this.grant(identity, perms.BUCKET_WRITE_ACTIONS, perms.KEY_WRITE_ACTIONS,
      this.bucket.bucketArn,
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
    const keyActions = [...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS];
    return this.grant(identity, bucketActions, keyActions,
      this.bucket.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  private grant(
    grantee: IGrantable,
    bucketActions: string[],
    keyActions: string[],
    resourceArn: string,
    ...otherResourceArns: string[]
  ): Grant {
    const resources = [resourceArn, ...otherResourceArns];

    const ret = Grant.addToPrincipal({
      grantee,
      actions: bucketActions,
      resourceArns: resources,
    });

    if (this.bucket.encryptionKey && keyActions.length > 0) {
      this.bucket.encryptionKey.grant(grantee, ...keyActions);
    }

    return ret;
  }

  private arnForObjects(keyPattern: string): string {
    return `${this.bucket.bucketArn}/${keyPattern}`;
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

  public static readonly KEY_READ_ACTIONS = [
    'kms:Decrypt',
    'kms:DescribeKey',
  ];

  public static readonly KEY_WRITE_ACTIONS = [
    'kms:Encrypt',
    'kms:ReEncrypt*',
    'kms:GenerateDataKey*',
  ];
}
