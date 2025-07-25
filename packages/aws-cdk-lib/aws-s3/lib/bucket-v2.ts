import { IConstruct } from 'constructs';
import { BucketProps, BucketEncryption, BlockPublicAccess, RedirectTarget, RoutingRule, TransitionDefaultMinimumObjectSize, ObjectLockRetention, IBucket, TargetObjectKeyFormat, CorsRule, Inventory, BucketMetrics, ReplicationRule, IntelligentTieringConfiguration, ObjectOwnership, BucketAccessControl } from './bucket';
import { Mixin } from './mixin';
import { LifecycleRule } from './rule';
import { CfnBucket } from './s3.generated';
import * as iam from '../../aws-iam';
import * as kms from '../../aws-kms';
import { Resource } from '../../core';
import { validateAllProps, ValidationRule } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';

export interface ICfnBucket extends IConstruct {
  readonly attrArn: string;
  readonly attrBucketName: string;
}

/**
 * Properties for the encryption mixin
 */
export interface EncryptionMixinProps {
  /**
   * The kind of server-side encryption to apply to this bucket
   *
   * @default - `KMS` if `encryptionKey` is specified, or `S3_MANAGED` otherwise.
   */
  readonly encryption?: BucketEncryption;

  /**
   * External KMS key to use for bucket encryption
   *
   * @default - If `encryption` is set to `KMS` and this property is undefined,
   * a new KMS key will be created and associated with this bucket.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Whether Amazon S3 should use its own intermediary key to generate data keys
   *
   * @default - false
   */
  readonly bucketKeyEnabled?: boolean;
}

/**
 * Properties for the public access mixin
 */
export interface PublicAccessMixinProps {
  /**
   * The block public access configuration of this bucket
   */
  readonly blockPublicAccess?: BlockPublicAccess;

  /**
   * Grants public read access to all objects in the bucket
   * @default false
   */
  readonly publicReadAccess?: boolean;
}

/**
 * Properties for the website mixin
 */
export interface WebsiteMixinProps {
  /**
   * The name of the index document for the website
   */
  readonly websiteIndexDocument?: string;

  /**
   * The name of the error document for the website
   */
  readonly websiteErrorDocument?: string;

  /**
   * Specifies the redirect behavior of all requests
   */
  readonly websiteRedirect?: RedirectTarget;

  /**
   * Rules that define when a redirect is applied and the redirect behavior
   */
  readonly websiteRoutingRules?: RoutingRule[];
}

/**
 * Properties for the lifecycle mixin
 */
export interface LifecycleMixinProps {
  /**
   * Rules that define how Amazon S3 manages objects during their lifetime
   */
  readonly lifecycleRules?: LifecycleRule[];

  /**
   * Indicates which default minimum object size behavior is applied to the lifecycle configuration
   */
  readonly transitionDefaultMinimumObjectSize?: TransitionDefaultMinimumObjectSize;
}

/**
 * Properties for the versioning mixin
 */
export interface VersioningMixinProps {
  /**
   * Whether this bucket should have versioning turned on or not
   */
  readonly versioned?: boolean;

  /**
   * Enable object lock on the bucket
   */
  readonly objectLockEnabled?: boolean;

  /**
   * The default retention mode and rules for S3 Object Lock
   */
  readonly objectLockDefaultRetention?: ObjectLockRetention;
}

/**
 * Properties for the logging mixin
 */
export interface LoggingMixinProps {
  /**
   * Destination bucket for the server access logs
   */
  readonly serverAccessLogsBucket?: IBucket;

  /**
   * Optional log file prefix to use for the bucket's access logs
   */
  readonly serverAccessLogsPrefix?: string;

  /**
   * Optional key format for log objects
   */
  readonly targetObjectKeyFormat?: TargetObjectKeyFormat;
}

/**
 * Properties for the notification mixin
 */
export interface NotificationMixinProps {
  /**
   * Whether this bucket should send notifications to Amazon EventBridge
   */
  readonly eventBridgeEnabled?: boolean;

  /**
   * The role to be used by the notifications handler
   */
  readonly notificationsHandlerRole?: iam.IRole;

  /**
   * Skips notification validation of destinations
   */
  readonly notificationsSkipDestinationValidation?: boolean;
}

/**
 * Properties for the CORS mixin
 */
export interface CORSMixinProps {
  /**
   * The CORS configuration of this bucket
   */
  readonly cors?: CorsRule[];
}

/**
 * Properties for the inventory mixin
 */
export interface InventoryMixinProps {
  /**
   * The inventory configuration of the bucket
   */
  readonly inventories?: Inventory[];
}

/**
 * Properties for the metrics mixin
 */
export interface MetricsMixinProps {
  /**
   * The metrics configuration of this bucket
   */
  readonly metrics?: BucketMetrics[];
}

/**
 * Properties for the replication mixin
 */
export interface ReplicationMixinProps {
  /**
   * The role to be used by the replication
   */
  readonly replicationRole?: iam.IRole;

  /**
   * A container for one or more replication rules
   */
  readonly replicationRules?: ReplicationRule[];
}

/**
 * Properties for the intelligent tiering mixin
 */
export interface IntelligentTieringMixinProps {
  /**
   * Intelligent Tiering Configurations
   */
  readonly intelligentTieringConfigurations?: IntelligentTieringConfiguration[];
}

/**
 * Properties for the ownership mixin
 */
export interface OwnershipMixinProps {
  /**
   * The objectOwnership of the bucket
   */
  readonly objectOwnership?: ObjectOwnership;

  /**
   * Specifies a canned ACL that grants predefined permissions to the bucket
   */
  readonly accessControl?: BucketAccessControl;
}

/**
 * Properties for the transfer acceleration mixin
 */
export interface TransferAccelerationMixinProps {
  /**
   * Whether this bucket should have transfer acceleration turned on or not
   */
  readonly transferAcceleration?: boolean;
}

/**
 * Properties for the secure access mixin
 */
export interface SecureAccessMixinProps {
  /**
   * Enforces SSL for requests
   */
  readonly enforceSSL?: boolean;

  /**
   * Enforces minimum TLS version for requests
   */
  readonly minimumTLSVersion?: number;
}

/**
 * Configuration for S3 analytics
 */
export interface AnalyticsConfig {
  /**
   * The ID that identifies the analytics configuration
   */
  readonly id: string;

  /**
   * The prefix that an object must have to be included in the analytics results
   * @default - all objects
   */
  readonly prefix?: string;

  /**
   * The tags to use when evaluating an analytics filter
   * @default - no tag filters
   */
  readonly tagFilters?: { [key: string]: string };

  /**
   * Contains data related to access patterns to be collected and made available to analyze the tradeoffs between different storage classes
   * @default - analytics data is not exported
   */
  readonly storageClassAnalysis?: {
    /**
     * Specifies how data related to the storage class analysis for an Amazon S3 bucket should be exported
     */
    readonly dataExport?: {
      /**
       * The place to store the data for an analysis
       */
      readonly destination: IBucket;

      /**
       * The prefix to use when exporting data
       * @default - no prefix
       */
      readonly prefix?: string;

      /**
       * The file format used when exporting data to Amazon S3
       * @default 'CSV'
       */
      readonly format?: 'CSV';
    };
  };
}

/**
 * Properties for the analytics mixin
 */
export interface AnalyticsMixinProps {
  /**
   * Analytics configurations for the bucket
   */
  readonly analytics?: AnalyticsConfig[];
}

/**
 * Properties for the auto-delete objects mixin
 */
export interface AutoDeleteObjectsMixinProps {
  /**
   * Whether all objects should be automatically deleted when the bucket is removed from the stack
   * @default false
   */
  readonly autoDeleteObjects?: boolean;
}

/**
 * Configuration for journal table record expiration
 */
export interface JournalTableExpiration {
  /**
   * Whether expiration is enabled
   * @default false
   */
  readonly enabled?: boolean;

  /**
   * Number of days after which journal records expire
   * Must be between 1 and 36500 days
   */
  readonly days?: number;
}

/**
 * Configuration for S3 metadata tables
 */
export interface MetadataConfig {
  /**
   * Journal table configuration (required)
   * Captures events that occur for objects in the bucket in near real-time
   */
  readonly journalTable: {
    /**
     * Configuration for journal table record expiration
     * @default - records do not expire
     */
    readonly recordExpiration?: JournalTableExpiration;
  };

  /**
   * Live inventory table configuration (optional)
   * Provides a queryable inventory of all objects and their versions
   * @default - no live inventory table
   */
  readonly inventoryTable?: {
    /**
     * Whether to enable the live inventory table
     * Note: Enabling this will trigger a backfilling process and may incur additional charges
     * @default false
     */
    readonly enabled: boolean;
  };

  /**
   * Custom KMS key for encrypting metadata tables
   * @default - AWS managed encryption
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Properties for the metadata mixin
 */
export interface MetadataMixinProps {
  /**
   * Enable S3 Metadata for accelerated data discovery
   * Creates read-only Apache Iceberg tables that can be queried with AWS analytics services
   */
  readonly metadata?: MetadataConfig;
}

/**
 * Setup bucket encryption.
 *
 * @todo how to expose encryptionKey?
 */
export class EncryptionMixin implements Mixin<CfnBucket, CfnBucket, EncryptionMixinProps> {
  /**
   * The encryption properties for this mixin
   */
  private readonly props: EncryptionMixinProps;

  /**
   * Creates a new EncryptionMixin
   * @param props - The encryption properties
   */
  constructor(props: EncryptionMixinProps) {
    this.props = props;
  }

  /**
   * Validates the encryption properties for this mixin
   */
  public get validations(): ValidationRule<EncryptionMixinProps>[] {
    return [
      {
        condition: (props) => Boolean(props.encryptionKey && props.encryption !== BucketEncryption.KMS),
        message: (props) => `encryptionKey is specified, but encryption is not set to KMS (value: ${props.encryption})`,
      },
      {
        condition: (props) => Boolean(props.bucketKeyEnabled && props.encryption === BucketEncryption.UNENCRYPTED),
        message: (props) => `bucketKeyEnabled is specified, so 'encryption' must be set to KMS, DSSE or S3 (value: ${props.encryption})`,
      },
    ];
  }

  /**
   * Applies encryption configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    // default based on whether encryptionKey is specified
    let encryptionType = this.props.encryption;
    if (encryptionType == null) {
      encryptionType = this.props.encryptionKey ? BucketEncryption.KMS : BucketEncryption.UNENCRYPTED;
    }

    if (encryptionType === BucketEncryption.UNENCRYPTED) {
      resource.bucketEncryption = undefined;
      return resource;
    }

    if (encryptionType === BucketEncryption.KMS) {
      resource.bucketEncryption = {
        serverSideEncryptionConfiguration: [
          {
            bucketKeyEnabled: this.props.bucketKeyEnabled,
            serverSideEncryptionByDefault: {
              sseAlgorithm: 'aws:kms',
              kmsMasterKeyId: this.props.encryptionKey?.keyArn,
            },
          },
        ],
      };
      return resource;
    }

    if (encryptionType === BucketEncryption.S3_MANAGED) {
      resource.bucketEncryption = {
        serverSideEncryptionConfiguration: [
          {
            bucketKeyEnabled: this.props.bucketKeyEnabled,
            serverSideEncryptionByDefault: { sseAlgorithm: 'AES256' },
          },
        ],
      };
      return resource;
    }

    if (encryptionType === BucketEncryption.KMS_MANAGED) {
      resource.bucketEncryption = {
        serverSideEncryptionConfiguration: [
          {
            bucketKeyEnabled: this.props.bucketKeyEnabled,
            serverSideEncryptionByDefault: { sseAlgorithm: 'aws:kms' },
          },
        ],
      };
      return resource;
    }

    if (encryptionType === BucketEncryption.DSSE) {
      resource.bucketEncryption = {
        serverSideEncryptionConfiguration: [
          {
            bucketKeyEnabled: this.props.bucketKeyEnabled,
            serverSideEncryptionByDefault: {
              sseAlgorithm: 'aws:kms:dsse',
              kmsMasterKeyId: this.props.encryptionKey?.keyArn,
            },
          },
        ],
      };
      return resource;
    }

    if (encryptionType === BucketEncryption.DSSE_MANAGED) {
      resource.bucketEncryption = {
        serverSideEncryptionConfiguration: [
          {
            bucketKeyEnabled: this.props.bucketKeyEnabled,
            serverSideEncryptionByDefault: { sseAlgorithm: 'aws:kms:dsse' },
          },
        ],
      };
      return resource;
    }

    return resource;
  }
}

/**
 * Mixin for bucket public access configuration
 */
export class PublicAccessMixin implements Mixin<CfnBucket, CfnBucket, PublicAccessMixinProps> {
  /**
   * The public access properties for this mixin
   */
  private readonly props: PublicAccessMixinProps;

  /**
   * Validates the public access properties for this mixin
   */
  public get validations(): ValidationRule<PublicAccessMixinProps>[] {
    return [
      {
        condition: (props) => {
          if (!props.publicReadAccess) return false;
          return props.blockPublicAccess === undefined;
        },
        message: () => 'Cannot use \'publicReadAccess\' property on a bucket without allowing bucket-level public access through \'blockPublicAccess\' property.',
      },
    ];
  }

  /**
   * Creates a new PublicAccessMixin
   * @param props - The public access properties
   */
  constructor(props: PublicAccessMixinProps) {
    this.props = props;
  }

  /**
   * Applies public access configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket website configuration
 */
export class WebsiteMixin implements Mixin<CfnBucket, CfnBucket, WebsiteMixinProps> {
  /**
   * The website properties for this mixin
   */
  private readonly props: WebsiteMixinProps;

  /**
   * Creates a new WebsiteMixin
   * @param props - The website properties
   */
  constructor(props: WebsiteMixinProps) {
    this.props = props;
  }

  /**
   * Validates the website properties for this mixin
   */
  public get validations(): ValidationRule<WebsiteMixinProps>[] {
    return [
      {
        condition: (props) => Boolean(props.websiteErrorDocument && !props.websiteIndexDocument),
        message: () => '"websiteIndexDocument" is required if "websiteErrorDocument" is set',
      },
      {
        condition: (props) => Boolean(
          props.websiteRedirect
          && (props.websiteErrorDocument || props.websiteIndexDocument || props.websiteRoutingRules),
        ),
        message: () => '"websiteIndexDocument", "websiteErrorDocument" and, "websiteRoutingRules" cannot be set if "websiteRedirect" is used',
      },
    ];
  }

  /**
   * Applies website configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket lifecycle configuration
 */
export class LifecycleMixin implements Mixin<CfnBucket, CfnBucket, LifecycleMixinProps> {
  /**
   * The lifecycle properties for this mixin
   */
  private readonly props: LifecycleMixinProps;

  /**
   * Creates a new LifecycleMixin
   * @param props - The lifecycle properties
   */
  constructor(props: LifecycleMixinProps) {
    this.props = props;
  }

  /**
   * Validates the lifecycle properties for this mixin
   */
  public get validations(): ValidationRule<LifecycleMixinProps>[] {
    return [
      {
        condition: (props) => {
          if (!props.lifecycleRules) return false;
          return props.lifecycleRules.some(rule => {
            return rule.expiredObjectDeleteMarker &&
              (rule.expiration || rule.expirationDate || rule.tagFilters);
          });
        },
        message: () => 'ExpiredObjectDeleteMarker cannot be specified with expiration, ExpirationDate, or TagFilters.',
      },
      {
        condition: (props) => {
          if (!props.lifecycleRules) return false;
          return props.lifecycleRules.some(rule => {
            return rule.abortIncompleteMultipartUploadAfter === undefined &&
              rule.expiration === undefined &&
              rule.expirationDate === undefined &&
              rule.expiredObjectDeleteMarker === undefined &&
              rule.noncurrentVersionExpiration === undefined &&
              rule.noncurrentVersionsToRetain === undefined &&
              rule.noncurrentVersionTransitions === undefined &&
              rule.transitions === undefined;
          });
        },
        message: () => 'All rules for `lifecycleRules` must have at least one of the following properties: `abortIncompleteMultipartUploadAfter`, `expiration`, `expirationDate`, `expiredObjectDeleteMarker`, `noncurrentVersionExpiration`, `noncurrentVersionsToRetain`, `noncurrentVersionTransitions`, or `transitions`',
      },
      {
        condition: (props) => {
          if (!props.lifecycleRules) return false;
          return props.lifecycleRules.some(rule => {
            if (!rule.transitions) return false;
            return rule.transitions.some(transition => {
              const hasTransitionDate = transition.transitionDate !== undefined;
              const hasTransitionAfter = transition.transitionAfter !== undefined;
              return (!hasTransitionDate && !hasTransitionAfter) || (hasTransitionDate && hasTransitionAfter);
            });
          });
        },
        message: () => 'Exactly one of transitionDate or transitionAfter must be specified in lifecycle rule transition',
      },
    ];
  }

  /**
   * Applies lifecycle configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket versioning configuration
 */
export class VersioningMixin implements Mixin<CfnBucket, CfnBucket, VersioningMixinProps> {
  /**
   * The versioning properties for this mixin
   */
  private readonly props: VersioningMixinProps;

  /**
   * Creates a new VersioningMixin
   * @param props - The versioning properties
   */
  constructor(props: VersioningMixinProps) {
    this.props = props;
  }

  /**
   * Validates the versioning properties for this mixin
   */
  public get validations(): ValidationRule<VersioningMixinProps>[] {
    return [
      {
        condition: (props) => Boolean(props.objectLockEnabled === false && props.objectLockDefaultRetention),
        message: () => 'Object Lock must be enabled to configure default retention settings',
      },
    ];
  }

  /**
   * Applies versioning configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket logging configuration
 */
export class LoggingMixin implements Mixin<CfnBucket, CfnBucket, LoggingMixinProps> {
  /**
   * The logging properties for this mixin
   */
  private readonly props: LoggingMixinProps;

  /**
   * Creates a new LoggingMixin
   * @param props - The logging properties
   */
  constructor(props: LoggingMixinProps) {
    this.props = props;
  }

  /**
   * Validates the logging properties for this mixin
   * @returns An empty array since no validation is required
   */
  public get validations(): ValidationRule<LoggingMixinProps>[] {
    return [];
  }

  /**
   * Applies logging configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket notification configuration
 */
export class NotificationMixin implements Mixin<CfnBucket, CfnBucket, NotificationMixinProps> {
  /**
   * The notification properties for this mixin
   */
  private readonly props: NotificationMixinProps;

  /**
   * Creates a new NotificationMixin
   * @param props - The notification properties
   */
  constructor(props: NotificationMixinProps) {
    this.props = props;
  }

  /**
   * Validates the notification properties for this mixin
   * @returns An empty array since no validation is required
   */
  public get validations(): ValidationRule<NotificationMixinProps>[] {
    return [];
  }

  /**
   * Applies notification configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket CORS configuration
 */
export class CORSMixin implements Mixin<CfnBucket, CfnBucket, CORSMixinProps> {
  /**
   * The CORS properties for this mixin
   */
  private readonly props: CORSMixinProps;

  /**
   * Creates a new CORSMixin
   * @param props - The CORS properties
   */
  constructor(props: CORSMixinProps) {
    this.props = props;
  }

  /**
   * Validates the CORS properties for this mixin
   * @returns An empty array since no validation is required
   */
  public get validations(): ValidationRule<CORSMixinProps>[] {
    return [];
  }

  /**
   * Applies CORS configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket inventory configuration
 */
export class InventoryMixin implements Mixin<CfnBucket, CfnBucket, InventoryMixinProps> {
  /**
   * The inventory properties for this mixin
   */
  private readonly props: InventoryMixinProps;

  /**
   * Creates a new InventoryMixin
   * @param props - The inventory properties
   */
  constructor(props: InventoryMixinProps) {
    this.props = props;
  }

  /**
   * Validates the inventory properties for this mixin
   * @returns An empty array since no validation is required
   */
  public get validations(): ValidationRule<InventoryMixinProps>[] {
    return [];
  }

  /**
   * Applies inventory configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket metrics configuration
 */
export class MetricsMixin implements Mixin<CfnBucket, CfnBucket, MetricsMixinProps> {
  /**
   * The metrics properties for this mixin
   */
  private readonly props: MetricsMixinProps;

  /**
   * Creates a new MetricsMixin
   * @param props - The metrics properties
   */
  constructor(props: MetricsMixinProps) {
    this.props = props;
  }

  /**
   * Validates the metrics properties for this mixin
   * @returns An empty array since no validation is required
   */
  public get validations(): ValidationRule<MetricsMixinProps>[] {
    return [];
  }

  /**
   * Applies metrics configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket replication configuration
 */
export class ReplicationMixin implements Mixin<CfnBucket, CfnBucket, ReplicationMixinProps> {
  /**
   * The replication properties for this mixin
   */
  private readonly props: ReplicationMixinProps;

  /**
   * Creates a new ReplicationMixin
   * @param props - The replication properties
   */
  constructor(props: ReplicationMixinProps) {
    this.props = props;
  }

  /**
   * Validates the replication properties for this mixin
   */
  public get validations(): ValidationRule<ReplicationMixinProps>[] {
    return [
      {
        condition: (props) => {
          const replicationRulesIsEmpty = !props.replicationRules || props.replicationRules.length === 0;
          return Boolean(replicationRulesIsEmpty && props.replicationRole);
        },
        message: () => 'cannot specify replicationRole when replicationRules is empty',
      },
      {
        condition: (props) => {
          if (!props.replicationRules || props.replicationRules.length <= 1) return false;
          return props.replicationRules.some(rule => rule.priority === undefined);
        },
        message: () => '\'priority\' must be specified for all replication rules when there are multiple rules',
      },
      {
        condition: (props) => {
          if (!props.replicationRules) return false;
          return props.replicationRules.some(rule => rule.replicationTimeControl && !rule.metrics);
        },
        message: () => '\'replicationTimeControlMetrics\' must be enabled when \'replicationTimeControl\' is enabled.',
      },
      {
        condition: (props) => {
          if (!props.replicationRules) return false;
          return props.replicationRules.some(rule => rule.deleteMarkerReplication && rule.filter?.tags);
        },
        message: () => 'tag filter cannot be specified when \'deleteMarkerReplication\' is enabled.',
      },
    ];
  }

  /**
   * Applies replication configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket intelligent tiering configuration
 */
export class IntelligentTieringMixin implements Mixin<CfnBucket, CfnBucket, IntelligentTieringMixinProps> {
  /**
   * The intelligent tiering properties for this mixin
   */
  private readonly props: IntelligentTieringMixinProps;

  /**
   * Creates a new IntelligentTieringMixin
   * @param props - The intelligent tiering properties
   */
  constructor(props: IntelligentTieringMixinProps) {
    this.props = props;
  }

  /**
   * Validates the intelligent tiering properties for this mixin
   * @returns An empty array since no validation is required
   */
  public get validations(): ValidationRule<IntelligentTieringMixinProps>[] {
    return [];
  }

  /**
   * Applies intelligent tiering configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket ownership configuration
 */
export class OwnershipMixin implements Mixin<CfnBucket, CfnBucket, OwnershipMixinProps> {
  /**
   * The ownership properties for this mixin
   */
  private readonly props: OwnershipMixinProps;

  /**
   * Creates a new OwnershipMixin
   * @param props - The ownership properties
   */
  constructor(props: OwnershipMixinProps) {
    this.props = props;
  }

  /**
   * Validates the ownership properties for this mixin
   */
  public get validations(): ValidationRule<OwnershipMixinProps>[] {
    return [
      {
        condition: (props) => {
          const aclsThatDoNotRequireObjectOwnership = [
            BucketAccessControl.PRIVATE,
            BucketAccessControl.BUCKET_OWNER_READ,
            BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
          ];
          const accessControlRequiresObjectOwnership = props.accessControl && !aclsThatDoNotRequireObjectOwnership.includes(props.accessControl);
          return Boolean(accessControlRequiresObjectOwnership && props.objectOwnership === ObjectOwnership.BUCKET_OWNER_ENFORCED);
        },
        message: (props) => `objectOwnership must be set to "${ObjectOwnership.OBJECT_WRITER}" when accessControl is "${props.accessControl}"`,
      },
    ];
  }

  /**
   * Applies ownership configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket transfer acceleration configuration
 */
export class TransferAccelerationMixin implements Mixin<CfnBucket, CfnBucket, TransferAccelerationMixinProps> {
  /**
   * The transfer acceleration properties for this mixin
   */
  private readonly props: TransferAccelerationMixinProps;

  /**
   * Creates a new TransferAccelerationMixin
   * @param props - The transfer acceleration properties
   */
  constructor(props: TransferAccelerationMixinProps) {
    this.props = props;
  }

  /**
   * Validates the transfer acceleration properties for this mixin
   * @returns An empty array since no validation is required
   */
  public get validations(): ValidationRule<TransferAccelerationMixinProps>[] {
    return [];
  }

  /**
   * Applies transfer acceleration configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket secure access configuration
 */
export class SecureAccessMixin implements Mixin<CfnBucket, CfnBucket, SecureAccessMixinProps> {
  /**
   * The secure access properties for this mixin
   */
  private readonly props: SecureAccessMixinProps;

  /**
   * Creates a new SecureAccessMixin
   * @param props - The secure access properties
   */
  constructor(props: SecureAccessMixinProps) {
    this.props = props;
  }

  /**
   * Validates the secure access properties for this mixin
   */
  public get validations(): ValidationRule<SecureAccessMixinProps>[] {
    return [
      {
        condition: (props) => Boolean(!props.enforceSSL && props.minimumTLSVersion),
        message: () => '\'enforceSSL\' must be enabled for \'minimumTLSVersion\' to be applied',
      },
    ];
  }

  /**
   * Applies secure access configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket analytics configuration
 */
export class AnalyticsMixin implements Mixin<CfnBucket, CfnBucket, AnalyticsMixinProps> {
  /**
   * The analytics properties for this mixin
   */
  private readonly props: AnalyticsMixinProps;

  /**
   * Creates a new AnalyticsMixin
   * @param props - The analytics properties
   */
  constructor(props: AnalyticsMixinProps) {
    this.props = props;
  }

  /**
   * Validates the analytics properties for this mixin
   */
  public get validations(): ValidationRule<AnalyticsMixinProps>[] {
    return [];
  }

  /**
   * Applies analytics configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket auto-delete objects configuration
 */
export class AutoDeleteObjectsMixin implements Mixin<CfnBucket, CfnBucket, AutoDeleteObjectsMixinProps> {
  /**
   * The auto-delete objects properties for this mixin
   */
  private readonly props: AutoDeleteObjectsMixinProps;

  /**
   * Creates a new AutoDeleteObjectsMixin
   * @param props - The auto-delete objects properties
   */
  constructor(props: AutoDeleteObjectsMixinProps) {
    this.props = props;
  }

  /**
   * Validates the auto-delete objects properties for this mixin
   */
  public get validations(): ValidationRule<AutoDeleteObjectsMixinProps>[] {
    return [];
  }

  /**
   * Applies auto-delete objects configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * Mixin for bucket metadata configuration
 */
export class MetadataMixin implements Mixin<CfnBucket, CfnBucket, MetadataMixinProps> {
  /**
   * The metadata properties for this mixin
   */
  private readonly props: MetadataMixinProps;

  /**
   * Creates a new MetadataMixin
   * @param props - The metadata properties
   */
  constructor(props: MetadataMixinProps) {
    this.props = props;
  }

  /**
   * Validates the metadata properties for this mixin
   */
  public get validations(): ValidationRule<MetadataMixinProps>[] {
    return [
      {
        condition: (props) => {
          if (!props.metadata?.journalTable.recordExpiration) return false;
          const days = props.metadata.journalTable.recordExpiration.days;
          return Boolean(days && (days < 1 || days > 36500));
        },
        message: () => 'Journal table record expiration days must be between 1 and 36500 days',
      },
    ];
  }

  /**
   * Applies metadata configuration to the bucket
   * @param resource - The CfnBucket resource to configure
   * @returns The configured CfnBucket resource
   */
  public apply(resource: CfnBucket): CfnBucket {
    return resource;
  }
}

/**
 * An S3 bucket with associated policy objects
 *
 * This bucket does not yet have all features that exposed by the underlying
 * BucketResource.
 *
 * @example
 * import { RemovalPolicy } from 'aws-cdk-lib';
 *
 * new s3.Bucket(scope, 'Bucket', {
 *   blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
 *   encryption: s3.BucketEncryption.S3_MANAGED,
 *   enforceSSL: true,
 *   versioned: true,
 *   removalPolicy: RemovalPolicy.RETAIN,
 * });
 *
 */
@propertyInjectable
export class Bucket extends Resource implements ICfnBucket {
  /**
   * Uniquely identifies this class.
   */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-s3.Bucket';

  public readonly cfn: CfnBucket;
  public readonly attrArn: string;
  public readonly attrBucketName: string;

  private readonly props: BucketProps;

  public constructor(scope: IConstruct, id: string, props: BucketProps = {}) {
    super(scope, id);
    // @todo deal with physical name
    this.props = props;

    // Construct hooks
    addConstructMetadata(this, props);

    // CFN Resource
    this.cfn = new CfnBucket(this, 'Resource');
    this.attrArn = this.cfn.attrArn;
    this.attrBucketName = this.cfn.ref;

    // Features
    this.with(
      new EncryptionMixin(props),
      new PublicAccessMixin(props),
      new WebsiteMixin(props),
      new LifecycleMixin(props),
      new VersioningMixin(props),
      new LoggingMixin(props),
      new NotificationMixin(props),
      new CORSMixin(props),
      new InventoryMixin(props),
      new MetricsMixin(props),
      new ReplicationMixin(props),
      new IntelligentTieringMixin(props),
      new OwnershipMixin(props),
      new TransferAccelerationMixin(props),
      new SecureAccessMixin(props),
      new AutoDeleteObjectsMixin(props),
      // new AnalyticsMixin({}),
      // new MetadataMixin(props),
    );
  }

  private with(...mixins: Mixin<CfnBucket, any, BucketProps>[]): this {
    validateAllProps(this, this.constructor.name, this.props, mixins.flatMap(m => m.validations));
    mixins.forEach(mixin => mixin.apply(this.cfn));
    return this;
  }
}
