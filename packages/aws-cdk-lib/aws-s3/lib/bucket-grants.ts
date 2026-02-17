import type { GrantReplicationPermissionProps } from './bucket';
import * as perms from './perms';
import type { IBucketRef } from './s3.generated';
import type { IEncryptedResource, IGrantable, IResourceWithPolicyV2 } from '../../aws-iam';
import { AnyPrincipal, EncryptedResources, Grant, ResourceWithPolicies } from '../../aws-iam';
import type * as iam from '../../aws-iam/lib/grant';
import { FeatureFlags, Lazy, ValidationError } from '../../core';
import * as cxapi from '../../cx-api/index';

/**
 * A bucket in which public access can be allowed or disallowed.
 */
interface IPubliclyAccessibleBucket extends IBucketRef {
  /**
   * Whether public access is disallowed for this bucket
   */
  readonly disallowPublicAccess?: boolean;
}

/**
 * Collection of grant methods for a Bucket
 */
export class BucketGrants {
  /**
   * Creates grants for an IBucketRef
   */
  public static fromBucket(bucket: IBucketRef): BucketGrants {
    return new BucketGrants(
      bucket,
      EncryptedResources.of(bucket),
      ResourceWithPolicies.of(bucket),
    );
  }

  private constructor(
    private readonly bucket: IPubliclyAccessibleBucket,
    private readonly encryptedResource?: IEncryptedResource,
    private readonly policyResource?: IResourceWithPolicyV2) {
  }

  /**
   * Grant read permissions for this bucket and it's contents to an IAM
   * principal (Role/Group/User).
   *
   * If encryption is used, permission to use the key to decrypt the contents
   * of the bucket will also be granted to the same principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*'). Parameter type is `any` but `string` should be passed in.
   */
  public read(identity: IGrantable, objectsKeyPattern: any = '*') {
    return this.grant(identity, perms.BUCKET_READ_ACTIONS, perms.KEY_READ_ACTIONS,
      this.bucket.bucketRef.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grant write permissions for this bucket and it's contents to an IAM
   * principal (Role/Group/User).
   *
   * If encryption is used, permission to use the key to decrypt the contents
   * of the bucket will also be granted to the same principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*'). Parameter type is `any` but `string` should be passed in.
   */
  public write(identity: IGrantable, objectsKeyPattern: any = '*', allowedActionPatterns: string[] = []) {
    const grantedWriteActions = allowedActionPatterns.length > 0 ? allowedActionPatterns : this.writeActions;
    return this.grant(identity, grantedWriteActions, perms.KEY_WRITE_ACTIONS,
      this.bucket.bucketRef.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grants s3:DeleteObject* permission to an IAM principal for objects
   * in this bucket.
   *
   * @param grantee The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*'). Parameter type is `any` but `string` should be passed in.
   */
  public delete(grantee: IGrantable, objectsKeyPattern: any = '*'): Grant {
    return this.grant(grantee, perms.BUCKET_DELETE_ACTIONS, [], this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Allows unrestricted access to objects from this bucket.
   *
   * IMPORTANT: This permission allows anyone to perform actions on S3 objects
   * in this bucket, which is useful for when you configure your bucket as a
   * website and want everyone to be able to read objects in the bucket without
   * needing to authenticate.
   *
   * Without arguments, this method will grant read ("s3:GetObject") access to
   * all objects ("*") in the bucket.
   *
   * The method returns the `iam.Grant` object, which can then be modified
   * as needed. For example, you can add a condition that will restrict access only
   * to an IPv4 range like this:
   *
   *     const grant = bucket.grantPublicAccess();
   *     grant.resourceStatement!.addCondition(‘IpAddress’, { “aws:SourceIp”: “54.240.143.0/24” });
   *
   * Note that if this `IBucket` refers to an existing bucket, possibly not
   * managed by CloudFormation, this method will have no effect, since it's
   * impossible to modify the policy of an existing bucket.
   *
   * @param keyPrefix the prefix of S3 object keys (e.g. `home/*`). Default is "*".
   * @param allowedActions the set of S3 actions to allow. Default is "s3:GetObject".
   */
  public publicAccess(keyPrefix = '*', ...allowedActions: string[]) {
    if (this.bucket.disallowPublicAccess) {
      throw new ValidationError("Cannot grant public access when 'blockPublicPolicy' is enabled", this.bucket);
    }

    allowedActions = allowedActions.length > 0 ? allowedActions : ['s3:GetObject'];

    return this.grant(new AnyPrincipal(), allowedActions, [], this.arnForObjects(keyPrefix));
  }

  /**
   * Grants s3:PutObject* and s3:Abort* permissions for this bucket to an IAM principal.
   *
   * If encryption is used, permission to use the key to encrypt the contents
   * of written files will also be granted to the same principal.
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*'). Parameter type is `any` but `string` should be passed in.
   */
  public put(identity: IGrantable, objectsKeyPattern: any = '*') {
    return this.grant(identity, this.putActions, perms.KEY_WRITE_ACTIONS, this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grants s3:PutObjectAcl and s3:PutObjectVersionAcl permissions for this bucket to an IAM principal.
   *
   * If encryption is used, permission to use the key to encrypt the contents
   * of written files will also be granted to the same principal.
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*'). Parameter type is `any` but `string` should be passed in.
   */
  public putAcl(identity: IGrantable, objectsKeyPattern: string = '*') {
    return this.grant(identity, perms.BUCKET_PUT_ACL_ACTIONS, [], this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grant read and write permissions for this bucket and it's contents to an IAM
   * principal (Role/Group/User).
   *
   * If encryption is used, permission to use the key to decrypt the contents
   * of the bucket will also be granted to the same principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*'). Parameter type is `any` but `string` should be passed in.
   */
  public readWrite(identity: IGrantable, objectsKeyPattern: any = '*') {
    const bucketActions = perms.BUCKET_READ_ACTIONS.concat(this.writeActions);
    // we need unique permissions because some permissions are common between read and write key actions
    const keyActions = [...new Set([...perms.KEY_READ_ACTIONS, ...perms.KEY_WRITE_ACTIONS])];

    return this.grant(identity,
      bucketActions,
      keyActions,
      this.bucket.bucketRef.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  private get putActions(): string[] {
    return FeatureFlags.of(this.bucket).isEnabled(cxapi.S3_GRANT_WRITE_WITHOUT_ACL)
      ? perms.BUCKET_PUT_ACTIONS
      : perms.LEGACY_BUCKET_PUT_ACTIONS;
  }

  private get writeActions(): string[] {
    return [
      ...perms.BUCKET_DELETE_ACTIONS,
      ...this.putActions,
    ];
  }

  /**
   * Grant replication permission to a principal.
   * This method allows the principal to perform replication operations on this bucket.
   *
   * Note that when calling this function for source or destination buckets that support KMS encryption,
   * you need to specify the KMS key for encryption and the KMS key for decryption, respectively.
   *
   * @param identity The principal to grant replication permission to.
   * @param props The properties of the replication source and destination buckets.
   */
  public replicationPermission(identity: IGrantable, props: GrantReplicationPermissionProps): iam.Grant {
    if (props.destinations.length === 0) {
      throw new ValidationError('At least one destination bucket must be specified in the destinations array', this.bucket);
    }

    // add permissions to the role
    // @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/setting-repl-config-perm-overview.html
    let result = this.grant(identity, ['s3:GetReplicationConfiguration', 's3:ListBucket'], [], Lazy.string({ produce: () => this.bucket.bucketRef.bucketArn }));

    const g1 = this.grant(
      identity,
      ['s3:GetObjectVersionForReplication', 's3:GetObjectVersionAcl', 's3:GetObjectVersionTagging'],
      [],
      Lazy.string({ produce: () => this.arnForObjects('*') }),
    );
    result = result.combine(g1);

    const destinationBuckets = props.destinations.map(destination => destination.bucket);
    if (destinationBuckets.length > 0) {
      const bucketActions = ['s3:ReplicateObject', 's3:ReplicateDelete', 's3:ReplicateTags', 's3:ObjectOwnerOverrideToBucketOwner'];
      const g2 = (this.policyResource ? Grant.addToPrincipalOrResource({
        actions: bucketActions,
        grantee: identity,
        resourceArns: destinationBuckets.map(bucket => Lazy.string({ produce: () => bucket.arnForObjects('*') })),
        resource: this.policyResource,
      }) : Grant.addToPrincipal({
        actions: bucketActions,
        grantee: identity,
        resourceArns: destinationBuckets.map(bucket => Lazy.string({ produce: () => bucket.arnForObjects('*') })),
      }));

      result = result.combine(g2);
    }

    props.destinations.forEach(destination => {
      const g = destination.encryptionKey?.grantEncrypt(identity);
      if (g !== undefined) {
        result = result.combine(g);
      }
    });

    // If KMS key encryption is enabled on the source bucket, configure the decrypt permissions.
    const grantOnKeyResult = this.encryptedResource?.grantOnKey(identity, 'kms:Decrypt');
    if (grantOnKeyResult?.grant) {
      result = result.combine(grantOnKeyResult.grant);
    }

    return result;
  }

  private grant(
    grantee: IGrantable,
    bucketActions: string[],
    keyActions: string[],
    resourceArn: string, ...otherResourceArns: string[]) {
    const resources = [resourceArn, ...otherResourceArns];

    const result = (this.policyResource ? Grant.addToPrincipalOrResource({
      actions: bucketActions,
      grantee: grantee,
      resourceArns: resources,
      resource: this.policyResource,
    }) : Grant.addToPrincipal({
      actions: bucketActions,
      grantee: grantee,
      resourceArns: resources,
    }));

    if (keyActions.length > 0) {
      this.encryptedResource?.grantOnKey(grantee, ...keyActions);
    }

    return result;
  }

  private arnForObjects(keyPattern: string): string {
    return `${this.bucket.bucketRef.bucketArn}/${keyPattern}`;
  }
}
