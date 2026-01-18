import { IAccessPointRef } from '../../interfaces/generated/aws-s3express-interfaces.generated';
import { Grant, IGrantable } from '../../aws-iam';

/**
 * Collection of grant methods for a DirectoryBucketAccessPoint
 */
export class DirectoryBucketAccessPointGrants {
  /**
   * Creates grants for an IAccessPointRef
   */
  public static fromAccessPoint(accessPoint: IAccessPointRef): DirectoryBucketAccessPointGrants {
    return new DirectoryBucketAccessPointGrants(accessPoint);
  }

  private constructor(private readonly accessPoint: IAccessPointRef) {
  }

  /**
   * Grant read permissions for objects accessed through this access point to an IAM principal.
   *
   * @param identity The principal
   */
  public read(identity: IGrantable): Grant {
    return this.grant(identity, perms.OBJECT_READ_ACTIONS);
  }

  /**
   * Grant write permissions for objects accessed through this access point to an IAM principal.
   *
   * @param identity The principal
   */
  public write(identity: IGrantable): Grant {
    return this.grant(identity, perms.OBJECT_WRITE_ACTIONS);
  }

  /**
   * Grant read/write permissions for objects accessed through this access point to an IAM principal.
   *
   * @param identity The principal
   */
  public readWrite(identity: IGrantable): Grant {
    return this.grant(identity, [...perms.OBJECT_READ_ACTIONS, ...perms.OBJECT_WRITE_ACTIONS]);
  }

  private grant(grantee: IGrantable, actions: string[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [
        this.accessPoint.accessPointRef.accessPointArn,
        `${this.accessPoint.accessPointRef.accessPointArn}/object/*`,
      ],
    });
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
