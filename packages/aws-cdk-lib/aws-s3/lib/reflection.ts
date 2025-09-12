import { Node } from 'constructs';
import { Bucket, EventType, IBucket, NotificationKeyFilter } from './bucket';
import { BucketPolicy } from './bucket-policy';
import { IBucketNotificationDestination } from './destination';
import { BucketNotifications } from './notifications-resource';
import { BucketReference, CfnBucket, IBucketRef } from './s3.generated';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';

/**
 * Common attributes of S3 buckets.
 */
export interface IBucketAttr extends IBucketRef {
  /**
   * The Domain name of the static website.
   * @attribute
   */
  readonly bucketWebsiteDomainName: string;

  /**
   * The URL of the static website.
   * @attribute
   */
  readonly bucketWebsiteUrl: string;

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
}

/**
 * High-level information about a bucket, that are derived from low-level
 * configuration, at synth time.
 */
export interface IBucketReflect extends IBucketAttr {
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
   * Role used to set up permissions on this bucket for replication
   */
  replicationRoleArn?: string;
}

/**
 * Collection of methods for modifying an instance of an IBucketReflect.
 */
export class BucketFactories {
  private notifications?: BucketNotifications;
  private _notificationsHandlerRole?: iam.IRole;
  private _notificationsSkipDestinationValidation?: boolean;

  /**
   * The role to be used by the notifications handler
   *
   * @default - a new role will be created.
   */
  public set notificationsHandlerRole(value: iam.IRole) {
    this._notificationsHandlerRole = value;
  }

  /**
   * Skips notification validation of Amazon SQS, Amazon SNS, and Lambda destinations.
   *
   * @default false
   */
  public set notificationsSkipDestinationValidation(value: boolean) {
    this._notificationsSkipDestinationValidation = value;
  }

  constructor(private readonly bucket: IBucketReflect) {
  }

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
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/notification-how-to-filtering.html
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
  public addEventNotification(event: EventType, dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
    this.withNotifications(notifications => notifications.addNotification(event, dest, ...filters));
  }

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
  public enableEventBridgeNotification() {
    this.withNotifications(notifications => notifications.enableEventBridgeNotification());
  }

  /**
   * Subscribes a destination to receive notifications when an object is
   * created in the bucket. This is identical to calling
   * `onEvent(EventType.OBJECT_CREATED)`.
   *
   * @param dest The notification destination (see onEvent)
   * @param filters Filters (see onEvent)
   */
  public addObjectCreatedNotification(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
    return this.addEventNotification(EventType.OBJECT_CREATED, dest, ...filters);
  }

  /**
   * Subscribes a destination to receive notifications when an object is
   * removed from the bucket. This is identical to calling
   * `onEvent(EventType.OBJECT_REMOVED)`.
   *
   * @param dest The notification destination (see onEvent)
   * @param filters Filters (see onEvent)
   */
  public addObjectRemovedNotification(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
    return this.addEventNotification(EventType.OBJECT_REMOVED, dest, ...filters);
  }

  private withNotifications(cb: (notifications: BucketNotifications) => void) {
    if (!this.notifications) {
      this.notifications = new BucketNotifications(this.bucket, 'Notifications', {
        bucket: this.bucket,
        handlerRole: this._notificationsHandlerRole,
        skipDestinationValidation: this._notificationsSkipDestinationValidation ?? false,
      });
    }
    cb(this.notifications);
  }
}

/**
 * Reflection utilities for CfnBucket.
 */
export class BucketReflector implements IBucketReflect {
  private readonly bucket: IBucket;
  constructor(cfnBucket: CfnBucket) {
    this.bucket = Bucket.fromCfnBucket(cfnBucket);
  }

  public get bucketDomainName(): string {
    return this.bucket.bucketDomainName;
  }

  public get bucketDualStackDomainName(): string {
    return this.bucket.bucketDualStackDomainName;
  }

  public get bucketRegionalDomainName(): string {
    return this.bucket.bucketRegionalDomainName;
  }

  public get bucketWebsiteDomainName(): string {
    return this.bucket.bucketWebsiteDomainName;
  }

  public get bucketWebsiteUrl(): string {
    return this.bucket.bucketWebsiteUrl;
  }

  public get node(): Node {
    return this.bucket.node;
  }

  public get bucketRef(): BucketReference {
    return this.bucket.bucketRef;
  }

  public get isWebsite(): boolean | undefined {
    return this.bucket.isWebsite ?? false;
  }

  public get encryptionKey(): kms.IKey | undefined {
    return this.bucket.encryptionKey;
  }

  public get policy(): BucketPolicy | undefined {
    return this.bucket.policy;
  }

  public set policy(value: BucketPolicy | undefined) {
    this.bucket.policy = value;
  }

  public get replicationRoleArn(): string | undefined {
    return this.bucket.replicationRoleArn;
  }

  public set replicationRoleArn(value: string | undefined) {
    this.bucket.replicationRoleArn = value;
  }
}
