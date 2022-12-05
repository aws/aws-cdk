import { Duration } from '@aws-cdk/core';

/**
 * Declaration of a Life cycle rule
 */
export interface LifecycleRule {
  /**
   * A unique identifier for this rule. The value cannot be more than 255 characters.
   */
  readonly id?: string;

  /**
   * Whether this rule is enabled.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * Specifies a lifecycle rule that aborts incomplete multipart uploads to an Amazon S3 bucket.
   *
   * The AbortIncompleteMultipartUpload property type creates a lifecycle
   * rule that aborts incomplete multipart uploads to an Amazon S3 bucket.
   * When Amazon S3 aborts a multipart upload, it deletes all parts
   * associated with the multipart upload.
   *
   * The underlying configuration is expressed in whole numbers of days. Providing a Duration that
   * does not represent a whole number of days will result in a runtime or deployment error.
   *
   * @default - Incomplete uploads are never aborted
   */
  readonly abortIncompleteMultipartUploadAfter?: Duration;

  /**
   * Indicates when objects are deleted from Amazon S3 and Amazon Glacier.
   *
   * The date value must be in ISO 8601 format. The time is always midnight UTC.
   *
   * If you specify an expiration and transition time, you must use the same
   * time unit for both properties (either in days or by date). The
   * expiration time must also be later than the transition time.
   *
   * @default - No expiration date
   */
  readonly expirationDate?: Date;

  /**
   * Indicates the number of days after creation when objects are deleted from Amazon S3 and Amazon Glacier.
   *
   * If you specify an expiration and transition time, you must use the same
   * time unit for both properties (either in days or by date). The
   * expiration time must also be later than the transition time.
   *
   * The underlying configuration is expressed in whole numbers of days. Providing a Duration that
   * does not represent a whole number of days will result in a runtime or deployment error.
   *
   * @default - No expiration timeout
   */
  readonly expiration?: Duration;

  /**
   * Time between when a new version of the object is uploaded to the bucket and when old versions of the object expire.
   *
   * For buckets with versioning enabled (or suspended), specifies the time,
   * in days, between when a new version of the object is uploaded to the
   * bucket and when old versions of the object expire. When object versions
   * expire, Amazon S3 permanently deletes them. If you specify a transition
   * and expiration time, the expiration time must be later than the
   * transition time.
   *
   * The underlying configuration is expressed in whole numbers of days. Providing a Duration that
   * does not represent a whole number of days will result in a runtime or deployment error.
   *
   * @default - No noncurrent version expiration
   */
  readonly noncurrentVersionExpiration?: Duration;

  /**
   * Indicates a maximum number of noncurrent versions to retain.
   *
   * If there are this many more noncurrent versions,
   * Amazon S3 permanently deletes them.
   *
   * @default - No noncurrent versions to retain
   */
  readonly noncurrentVersionsToRetain?: number;

  /**
   * One or more transition rules that specify when non-current objects transition to a specified storage class.
   *
   * Only for for buckets with versioning enabled (or suspended).
   *
   * If you specify a transition and expiration time, the expiration time
   * must be later than the transition time.
   */
  readonly noncurrentVersionTransitions?: NoncurrentVersionTransition[];

  /**
   * One or more transition rules that specify when an object transitions to a specified storage class.
   *
   * If you specify an expiration and transition time, you must use the same
   * time unit for both properties (either in days or by date). The
   * expiration time must also be later than the transition time.
   *
   * @default - No transition rules
   */
  readonly transitions?: Transition[];

  /**
   * Object key prefix that identifies one or more objects to which this rule applies.
   *
   * @default - Rule applies to all objects
   */
  readonly prefix?: string;

  /**
   * The TagFilter property type specifies tags to use to identify a subset of objects for an Amazon S3 bucket.
   *
   * @default - Rule applies to all objects
   */
  readonly tagFilters?: {[tag: string]: any};

  /**
   * Indicates whether Amazon S3 will remove a delete marker with no noncurrent versions.
   * If set to true, the delete marker will be expired.
   *
   * @default false
   */
  readonly expiredObjectDeleteMarker?: boolean;

  /**
   * Specifies the maximum object size in bytes for this rule to apply to.
   *
   * @default - No rule
   */
  readonly objectSizeLessThan?: number;

  /** Specifies the minimum object size in bytes for this rule to apply to.
   *
   * @default - No rule
   */
  readonly objectSizeGreaterThan?: number;
}

/**
 * Describes when an object transitions to a specified storage class.
 */
export interface Transition {
  /**
   * The storage class to which you want the object to transition.
   */
  readonly storageClass: StorageClass;

  /**
   * Indicates when objects are transitioned to the specified storage class.
   *
   * The date value must be in ISO 8601 format. The time is always midnight UTC.
   *
   * @default - No transition date.
   */
  readonly transitionDate?: Date;

  /**
   * Indicates the number of days after creation when objects are transitioned to the specified storage class.
   *
   * @default - No transition count.
   */
  readonly transitionAfter?: Duration;
}

/**
 * Describes when noncurrent versions transition to a specified storage class.
 */
export interface NoncurrentVersionTransition {
  /**
   * The storage class to which you want the object to transition.
   */
  readonly storageClass: StorageClass;

  /**
   * Indicates the number of days after creation when objects are transitioned to the specified storage class.
   *
   * @default - No transition count.
   */
  readonly transitionAfter: Duration;

  /**
   * Indicates the number of noncurrent version objects to be retained. Can be up to 100 noncurrent versions retained.
   *
   * @default - No noncurrent version retained.
   */
  readonly noncurrentVersionsToRetain?: number;
}

/**
 * Storage class to move an object to
 */
export class StorageClass {
  /**
   * Storage class for data that is accessed less frequently, but requires rapid
   * access when needed.
   *
   * Has lower availability than Standard storage.
   */
  public static readonly INFREQUENT_ACCESS = new StorageClass('STANDARD_IA');

  /**
   * Infrequent Access that's only stored in one availability zone.
   *
   * Has lower availability than standard InfrequentAccess.
   */
  public static readonly ONE_ZONE_INFREQUENT_ACCESS = new StorageClass('ONEZONE_IA');

  /**
   * Storage class for long-term archival that can take between minutes and
   * hours to access.
   *
   * Use for archives where portions of the data might need to be retrieved in
   * minutes. Data stored in the GLACIER storage class has a minimum storage
   * duration period of 90 days and can be accessed in as little as 1-5 minutes
   * using expedited retrieval. If you delete an object before the 90-day
   * minimum, you are charged for 90 days.
   */
  public static readonly GLACIER = new StorageClass('GLACIER');

  /**
   * Storage class for long-term archival that can be accessed in a few milliseconds.
   *
   * It is ideal for data that is accessed once or twice per quarter, and
   * that requires immediate access. Data stored in the GLACIER_IR storage class
   * has a minimum storage duration period of 90 days and can be accessed in
   * as milliseconds. If you delete an object before the 90-day minimum,
   * you are charged for 90 days.
   */
  public static readonly GLACIER_INSTANT_RETRIEVAL = new StorageClass('GLACIER_IR');

  /**
   * Use for archiving data that rarely needs to be accessed. Data stored in the
   * DEEP_ARCHIVE storage class has a minimum storage duration period of 180
   * days and a default retrieval time of 12 hours. If you delete an object
   * before the 180-day minimum, you are charged for 180 days. For pricing
   * information, see Amazon S3 Pricing.
   */
  public static readonly DEEP_ARCHIVE = new StorageClass('DEEP_ARCHIVE');

  /**
   * The INTELLIGENT_TIERING storage class is designed to optimize storage costs
   * by automatically moving data to the most cost-effective storage access
   * tier, without performance impact or operational overhead.
   * INTELLIGENT_TIERING delivers automatic cost savings by moving data on a
   * granular object level between two access tiers, a frequent access tier and
   * a lower-cost infrequent access tier, when access patterns change. The
   * INTELLIGENT_TIERING storage class is ideal if you want to optimize storage
   * costs automatically for long-lived data when access patterns are unknown or
   * unpredictable.
   */
  public static readonly INTELLIGENT_TIERING = new StorageClass('INTELLIGENT_TIERING');

  constructor(public readonly value: string) { }

  public toString() { return this.value; }
}
