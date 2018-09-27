/**
 * Declaration of a Life cycle rule
 */
export interface LifecycleRule {
  /**
   * A unique identifier for this rule. The value cannot be more than 255 characters.
   */
  id?: string;

  /**
   * Whether this rule is enabled.
   *
   * @default true
   */
  enabled?: boolean;

  /**
   * Specifies a lifecycle rule that aborts incomplete multipart uploads to an Amazon S3 bucket.
   *
   * The AbortIncompleteMultipartUpload property type creates a lifecycle
   * rule that aborts incomplete multipart uploads to an Amazon S3 bucket.
   * When Amazon S3 aborts a multipart upload, it deletes all parts
   * associated with the multipart upload.
   *
   * @default Incomplete uploads are never aborted
   */
  abortIncompleteMultipartUploadAfterDays?: number;

  /**
   * Indicates when objects are deleted from Amazon S3 and Amazon Glacier.
   *
   * The date value must be in ISO 8601 format. The time is always midnight UTC.
   *
   * If you specify an expiration and transition time, you must use the same
   * time unit for both properties (either in days or by date). The
   * expiration time must also be later than the transition time.
   *
   * @default No expiration date
   */
  expirationDate?: Date;

  /**
   * Indicates the number of days after creation when objects are deleted from Amazon S3 and Amazon Glacier.
   *
   * If you specify an expiration and transition time, you must use the same
   * time unit for both properties (either in days or by date). The
   * expiration time must also be later than the transition time.
   *
   * @default No expiration timeout
   */
  expirationInDays?: number;

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
   * @default No noncurrent version expiration
   */
  noncurrentVersionExpirationInDays?: number;

  /**
   * One or more transition rules that specify when non-current objects transition to a specified storage class.
   *
   * Only for for buckets with versioning enabled (or suspended).
   *
   * If you specify a transition and expiration time, the expiration time
   * must be later than the transition time.
   */
  noncurrentVersionTransitions?: NoncurrentVersionTransition[];

  /**
   * One or more transition rules that specify when an object transitions to a specified storage class.
   *
   * If you specify an expiration and transition time, you must use the same
   * time unit for both properties (either in days or by date). The
   * expiration time must also be later than the transition time.
   *
   * @default No transition rules
   */
  transitions?: Transition[];

  /**
   * Object key prefix that identifies one or more objects to which this rule applies.
   *
   * @default Rule applies to all objects
   */
  prefix?: string;

  /**
   * The TagFilter property type specifies tags to use to identify a subset of objects for an Amazon S3 bucket.
   *
   * @default Rule applies to all objects
   */
  tagFilters?: {[tag: string]: any};
}

/**
 * Describes when an object transitions to a specified storage class.
 */
export interface Transition {
  /**
   * The storage class to which you want the object to transition.
   */
  storageClass: StorageClass;

  /**
   * Indicates when objects are transitioned to the specified storage class.
   *
   * The date value must be in ISO 8601 format. The time is always midnight UTC.
   *
   * @default No transition date.
   */
  transitionDate?: Date;

  /**
   * Indicates the number of days after creation when objects are transitioned to the specified storage class.
   *
   * @default No transition count.
   */
  transitionInDays?: number;
}

/**
 * Describes when noncurrent versions transition to a specified storage class.
 */
export interface NoncurrentVersionTransition {
  /**
   * The storage class to which you want the object to transition.
   */
  storageClass: StorageClass;

  /**
   * Indicates the number of days after creation when objects are transitioned to the specified storage class.
   *
   * @default No transition count.
   */
  transitionInDays: number;
}

/**
 * Storage class to move an object to
 */
export enum StorageClass {
  /**
   * Storage class for data that is accessed less frequently, but requires rapid access when needed.
   *
   * Has lower availability than Standard storage.
   */
  InfrequentAccess = 'STANDARD_IA',

  /**
   * Infrequent Access that's only stored in one availability zone.
   *
   * Has lower availability than standard InfrequentAccess.
   */
  OneZoneInfrequentAccess = 'ONEZONE_IA',

  /**
   * Storage class for long-term archival that can take between minutes and hours to access.
   */
  Glacier = 'GLACIER'
}
