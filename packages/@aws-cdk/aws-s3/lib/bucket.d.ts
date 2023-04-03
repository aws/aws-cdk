import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import { Duration, IResource, RemovalPolicy, Resource, ResourceProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { BucketPolicy } from './bucket-policy';
import { IBucketNotificationDestination } from './destination';
import { LifecycleRule } from './rule';
import { CfnBucket } from './s3.generated';
export interface IBucket extends IResource {
    /**
     * The ARN of the bucket.
     * @attribute
     */
    readonly bucketArn: string;
    /**
     * The name of the bucket.
     * @attribute
     */
    readonly bucketName: string;
    /**
     * The URL of the static website.
     * @attribute
     */
    readonly bucketWebsiteUrl: string;
    /**
     * The Domain name of the static website.
     * @attribute
     */
    readonly bucketWebsiteDomainName: string;
    /**
     * The IPv4 DNS name of the specified bucket.
     * @attribute
     */
    readonly bucketDomainName: string;
    /**
     * The IPv6 DNS name of the specified bucket.
     * @attribute
     */
    readonly bucketDualStackDomainName: string;
    /**
     * The regional domain name of the specified bucket.
     * @attribute
     */
    readonly bucketRegionalDomainName: string;
    /**
     * If this bucket has been configured for static website hosting.
     */
    readonly isWebsite?: boolean;
    /**
     * Optional KMS encryption key associated with this bucket.
     */
    readonly encryptionKey?: kms.IKey;
    /**
     * The resource policy associated with this bucket.
     *
     * If `autoCreatePolicy` is true, a `BucketPolicy` will be created upon the
     * first call to addToResourcePolicy(s).
     */
    policy?: BucketPolicy;
    /**
     * Adds a statement to the resource policy for a principal (i.e.
     * account/role/service) to perform actions on this bucket and/or its
     * contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for
     * this bucket or objects.
     *
     * Note that the policy statement may or may not be added to the policy.
     * For example, when an `IBucket` is created from an existing bucket,
     * it's not possible to tell whether the bucket already has a policy
     * attached, let alone to re-use that policy to add more statements to it.
     * So it's safest to do nothing in these cases.
     *
     * @param permission the policy statement to be added to the bucket's
     * policy.
     * @returns metadata about the execution of this method. If the policy
     * was not added, the value of `statementAdded` will be `false`. You
     * should always check this value to make sure that the operation was
     * actually carried out. Otherwise, synthesis and deploy will terminate
     * silently, which may be confusing.
     */
    addToResourcePolicy(permission: iam.PolicyStatement): iam.AddToResourcePolicyResult;
    /**
     * The https URL of an S3 object. For example:
     *
     * - `https://s3.us-west-1.amazonaws.com/onlybucket`
     * - `https://s3.us-west-1.amazonaws.com/bucket/key`
     * - `https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey`
     * @param key The S3 key of the object. If not specified, the URL of the
     *      bucket is returned.
     * @returns an ObjectS3Url token
     */
    urlForObject(key?: string): string;
    /**
     * The https Transfer Acceleration URL of an S3 object. Specify `dualStack: true` at the options
     * for dual-stack endpoint (connect to the bucket over IPv6). For example:
     *
     * - `https://bucket.s3-accelerate.amazonaws.com`
     * - `https://bucket.s3-accelerate.amazonaws.com/key`
     *
     * @param key The S3 key of the object. If not specified, the URL of the
     *      bucket is returned.
     * @param options Options for generating URL.
     * @returns an TransferAccelerationUrl token
     */
    transferAccelerationUrlForObject(key?: string, options?: TransferAccelerationUrlOptions): string;
    /**
     * The virtual hosted-style URL of an S3 object. Specify `regional: false` at
     * the options for non-regional URL. For example:
     *
     * - `https://only-bucket.s3.us-west-1.amazonaws.com`
     * - `https://bucket.s3.us-west-1.amazonaws.com/key`
     * - `https://bucket.s3.amazonaws.com/key`
     * - `https://china-bucket.s3.cn-north-1.amazonaws.com.cn/mykey`
     * @param key The S3 key of the object. If not specified, the URL of the
     *      bucket is returned.
     * @param options Options for generating URL.
     * @returns an ObjectS3Url token
     */
    virtualHostedUrlForObject(key?: string, options?: VirtualHostedStyleUrlOptions): string;
    /**
     * The S3 URL of an S3 object. For example:
     * - `s3://onlybucket`
     * - `s3://bucket/key`
     * @param key The S3 key of the object. If not specified, the S3 URL of the
     *      bucket is returned.
     * @returns an ObjectS3Url token
     */
    s3UrlForObject(key?: string): string;
    /**
     * Returns an ARN that represents all objects within the bucket that match
     * the key pattern specified. To represent all keys, specify ``"*"``.
     */
    arnForObjects(keyPattern: string): string;
    /**
     * Grant read permissions for this bucket and it's contents to an IAM
     * principal (Role/Group/User).
     *
     * If encryption is used, permission to use the key to decrypt the contents
     * of the bucket will also be granted to the same principal.
     *
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantRead(identity: iam.IGrantable, objectsKeyPattern?: any): iam.Grant;
    /**
     * Grant write permissions to this bucket to an IAM principal.
     *
     * If encryption is used, permission to use the key to encrypt the contents
     * of written files will also be granted to the same principal.
     *
     * Before CDK version 1.85.0, this method granted the `s3:PutObject*` permission that included `s3:PutObjectAcl`,
     * which could be used to grant read/write object access to IAM principals in other accounts.
     * If you want to get rid of that behavior, update your CDK version to 1.85.0 or later,
     * and make sure the `@aws-cdk/aws-s3:grantWriteWithoutAcl` feature flag is set to `true`
     * in the `context` key of your cdk.json file.
     * If you've already updated, but still need the principal to have permissions to modify the ACLs,
     * use the `grantPutAcl` method.
     *
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     * @param allowedActionPatterns Restrict the permissions to certain list of action patterns
     */
    grantWrite(identity: iam.IGrantable, objectsKeyPattern?: any, allowedActionPatterns?: string[]): iam.Grant;
    /**
     * Grants s3:PutObject* and s3:Abort* permissions for this bucket to an IAM principal.
     *
     * If encryption is used, permission to use the key to encrypt the contents
     * of written files will also be granted to the same principal.
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantPut(identity: iam.IGrantable, objectsKeyPattern?: any): iam.Grant;
    /**
     * Grant the given IAM identity permissions to modify the ACLs of objects in the given Bucket.
     *
     * If your application has the '@aws-cdk/aws-s3:grantWriteWithoutAcl' feature flag set,
     * calling `grantWrite` or `grantReadWrite` no longer grants permissions to modify the ACLs of the objects;
     * in this case, if you need to modify object ACLs, call this method explicitly.
     *
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantPutAcl(identity: iam.IGrantable, objectsKeyPattern?: string): iam.Grant;
    /**
     * Grants s3:DeleteObject* permission to an IAM principal for objects
     * in this bucket.
     *
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantDelete(identity: iam.IGrantable, objectsKeyPattern?: any): iam.Grant;
    /**
     * Grants read/write permissions for this bucket and it's contents to an IAM
     * principal (Role/Group/User).
     *
     * If an encryption key is used, permission to use the key for
     * encrypt/decrypt will also be granted.
     *
     * Before CDK version 1.85.0, this method granted the `s3:PutObject*` permission that included `s3:PutObjectAcl`,
     * which could be used to grant read/write object access to IAM principals in other accounts.
     * If you want to get rid of that behavior, update your CDK version to 1.85.0 or later,
     * and make sure the `@aws-cdk/aws-s3:grantWriteWithoutAcl` feature flag is set to `true`
     * in the `context` key of your cdk.json file.
     * If you've already updated, but still need the principal to have permissions to modify the ACLs,
     * use the `grantPutAcl` method.
     *
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantReadWrite(identity: iam.IGrantable, objectsKeyPattern?: any): iam.Grant;
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
     *
     * @param keyPrefix the prefix of S3 object keys (e.g. `home/*`). Default is "*".
     * @param allowedActions the set of S3 actions to allow. Default is "s3:GetObject".
     * @returns The `iam.PolicyStatement` object, which can be used to apply e.g. conditions.
     */
    grantPublicAccess(keyPrefix?: string, ...allowedActions: string[]): iam.Grant;
    /**
     * Defines a CloudWatch event that triggers when something happens to this bucket
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailEvent(id: string, options?: OnCloudTrailBucketEventOptions): events.Rule;
    /**
     * Defines an AWS CloudWatch event that triggers when an object is uploaded
     * to the specified paths (keys) in this bucket using the PutObject API call.
     *
     * Note that some tools like `aws s3 cp` will automatically use either
     * PutObject or the multipart upload API depending on the file size,
     * so using `onCloudTrailWriteObject` may be preferable.
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailPutObject(id: string, options?: OnCloudTrailBucketEventOptions): events.Rule;
    /**
     * Defines an AWS CloudWatch event that triggers when an object at the
     * specified paths (keys) in this bucket are written to.  This includes
     * the events PutObject, CopyObject, and CompleteMultipartUpload.
     *
     * Note that some tools like `aws s3 cp` will automatically use either
     * PutObject or the multipart upload API depending on the file size,
     * so using this method may be preferable to `onCloudTrailPutObject`.
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailWriteObject(id: string, options?: OnCloudTrailBucketEventOptions): events.Rule;
    /**
     * Adds a bucket notification event destination.
     * @param event The event to trigger the notification
     * @param dest The notification destination (Lambda, SNS Topic or SQS Queue)
     *
     * @param filters S3 object key filter rules to determine which objects
     * trigger this event. Each filter must include a `prefix` and/or `suffix`
     * that will be matched against the s3 object key. Refer to the S3 Developer Guide
     * for details about allowed filter rules.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html#notification-how-to-filtering
     *
     * @example
     *
     *    declare const myLambda: lambda.Function;
     *    const bucket = new s3.Bucket(this, 'MyBucket');
     *    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(myLambda), {prefix: 'home/myusername/*'})
     *
     * @see
     * https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html
     */
    addEventNotification(event: EventType, dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void;
    /**
     * Subscribes a destination to receive notifications when an object is
     * created in the bucket. This is identical to calling
     * `onEvent(s3.EventType.OBJECT_CREATED)`.
     *
     * @param dest The notification destination (see onEvent)
     * @param filters Filters (see onEvent)
     */
    addObjectCreatedNotification(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void;
    /**
     * Subscribes a destination to receive notifications when an object is
     * removed from the bucket. This is identical to calling
     * `onEvent(EventType.OBJECT_REMOVED)`.
     *
     * @param dest The notification destination (see onEvent)
     * @param filters Filters (see onEvent)
     */
    addObjectRemovedNotification(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void;
    /**
     * Enables event bridge notification, causing all events below to be sent to EventBridge:
     *
     * - Object Deleted (DeleteObject)
     * - Object Deleted (Lifecycle expiration)
     * - Object Restore Initiated
     * - Object Restore Completed
     * - Object Restore Expired
     * - Object Storage Class Changed
     * - Object Access Tier Changed
     * - Object ACL Updated
     * - Object Tags Added
     * - Object Tags Deleted
     */
    enableEventBridgeNotification(): void;
}
/**
 * A reference to a bucket outside this stack
 */
export interface BucketAttributes {
    /**
     * The ARN of the bucket. At least one of bucketArn or bucketName must be
     * defined in order to initialize a bucket ref.
     */
    readonly bucketArn?: string;
    /**
     * The name of the bucket. If the underlying value of ARN is a string, the
     * name will be parsed from the ARN. Otherwise, the name is optional, but
     * some features that require the bucket name such as auto-creating a bucket
     * policy, won't work.
     */
    readonly bucketName?: string;
    /**
     * The domain name of the bucket.
     *
     * @default - Inferred from bucket name
     */
    readonly bucketDomainName?: string;
    /**
     * The website URL of the bucket (if static web hosting is enabled).
     *
     * @default - Inferred from bucket name and region
     */
    readonly bucketWebsiteUrl?: string;
    /**
     * The regional domain name of the specified bucket.
     */
    readonly bucketRegionalDomainName?: string;
    /**
     * The IPv6 DNS name of the specified bucket.
     */
    readonly bucketDualStackDomainName?: string;
    /**
     * Force the format of the website URL of the bucket. This should be true for
     * regions launched since 2014.
     *
     * @default - inferred from available region information, `false` otherwise
     *
     * @deprecated The correct website url format can be inferred automatically from the bucket `region`.
     * Always provide the bucket region if the `bucketWebsiteUrl` will be used.
     * Alternatively provide the full `bucketWebsiteUrl` manually.
     */
    readonly bucketWebsiteNewUrlFormat?: boolean;
    /**
     * KMS encryption key associated with this bucket.
     *
     * @default - no encryption key
     */
    readonly encryptionKey?: kms.IKey;
    /**
     * If this bucket has been configured for static website hosting.
     *
     * @default false
     */
    readonly isWebsite?: boolean;
    /**
     * The account this existing bucket belongs to.
     *
     * @default - it's assumed the bucket belongs to the same account as the scope it's being imported into
     */
    readonly account?: string;
    /**
     * The region this existing bucket is in.
     * Features that require the region (e.g. `bucketWebsiteUrl`) won't fully work
     * if the region cannot be correctly inferred.
     *
     * @default - it's assumed the bucket is in the same region as the scope it's being imported into
     */
    readonly region?: string;
    /**
     * The role to be used by the notifications handler
     *
     * @default - a new role will be created.
     */
    readonly notificationsHandlerRole?: iam.IRole;
}
/**
 * Represents an S3 Bucket.
 *
 * Buckets can be either defined within this stack:
 *
 *   new Bucket(this, 'MyBucket', { props });
 *
 * Or imported from an existing bucket:
 *
 *   Bucket.import(this, 'MyImportedBucket', { bucketArn: ... });
 *
 * You can also export a bucket and import it into another stack:
 *
 *   const ref = myBucket.export();
 *   Bucket.import(this, 'MyImportedBucket', ref);
 *
 */
export declare abstract class BucketBase extends Resource implements IBucket {
    abstract readonly bucketArn: string;
    abstract readonly bucketName: string;
    abstract readonly bucketDomainName: string;
    abstract readonly bucketWebsiteUrl: string;
    abstract readonly bucketWebsiteDomainName: string;
    abstract readonly bucketRegionalDomainName: string;
    abstract readonly bucketDualStackDomainName: string;
    /**
     * Optional KMS encryption key associated with this bucket.
     */
    abstract readonly encryptionKey?: kms.IKey;
    /**
     * If this bucket has been configured for static website hosting.
     */
    abstract readonly isWebsite?: boolean;
    /**
     * The resource policy associated with this bucket.
     *
     * If `autoCreatePolicy` is true, a `BucketPolicy` will be created upon the
     * first call to addToResourcePolicy(s).
     */
    abstract policy?: BucketPolicy;
    /**
     * Indicates if a bucket resource policy should automatically created upon
     * the first call to `addToResourcePolicy`.
     */
    protected abstract autoCreatePolicy: boolean;
    /**
     * Whether to disallow public access
     */
    protected abstract disallowPublicAccess?: boolean;
    private notifications?;
    protected notificationsHandlerRole?: iam.IRole;
    constructor(scope: Construct, id: string, props?: ResourceProps);
    /**
     * Define a CloudWatch event that triggers when something happens to this repository
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailEvent(id: string, options?: OnCloudTrailBucketEventOptions): events.Rule;
    /**
     * Defines an AWS CloudWatch event that triggers when an object is uploaded
     * to the specified paths (keys) in this bucket using the PutObject API call.
     *
     * Note that some tools like `aws s3 cp` will automatically use either
     * PutObject or the multipart upload API depending on the file size,
     * so using `onCloudTrailWriteObject` may be preferable.
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailPutObject(id: string, options?: OnCloudTrailBucketEventOptions): events.Rule;
    /**
     * Defines an AWS CloudWatch event that triggers when an object at the
     * specified paths (keys) in this bucket are written to.  This includes
     * the events PutObject, CopyObject, and CompleteMultipartUpload.
     *
     * Note that some tools like `aws s3 cp` will automatically use either
     * PutObject or the multipart upload API depending on the file size,
     * so using this method may be preferable to `onCloudTrailPutObject`.
     *
     * Requires that there exists at least one CloudTrail Trail in your account
     * that captures the event. This method will not create the Trail.
     *
     * @param id The id of the rule
     * @param options Options for adding the rule
     */
    onCloudTrailWriteObject(id: string, options?: OnCloudTrailBucketEventOptions): events.Rule;
    /**
     * Adds a statement to the resource policy for a principal (i.e.
     * account/role/service) to perform actions on this bucket and/or its
     * contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for
     * this bucket or objects.
     *
     * Note that the policy statement may or may not be added to the policy.
     * For example, when an `IBucket` is created from an existing bucket,
     * it's not possible to tell whether the bucket already has a policy
     * attached, let alone to re-use that policy to add more statements to it.
     * So it's safest to do nothing in these cases.
     *
     * @param permission the policy statement to be added to the bucket's
     * policy.
     * @returns metadata about the execution of this method. If the policy
     * was not added, the value of `statementAdded` will be `false`. You
     * should always check this value to make sure that the operation was
     * actually carried out. Otherwise, synthesis and deploy will terminate
     * silently, which may be confusing.
     */
    addToResourcePolicy(permission: iam.PolicyStatement): iam.AddToResourcePolicyResult;
    /**
     * The https URL of an S3 object. Specify `regional: false` at the options
     * for non-regional URLs. For example:
     *
     * - `https://s3.us-west-1.amazonaws.com/onlybucket`
     * - `https://s3.us-west-1.amazonaws.com/bucket/key`
     * - `https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey`
     *
     * @param key The S3 key of the object. If not specified, the URL of the
     *      bucket is returned.
     * @returns an ObjectS3Url token
     */
    urlForObject(key?: string): string;
    /**
     * The https Transfer Acceleration URL of an S3 object. Specify `dualStack: true` at the options
     * for dual-stack endpoint (connect to the bucket over IPv6). For example:
     *
     * - `https://bucket.s3-accelerate.amazonaws.com`
     * - `https://bucket.s3-accelerate.amazonaws.com/key`
     *
     * @param key The S3 key of the object. If not specified, the URL of the
     *      bucket is returned.
     * @param options Options for generating URL.
     * @returns an TransferAccelerationUrl token
     */
    transferAccelerationUrlForObject(key?: string, options?: TransferAccelerationUrlOptions): string;
    /**
     * The virtual hosted-style URL of an S3 object. Specify `regional: false` at
     * the options for non-regional URL. For example:
     *
     * - `https://only-bucket.s3.us-west-1.amazonaws.com`
     * - `https://bucket.s3.us-west-1.amazonaws.com/key`
     * - `https://bucket.s3.amazonaws.com/key`
     * - `https://china-bucket.s3.cn-north-1.amazonaws.com.cn/mykey`
     *
     * @param key The S3 key of the object. If not specified, the URL of the
     *      bucket is returned.
     * @param options Options for generating URL.
     * @returns an ObjectS3Url token
     */
    virtualHostedUrlForObject(key?: string, options?: VirtualHostedStyleUrlOptions): string;
    /**
     * The S3 URL of an S3 object. For example:
     *
     * - `s3://onlybucket`
     * - `s3://bucket/key`
     *
     * @param key The S3 key of the object. If not specified, the S3 URL of the
     *      bucket is returned.
     * @returns an ObjectS3Url token
     */
    s3UrlForObject(key?: string): string;
    /**
     * Returns an ARN that represents all objects within the bucket that match
     * the key pattern specified. To represent all keys, specify ``"*"``.
     *
     * If you need to specify a keyPattern with multiple components, concatenate them into a single string, e.g.:
     *
     *   arnForObjects(`home/${team}/${user}/*`)
     *
     */
    arnForObjects(keyPattern: string): string;
    /**
     * Grant read permissions for this bucket and it's contents to an IAM
     * principal (Role/Group/User).
     *
     * If encryption is used, permission to use the key to decrypt the contents
     * of the bucket will also be granted to the same principal.
     *
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantRead(identity: iam.IGrantable, objectsKeyPattern?: any): iam.Grant;
    grantWrite(identity: iam.IGrantable, objectsKeyPattern?: any, allowedActionPatterns?: string[]): iam.Grant;
    /**
     * Grants s3:PutObject* and s3:Abort* permissions for this bucket to an IAM principal.
     *
     * If encryption is used, permission to use the key to encrypt the contents
     * of written files will also be granted to the same principal.
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantPut(identity: iam.IGrantable, objectsKeyPattern?: any): iam.Grant;
    grantPutAcl(identity: iam.IGrantable, objectsKeyPattern?: string): iam.Grant;
    /**
     * Grants s3:DeleteObject* permission to an IAM principal for objects
     * in this bucket.
     *
     * @param identity The principal
     * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
     */
    grantDelete(identity: iam.IGrantable, objectsKeyPattern?: any): iam.Grant;
    grantReadWrite(identity: iam.IGrantable, objectsKeyPattern?: any): iam.Grant;
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
    grantPublicAccess(keyPrefix?: string, ...allowedActions: string[]): iam.Grant;
    /**
     * Adds a bucket notification event destination.
     * @param event The event to trigger the notification
     * @param dest The notification destination (Lambda, SNS Topic or SQS Queue)
     *
     * @param filters S3 object key filter rules to determine which objects
     * trigger this event. Each filter must include a `prefix` and/or `suffix`
     * that will be matched against the s3 object key. Refer to the S3 Developer Guide
     * for details about allowed filter rules.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html#notification-how-to-filtering
     *
     * @example
     *
     *    declare const myLambda: lambda.Function;
     *    const bucket = new s3.Bucket(this, 'MyBucket');
     *    bucket.addEventNotification(s3.EventType.OBJECT_CREATED, new s3n.LambdaDestination(myLambda), {prefix: 'home/myusername/*'});
     *
     * @see
     * https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html
     */
    addEventNotification(event: EventType, dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void;
    private withNotifications;
    /**
     * Subscribes a destination to receive notifications when an object is
     * created in the bucket. This is identical to calling
     * `onEvent(EventType.OBJECT_CREATED)`.
     *
     * @param dest The notification destination (see onEvent)
     * @param filters Filters (see onEvent)
     */
    addObjectCreatedNotification(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void;
    /**
     * Subscribes a destination to receive notifications when an object is
     * removed from the bucket. This is identical to calling
     * `onEvent(EventType.OBJECT_REMOVED)`.
     *
     * @param dest The notification destination (see onEvent)
     * @param filters Filters (see onEvent)
     */
    addObjectRemovedNotification(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]): void;
    /**
     * Enables event bridge notification, causing all events below to be sent to EventBridge:
     *
     * - Object Deleted (DeleteObject)
     * - Object Deleted (Lifecycle expiration)
     * - Object Restore Initiated
     * - Object Restore Completed
     * - Object Restore Expired
     * - Object Storage Class Changed
     * - Object Access Tier Changed
     * - Object ACL Updated
     * - Object Tags Added
     * - Object Tags Deleted
     */
    enableEventBridgeNotification(): void;
    private get writeActions();
    private get putActions();
    private urlJoin;
    private grant;
}
export interface BlockPublicAccessOptions {
    /**
     * Whether to block public ACLs
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-options
     */
    readonly blockPublicAcls?: boolean;
    /**
     * Whether to block public policy
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-options
     */
    readonly blockPublicPolicy?: boolean;
    /**
     * Whether to ignore public ACLs
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-options
     */
    readonly ignorePublicAcls?: boolean;
    /**
     * Whether to restrict public access
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html#access-control-block-public-access-options
     */
    readonly restrictPublicBuckets?: boolean;
}
export declare class BlockPublicAccess {
    static readonly BLOCK_ALL: BlockPublicAccess;
    static readonly BLOCK_ACLS: BlockPublicAccess;
    blockPublicAcls: boolean | undefined;
    blockPublicPolicy: boolean | undefined;
    ignorePublicAcls: boolean | undefined;
    restrictPublicBuckets: boolean | undefined;
    constructor(options: BlockPublicAccessOptions);
}
/**
 * Specifies a metrics configuration for the CloudWatch request metrics from an Amazon S3 bucket.
 */
export interface BucketMetrics {
    /**
     * The ID used to identify the metrics configuration.
     */
    readonly id: string;
    /**
     * The prefix that an object must have to be included in the metrics results.
     */
    readonly prefix?: string;
    /**
     * Specifies a list of tag filters to use as a metrics configuration filter.
     * The metrics configuration includes only objects that meet the filter's criteria.
     */
    readonly tagFilters?: {
        [tag: string]: any;
    };
}
/**
 * All http request methods
 */
export declare enum HttpMethods {
    /**
     * The GET method requests a representation of the specified resource.
     */
    GET = "GET",
    /**
     * The PUT method replaces all current representations of the target resource with the request payload.
     */
    PUT = "PUT",
    /**
     * The HEAD method asks for a response identical to that of a GET request, but without the response body.
     */
    HEAD = "HEAD",
    /**
     * The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server.
     */
    POST = "POST",
    /**
     * The DELETE method deletes the specified resource.
     */
    DELETE = "DELETE"
}
/**
 * Specifies a cross-origin access rule for an Amazon S3 bucket.
 */
export interface CorsRule {
    /**
     * A unique identifier for this rule.
     *
     * @default - No id specified.
     */
    readonly id?: string;
    /**
     * The time in seconds that your browser is to cache the preflight response for the specified resource.
     *
     * @default - No caching.
     */
    readonly maxAge?: number;
    /**
     * Headers that are specified in the Access-Control-Request-Headers header.
     *
     * @default - No headers allowed.
     */
    readonly allowedHeaders?: string[];
    /**
     * An HTTP method that you allow the origin to execute.
     */
    readonly allowedMethods: HttpMethods[];
    /**
     * One or more origins you want customers to be able to access the bucket from.
     */
    readonly allowedOrigins: string[];
    /**
     * One or more headers in the response that you want customers to be able to access from their applications.
     *
     * @default - No headers exposed.
     */
    readonly exposedHeaders?: string[];
}
/**
 * All http request methods
 */
export declare enum RedirectProtocol {
    HTTP = "http",
    HTTPS = "https"
}
/**
 * Specifies a redirect behavior of all requests to a website endpoint of a bucket.
 */
export interface RedirectTarget {
    /**
     * Name of the host where requests are redirected
     */
    readonly hostName: string;
    /**
     * Protocol to use when redirecting requests
     *
     * @default - The protocol used in the original request.
     */
    readonly protocol?: RedirectProtocol;
}
/**
 * All supported inventory list formats.
 */
export declare enum InventoryFormat {
    /**
     * Generate the inventory list as CSV.
     */
    CSV = "CSV",
    /**
     * Generate the inventory list as Parquet.
     */
    PARQUET = "Parquet",
    /**
     * Generate the inventory list as ORC.
     */
    ORC = "ORC"
}
/**
 * All supported inventory frequencies.
 */
export declare enum InventoryFrequency {
    /**
     * A report is generated every day.
     */
    DAILY = "Daily",
    /**
     * A report is generated every Sunday (UTC timezone) after the initial report.
     */
    WEEKLY = "Weekly"
}
/**
 * Inventory version support.
 */
export declare enum InventoryObjectVersion {
    /**
     * Includes all versions of each object in the report.
     */
    ALL = "All",
    /**
     * Includes only the current version of each object in the report.
     */
    CURRENT = "Current"
}
/**
 * The destination of the inventory.
 */
export interface InventoryDestination {
    /**
     * Bucket where all inventories will be saved in.
     */
    readonly bucket: IBucket;
    /**
     * The prefix to be used when saving the inventory.
     *
     * @default - No prefix.
     */
    readonly prefix?: string;
    /**
     * The account ID that owns the destination S3 bucket.
     * If no account ID is provided, the owner is not validated before exporting data.
     * It's recommended to set an account ID to prevent problems if the destination bucket ownership changes.
     *
     * @default - No account ID.
     */
    readonly bucketOwner?: string;
}
/**
 * Specifies the inventory configuration of an S3 Bucket.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-inventory.html
 */
export interface Inventory {
    /**
     * The destination of the inventory.
     */
    readonly destination: InventoryDestination;
    /**
     * The inventory will only include objects that meet the prefix filter criteria.
     *
     * @default - No objects prefix
     */
    readonly objectsPrefix?: string;
    /**
     * The format of the inventory.
     *
     * @default InventoryFormat.CSV
     */
    readonly format?: InventoryFormat;
    /**
     * Whether the inventory is enabled or disabled.
     *
     * @default true
     */
    readonly enabled?: boolean;
    /**
     * The inventory configuration ID.
     *
     * @default - generated ID.
     */
    readonly inventoryId?: string;
    /**
     * Frequency at which the inventory should be generated.
     *
     * @default InventoryFrequency.WEEKLY
     */
    readonly frequency?: InventoryFrequency;
    /**
     * If the inventory should contain all the object versions or only the current one.
     *
     * @default InventoryObjectVersion.ALL
     */
    readonly includeObjectVersions?: InventoryObjectVersion;
    /**
     * A list of optional fields to be included in the inventory result.
     *
     * @default - No optional fields.
     */
    readonly optionalFields?: string[];
}
/**
   * The ObjectOwnership of the bucket.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/about-object-ownership.html
   *
   */
export declare enum ObjectOwnership {
    /**
     * ACLs are disabled, and the bucket owner automatically owns
     * and has full control over every object in the bucket.
     * ACLs no longer affect permissions to data in the S3 bucket.
     * The bucket uses policies to define access control.
     */
    BUCKET_OWNER_ENFORCED = "BucketOwnerEnforced",
    /**
     * Objects uploaded to the bucket change ownership to the bucket owner .
     */
    BUCKET_OWNER_PREFERRED = "BucketOwnerPreferred",
    /**
     * The uploading account will own the object.
     */
    OBJECT_WRITER = "ObjectWriter"
}
/**
 * The intelligent tiering configuration.
 */
export interface IntelligentTieringConfiguration {
    /**
     * Configuration name
     */
    readonly name: string;
    /**
     * Add a filter to limit the scope of this configuration to a single prefix.
     *
     * @default this configuration will apply to **all** objects in the bucket.
     */
    readonly prefix?: string;
    /**
     * You can limit the scope of this rule to the key value pairs added below.
     *
     * @default No filtering will be performed on tags
     */
    readonly tags?: Tag[];
    /**
     * When enabled, Intelligent-Tiering will automatically move objects that
     * haven’t been accessed for a minimum of 90 days to the Archive Access tier.
     *
     * @default Objects will not move to Glacier
     */
    readonly archiveAccessTierTime?: Duration;
    /**
     * When enabled, Intelligent-Tiering will automatically move objects that
     * haven’t been accessed for a minimum of 180 days to the Deep Archive Access
     * tier.
     *
     * @default Objects will not move to Glacier Deep Access
     */
    readonly deepArchiveAccessTierTime?: Duration;
}
export interface BucketProps {
    /**
     * The kind of server-side encryption to apply to this bucket.
     *
     * If you choose KMS, you can specify a KMS key via `encryptionKey`. If
     * encryption key is not specified, a key will automatically be created.
     *
     * @default - `Kms` if `encryptionKey` is specified, or `Unencrypted` otherwise.
     */
    readonly encryption?: BucketEncryption;
    /**
     * External KMS key to use for bucket encryption.
     *
     * The 'encryption' property must be either not specified or set to "Kms".
     * An error will be emitted if encryption is set to "Unencrypted" or
     * "Managed".
     *
     * @default - If encryption is set to "Kms" and this property is undefined,
     * a new KMS key will be created and associated with this bucket.
     */
    readonly encryptionKey?: kms.IKey;
    /**
    * Enforces SSL for requests. S3.5 of the AWS Foundational Security Best Practices Regarding S3.
    * @see https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-ssl-requests-only.html
    *
    * @default false
    */
    readonly enforceSSL?: boolean;
    /**
     * Whether Amazon S3 should use its own intermediary key to generate data keys.
     *
     * Only relevant when using KMS for encryption.
     *
     * - If not enabled, every object GET and PUT will cause an API call to KMS (with the
     *   attendant cost implications of that).
     * - If enabled, S3 will use its own time-limited key instead.
     *
     * Only relevant, when Encryption is set to `BucketEncryption.KMS` or `BucketEncryption.KMS_MANAGED`.
     *
     * @default - false
     */
    readonly bucketKeyEnabled?: boolean;
    /**
     * Physical name of this bucket.
     *
     * @default - Assigned by CloudFormation (recommended).
     */
    readonly bucketName?: string;
    /**
     * Policy to apply when the bucket is removed from this stack.
     *
     * @default - The bucket will be orphaned.
     */
    readonly removalPolicy?: RemovalPolicy;
    /**
     * Whether all objects should be automatically deleted when the bucket is
     * removed from the stack or when the stack is deleted.
     *
     * Requires the `removalPolicy` to be set to `RemovalPolicy.DESTROY`.
     *
     * **Warning** if you have deployed a bucket with `autoDeleteObjects: true`,
     * switching this to `false` in a CDK version *before* `1.126.0` will lead to
     * all objects in the bucket being deleted. Be sure to update your bucket resources
     * by deploying with CDK version `1.126.0` or later **before** switching this value to `false`.
     *
     * @default false
     */
    readonly autoDeleteObjects?: boolean;
    /**
     * Whether this bucket should have versioning turned on or not.
     *
     * @default false (unless object lock is enabled, then true)
     */
    readonly versioned?: boolean;
    /**
     * Enable object lock on the bucket.
     *
     * Enabling object lock for existing buckets is not supported. Object lock must be
     * enabled when the bucket is created.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html#object-lock-bucket-config-enable
     *
     * @default false, unless objectLockDefaultRetention is set (then, true)
     */
    readonly objectLockEnabled?: boolean;
    /**
     * The default retention mode and rules for S3 Object Lock.
     *
     * Default retention can be configured after a bucket is created if the bucket already
     * has object lock enabled. Enabling object lock for existing buckets is not supported.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html#object-lock-bucket-config-enable
     *
     * @default no default retention period
     */
    readonly objectLockDefaultRetention?: ObjectLockRetention;
    /**
     * Whether this bucket should send notifications to Amazon EventBridge or not.
     *
     * @default false
     */
    readonly eventBridgeEnabled?: boolean;
    /**
     * Rules that define how Amazon S3 manages objects during their lifetime.
     *
     * @default - No lifecycle rules.
     */
    readonly lifecycleRules?: LifecycleRule[];
    /**
     * The name of the index document (e.g. "index.html") for the website. Enables static website
     * hosting for this bucket.
     *
     * @default - No index document.
     */
    readonly websiteIndexDocument?: string;
    /**
     * The name of the error document (e.g. "404.html") for the website.
     * `websiteIndexDocument` must also be set if this is set.
     *
     * @default - No error document.
     */
    readonly websiteErrorDocument?: string;
    /**
     * Specifies the redirect behavior of all requests to a website endpoint of a bucket.
     *
     * If you specify this property, you can't specify "websiteIndexDocument", "websiteErrorDocument" nor , "websiteRoutingRules".
     *
     * @default - No redirection.
     */
    readonly websiteRedirect?: RedirectTarget;
    /**
     * Rules that define when a redirect is applied and the redirect behavior
     *
     * @default - No redirection rules.
     */
    readonly websiteRoutingRules?: RoutingRule[];
    /**
     * Specifies a canned ACL that grants predefined permissions to the bucket.
     *
     * @default BucketAccessControl.PRIVATE
     */
    readonly accessControl?: BucketAccessControl;
    /**
     * Grants public read access to all objects in the bucket.
     * Similar to calling `bucket.grantPublicAccess()`
     *
     * @default false
     */
    readonly publicReadAccess?: boolean;
    /**
     * The block public access configuration of this bucket.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/access-control-block-public-access.html
     *
     *
     * @default - CloudFormation defaults will apply. New buckets and objects don't allow public access, but users can modify bucket policies or object permissions to allow public access
     */
    readonly blockPublicAccess?: BlockPublicAccess;
    /**
     * The metrics configuration of this bucket.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-metricsconfiguration.html
     *
     * @default - No metrics configuration.
     */
    readonly metrics?: BucketMetrics[];
    /**
     * The CORS configuration of this bucket.
     *
     * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-cors.html
     *
     * @default - No CORS configuration.
     */
    readonly cors?: CorsRule[];
    /**
     * Destination bucket for the server access logs.
     * @default - If "serverAccessLogsPrefix" undefined - access logs disabled, otherwise - log to current bucket.
     */
    readonly serverAccessLogsBucket?: IBucket;
    /**
     * Optional log file prefix to use for the bucket's access logs.
     * If defined without "serverAccessLogsBucket", enables access logs to current bucket with this prefix.
     * @default - No log file prefix
     */
    readonly serverAccessLogsPrefix?: string;
    /**
     * The inventory configuration of the bucket.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-inventory.html
     *
     * @default - No inventory configuration
     */
    readonly inventories?: Inventory[];
    /**
     * The objectOwnership of the bucket.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/about-object-ownership.html
     *
     * @default - No ObjectOwnership configuration, uploading account will own the object.
     *
     */
    readonly objectOwnership?: ObjectOwnership;
    /**
     * Whether this bucket should have transfer acceleration turned on or not.
     *
     * @default false
     */
    readonly transferAcceleration?: boolean;
    /**
     * The role to be used by the notifications handler
     *
     * @default - a new role will be created.
     */
    readonly notificationsHandlerRole?: iam.IRole;
    /**
     * Inteligent Tiering Configurations
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/intelligent-tiering.html
     *
     * @default No Intelligent Tiiering Configurations.
     */
    readonly intelligentTieringConfigurations?: IntelligentTieringConfiguration[];
}
/**
 * Tag
 */
export interface Tag {
    /**
     * key to e tagged
     */
    readonly key: string;
    /**
     * additional value
     */
    readonly value: string;
}
/**
 * An S3 bucket with associated policy objects
 *
 * This bucket does not yet have all features that exposed by the underlying
 * BucketResource.
 *
 * @example
 *
 * new Bucket(scope, 'Bucket', {
 *   blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
 *   encryption: BucketEncryption.S3_MANAGED,
 *   enforceSSL: true,
 *   versioned: true,
 *   removalPolicy: RemovalPolicy.RETAIN,
 * });
 *
 */
export declare class Bucket extends BucketBase {
    static fromBucketArn(scope: Construct, id: string, bucketArn: string): IBucket;
    static fromBucketName(scope: Construct, id: string, bucketName: string): IBucket;
    /**
     * Creates a Bucket construct that represents an external bucket.
     *
     * @param scope The parent creating construct (usually `this`).
     * @param id The construct's name.
     * @param attrs A `BucketAttributes` object. Can be obtained from a call to
     * `bucket.export()` or manually created.
     */
    static fromBucketAttributes(scope: Construct, id: string, attrs: BucketAttributes): IBucket;
    /**
     * Create a mutable `IBucket` based on a low-level `CfnBucket`.
     */
    static fromCfnBucket(cfnBucket: CfnBucket): IBucket;
    /**
     * Thrown an exception if the given bucket name is not valid.
     *
     * @param physicalName name of the bucket.
     */
    static validateBucketName(physicalName: string): void;
    readonly bucketArn: string;
    readonly bucketName: string;
    readonly bucketDomainName: string;
    readonly bucketWebsiteUrl: string;
    readonly bucketWebsiteDomainName: string;
    readonly bucketDualStackDomainName: string;
    readonly bucketRegionalDomainName: string;
    readonly encryptionKey?: kms.IKey;
    readonly isWebsite?: boolean;
    policy?: BucketPolicy;
    protected autoCreatePolicy: boolean;
    protected disallowPublicAccess?: boolean;
    private accessControl?;
    private readonly lifecycleRules;
    private readonly eventBridgeEnabled?;
    private readonly metrics;
    private readonly cors;
    private readonly inventories;
    private readonly _resource;
    constructor(scope: Construct, id: string, props?: BucketProps);
    /**
     * Add a lifecycle rule to the bucket
     *
     * @param rule The rule to add
     */
    addLifecycleRule(rule: LifecycleRule): void;
    /**
     * Adds a metrics configuration for the CloudWatch request metrics from the bucket.
     *
     * @param metric The metric configuration to add
     */
    addMetric(metric: BucketMetrics): void;
    /**
     * Adds a cross-origin access configuration for objects in an Amazon S3 bucket
     *
     * @param rule The CORS configuration rule to add
     */
    addCorsRule(rule: CorsRule): void;
    /**
     * Add an inventory configuration.
     *
     * @param inventory configuration to add
     */
    addInventory(inventory: Inventory): void;
    /**
     * Adds an iam statement to enforce SSL requests only.
     */
    private enforceSSLStatement;
    /**
     * Set up key properties and return the Bucket encryption property from the
     * user's configuration.
     */
    private parseEncryption;
    /**
     * Parse the lifecycle configuration out of the bucket props
     * @param props Par
     */
    private parseLifecycleConfiguration;
    private parseServerAccessLogs;
    private parseMetricConfiguration;
    private parseCorsConfiguration;
    private parseTagFilters;
    private parseOwnershipControls;
    private parseTieringConfig;
    private parseObjectLockConfig;
    private renderWebsiteConfiguration;
    /**
     * Allows Log Delivery to the S3 bucket, using a Bucket Policy if the relevant feature
     * flag is enabled, otherwise the canned ACL is used.
     *
     * If log delivery is to be allowed using the ACL and an ACL has already been set, this fails.
     *
     * @see
     * https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html
     */
    private allowLogDelivery;
    private parseInventoryConfiguration;
    private enableAutoDeleteObjects;
}
/**
 * What kind of server-side encryption to apply to this bucket
 */
export declare enum BucketEncryption {
    /**
     * Objects in the bucket are not encrypted.
     */
    UNENCRYPTED = "UNENCRYPTED",
    /**
     * Server-side KMS encryption with a master key managed by KMS.
     */
    KMS_MANAGED = "KMS_MANAGED",
    /**
     * Server-side encryption with a master key managed by S3.
     */
    S3_MANAGED = "S3_MANAGED",
    /**
     * Server-side encryption with a KMS key managed by the user.
     * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
     */
    KMS = "KMS"
}
/**
 * Notification event types.
 * @link https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-event-types-and-destinations.html#supported-notification-event-types
 */
export declare enum EventType {
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    OBJECT_CREATED = "s3:ObjectCreated:*",
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    OBJECT_CREATED_PUT = "s3:ObjectCreated:Put",
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    OBJECT_CREATED_POST = "s3:ObjectCreated:Post",
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    OBJECT_CREATED_COPY = "s3:ObjectCreated:Copy",
    /**
     * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
     * these event types, you can enable notification when an object is created
     * using a specific API, or you can use the s3:ObjectCreated:* event type to
     * request notification regardless of the API that was used to create an
     * object.
     */
    OBJECT_CREATED_COMPLETE_MULTIPART_UPLOAD = "s3:ObjectCreated:CompleteMultipartUpload",
    /**
     * By using the ObjectRemoved event types, you can enable notification when
     * an object or a batch of objects is removed from a bucket.
     *
     * You can request notification when an object is deleted or a versioned
     * object is permanently deleted by using the s3:ObjectRemoved:Delete event
     * type. Or you can request notification when a delete marker is created for
     * a versioned object by using s3:ObjectRemoved:DeleteMarkerCreated. For
     * information about deleting versioned objects, see Deleting Object
     * Versions. You can also use a wildcard s3:ObjectRemoved:* to request
     * notification anytime an object is deleted.
     *
     * You will not receive event notifications from automatic deletes from
     * lifecycle policies or from failed operations.
     */
    OBJECT_REMOVED = "s3:ObjectRemoved:*",
    /**
     * By using the ObjectRemoved event types, you can enable notification when
     * an object or a batch of objects is removed from a bucket.
     *
     * You can request notification when an object is deleted or a versioned
     * object is permanently deleted by using the s3:ObjectRemoved:Delete event
     * type. Or you can request notification when a delete marker is created for
     * a versioned object by using s3:ObjectRemoved:DeleteMarkerCreated. For
     * information about deleting versioned objects, see Deleting Object
     * Versions. You can also use a wildcard s3:ObjectRemoved:* to request
     * notification anytime an object is deleted.
     *
     * You will not receive event notifications from automatic deletes from
     * lifecycle policies or from failed operations.
     */
    OBJECT_REMOVED_DELETE = "s3:ObjectRemoved:Delete",
    /**
     * By using the ObjectRemoved event types, you can enable notification when
     * an object or a batch of objects is removed from a bucket.
     *
     * You can request notification when an object is deleted or a versioned
     * object is permanently deleted by using the s3:ObjectRemoved:Delete event
     * type. Or you can request notification when a delete marker is created for
     * a versioned object by using s3:ObjectRemoved:DeleteMarkerCreated. For
     * information about deleting versioned objects, see Deleting Object
     * Versions. You can also use a wildcard s3:ObjectRemoved:* to request
     * notification anytime an object is deleted.
     *
     * You will not receive event notifications from automatic deletes from
     * lifecycle policies or from failed operations.
     */
    OBJECT_REMOVED_DELETE_MARKER_CREATED = "s3:ObjectRemoved:DeleteMarkerCreated",
    /**
     * Using restore object event types you can receive notifications for
     * initiation and completion when restoring objects from the S3 Glacier
     * storage class.
     *
     * You use s3:ObjectRestore:Post to request notification of object restoration
     * initiation.
     */
    OBJECT_RESTORE_POST = "s3:ObjectRestore:Post",
    /**
     * Using restore object event types you can receive notifications for
     * initiation and completion when restoring objects from the S3 Glacier
     * storage class.
     *
     * You use s3:ObjectRestore:Completed to request notification of
     * restoration completion.
     */
    OBJECT_RESTORE_COMPLETED = "s3:ObjectRestore:Completed",
    /**
     * Using restore object event types you can receive notifications for
     * initiation and completion when restoring objects from the S3 Glacier
     * storage class.
     *
     * You use s3:ObjectRestore:Delete to request notification of
     * restoration completion.
     */
    OBJECT_RESTORE_DELETE = "s3:ObjectRestore:Delete",
    /**
     * You can use this event type to request Amazon S3 to send a notification
     * message when Amazon S3 detects that an object of the RRS storage class is
     * lost.
     */
    REDUCED_REDUNDANCY_LOST_OBJECT = "s3:ReducedRedundancyLostObject",
    /**
     * You receive this notification event when an object that was eligible for
     * replication using Amazon S3 Replication Time Control failed to replicate.
     */
    REPLICATION_OPERATION_FAILED_REPLICATION = "s3:Replication:OperationFailedReplication",
    /**
     * You receive this notification event when an object that was eligible for
     * replication using Amazon S3 Replication Time Control exceeded the 15-minute
     * threshold for replication.
     */
    REPLICATION_OPERATION_MISSED_THRESHOLD = "s3:Replication:OperationMissedThreshold",
    /**
     * You receive this notification event for an object that was eligible for
     * replication using the Amazon S3 Replication Time Control feature replicated
     * after the 15-minute threshold.
     */
    REPLICATION_OPERATION_REPLICATED_AFTER_THRESHOLD = "s3:Replication:OperationReplicatedAfterThreshold",
    /**
     * You receive this notification event for an object that was eligible for
     * replication using Amazon S3 Replication Time Control but is no longer tracked
     * by replication metrics.
     */
    REPLICATION_OPERATION_NOT_TRACKED = "s3:Replication:OperationNotTracked",
    /**
     * By using the LifecycleExpiration event types, you can receive a notification
     * when Amazon S3 deletes an object based on your S3 Lifecycle configuration.
     */
    LIFECYCLE_EXPIRATION = "s3:LifecycleExpiration:*",
    /**
     * The s3:LifecycleExpiration:Delete event type notifies you when an object
     * in an unversioned bucket is deleted.
     * It also notifies you when an object version is permanently deleted by an
     * S3 Lifecycle configuration.
     */
    LIFECYCLE_EXPIRATION_DELETE = "s3:LifecycleExpiration:Delete",
    /**
     * The s3:LifecycleExpiration:DeleteMarkerCreated event type notifies you
     * when S3 Lifecycle creates a delete marker when a current version of an
     * object in versioned bucket is deleted.
     */
    LIFECYCLE_EXPIRATION_DELETE_MARKER_CREATED = "s3:LifecycleExpiration:DeleteMarkerCreated",
    /**
     * You receive this notification event when an object is transitioned to
     * another Amazon S3 storage class by an S3 Lifecycle configuration.
     */
    LIFECYCLE_TRANSITION = "s3:LifecycleTransition",
    /**
     * You receive this notification event when an object within the
     * S3 Intelligent-Tiering storage class moved to the Archive Access tier or
     * Deep Archive Access tier.
     */
    INTELLIGENT_TIERING = "s3:IntelligentTiering",
    /**
     * By using the ObjectTagging event types, you can enable notification when
     * an object tag is added or deleted from an object.
     */
    OBJECT_TAGGING = "s3:ObjectTagging:*",
    /**
     * The s3:ObjectTagging:Put event type notifies you when a tag is PUT on an
     * object or an existing tag is updated.
  
     */
    OBJECT_TAGGING_PUT = "s3:ObjectTagging:Put",
    /**
     * The s3:ObjectTagging:Delete event type notifies you when a tag is removed
     * from an object.
     */
    OBJECT_TAGGING_DELETE = "s3:ObjectTagging:Delete",
    /**
     * You receive this notification event when an ACL is PUT on an object or when
     * an existing ACL is changed.
     * An event is not generated when a request results in no change to an
     * object’s ACL.
     */
    OBJECT_ACL_PUT = "s3:ObjectAcl:Put"
}
export interface NotificationKeyFilter {
    /**
     * S3 keys must have the specified prefix.
     */
    readonly prefix?: string;
    /**
     * S3 keys must have the specified suffix.
     */
    readonly suffix?: string;
}
/**
 * Options for the onCloudTrailPutObject method
 */
export interface OnCloudTrailBucketEventOptions extends events.OnEventOptions {
    /**
     * Only watch changes to these object paths
     *
     * @default - Watch changes to all objects
     */
    readonly paths?: string[];
}
/**
 * Default bucket access control types.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html
 */
export declare enum BucketAccessControl {
    /**
     * Owner gets FULL_CONTROL. No one else has access rights.
     */
    PRIVATE = "Private",
    /**
     * Owner gets FULL_CONTROL. The AllUsers group gets READ access.
     */
    PUBLIC_READ = "PublicRead",
    /**
     * Owner gets FULL_CONTROL. The AllUsers group gets READ and WRITE access.
     * Granting this on a bucket is generally not recommended.
     */
    PUBLIC_READ_WRITE = "PublicReadWrite",
    /**
     * Owner gets FULL_CONTROL. The AuthenticatedUsers group gets READ access.
     */
    AUTHENTICATED_READ = "AuthenticatedRead",
    /**
     * The LogDelivery group gets WRITE and READ_ACP permissions on the bucket.
     * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerLogs.html
     */
    LOG_DELIVERY_WRITE = "LogDeliveryWrite",
    /**
     * Object owner gets FULL_CONTROL. Bucket owner gets READ access.
     * If you specify this canned ACL when creating a bucket, Amazon S3 ignores it.
     */
    BUCKET_OWNER_READ = "BucketOwnerRead",
    /**
     * Both the object owner and the bucket owner get FULL_CONTROL over the object.
     * If you specify this canned ACL when creating a bucket, Amazon S3 ignores it.
     */
    BUCKET_OWNER_FULL_CONTROL = "BucketOwnerFullControl",
    /**
     * Owner gets FULL_CONTROL. Amazon EC2 gets READ access to GET an Amazon Machine Image (AMI) bundle from Amazon S3.
     */
    AWS_EXEC_READ = "AwsExecRead"
}
export interface RoutingRuleCondition {
    /**
     * The HTTP error code when the redirect is applied
     *
     * In the event of an error, if the error code equals this value, then the specified redirect is applied.
     *
     * If both condition properties are specified, both must be true for the redirect to be applied.
     *
     * @default - The HTTP error code will not be verified
     */
    readonly httpErrorCodeReturnedEquals?: string;
    /**
     * The object key name prefix when the redirect is applied
     *
     * If both condition properties are specified, both must be true for the redirect to be applied.
     *
     * @default - The object key name will not be verified
     */
    readonly keyPrefixEquals?: string;
}
export declare class ReplaceKey {
    readonly withKey?: string | undefined;
    readonly prefixWithKey?: string | undefined;
    /**
     * The specific object key to use in the redirect request
     */
    static with(keyReplacement: string): ReplaceKey;
    /**
     * The object key prefix to use in the redirect request
     */
    static prefixWith(keyReplacement: string): ReplaceKey;
    private constructor();
}
/**
 * Rule that define when a redirect is applied and the redirect behavior.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html
 */
export interface RoutingRule {
    /**
     * The host name to use in the redirect request
     *
     * @default - The host name used in the original request.
     */
    readonly hostName?: string;
    /**
     * The HTTP redirect code to use on the response
     *
     * @default "301" - Moved Permanently
     */
    readonly httpRedirectCode?: string;
    /**
     * Protocol to use when redirecting requests
     *
     * @default - The protocol used in the original request.
     */
    readonly protocol?: RedirectProtocol;
    /**
     * Specifies the object key prefix to use in the redirect request
     *
     * @default - The key will not be replaced
     */
    readonly replaceKey?: ReplaceKey;
    /**
     * Specifies a condition that must be met for the specified redirect to apply.
     *
     * @default - No condition
     */
    readonly condition?: RoutingRuleCondition;
}
/**
 * Modes in which S3 Object Lock retention can be configured.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html#object-lock-retention-modes
 */
export declare enum ObjectLockMode {
    /**
     * The Governance retention mode.
     *
     * With governance mode, you protect objects against being deleted by most users, but you can
     * still grant some users permission to alter the retention settings or delete the object if
     * necessary. You can also use governance mode to test retention-period settings before
     * creating a compliance-mode retention period.
     */
    GOVERNANCE = "GOVERNANCE",
    /**
     * The Compliance retention mode.
     *
     * When an object is locked in compliance mode, its retention mode can't be changed, and
     * its retention period can't be shortened. Compliance mode helps ensure that an object
     * version can't be overwritten or deleted for the duration of the retention period.
     */
    COMPLIANCE = "COMPLIANCE"
}
/**
 * The default retention settings for an S3 Object Lock configuration.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html
 */
export declare class ObjectLockRetention {
    /**
     * Configure for Governance retention for a specified duration.
     *
     * With governance mode, you protect objects against being deleted by most users, but you can
     * still grant some users permission to alter the retention settings or delete the object if
     * necessary. You can also use governance mode to test retention-period settings before
     * creating a compliance-mode retention period.
     *
     * @param duration the length of time for which objects should retained
     * @returns the ObjectLockRetention configuration
     */
    static governance(duration: Duration): ObjectLockRetention;
    /**
     * Configure for Compliance retention for a specified duration.
     *
     * When an object is locked in compliance mode, its retention mode can't be changed, and
     * its retention period can't be shortened. Compliance mode helps ensure that an object
     * version can't be overwritten or deleted for the duration of the retention period.
     *
     * @param duration the length of time for which objects should be retained
     * @returns the ObjectLockRetention configuration
     */
    static compliance(duration: Duration): ObjectLockRetention;
    /**
     * The default period for which objects should be retained.
     */
    readonly duration: Duration;
    /**
     * The retention mode to use for the object lock configuration.
     *
     * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-overview.html#object-lock-retention-modes
     */
    readonly mode: ObjectLockMode;
    private constructor();
}
/**
 * Options for creating Virtual-Hosted style URL.
 */
export interface VirtualHostedStyleUrlOptions {
    /**
     * Specifies the URL includes the region.
     *
     * @default - true
     */
    readonly regional?: boolean;
}
/**
 * Options for creating a Transfer Acceleration URL.
 */
export interface TransferAccelerationUrlOptions {
    /**
     * Dual-stack support to connect to the bucket over IPv6.
     *
     * @default - false
     */
    readonly dualStack?: boolean;
}
