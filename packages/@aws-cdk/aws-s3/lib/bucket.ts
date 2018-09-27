import actions = require('@aws-cdk/aws-codepipeline-api');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import { IBucketNotificationDestination } from '@aws-cdk/aws-s3-notifications';
import cdk = require('@aws-cdk/cdk');
import { BucketPolicy } from './bucket-policy';
import { BucketNotifications } from './notifications-resource';
import perms = require('./perms');
import { CommonPipelineSourceActionProps, PipelineSourceAction } from './pipeline-action';
import { LifecycleRule } from './rule';
import { cloudformation } from './s3.generated';
import { parseBucketArn, parseBucketName } from './util';

/**
 * A reference to a bucket. The easiest way to instantiate is to call
 * `bucket.export()`. Then, the consumer can use `Bucket.import(this, ref)` and
 * get a `Bucket`.
 */
export interface BucketRefProps {
  /**
   * The ARN fo the bucket. At least one of bucketArn or bucketName must be
   * defined in order to initialize a bucket ref.
   */
  bucketArn?: string;

  /**
   * The name of the bucket. If the underlying value of ARN is a string, the
   * name will be parsed from the ARN. Otherwise, the name is optional, but
   * some features that require the bucket name such as auto-creating a bucket
   * policy, won't work.
   */
  bucketName?: string;
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
 *   BucketRef.import(this, 'MyImportedBucket', { bucketArn: ... });
 *
 * You can also export a bucket and import it into another stack:
 *
 *   const ref = myBucket.export();
 *   BucketRef.import(this, 'MyImportedBucket', ref);
 *
 */
export abstract class BucketRef extends cdk.Construct {
  /**
   * Creates a Bucket construct that represents an external bucket.
   *
   * @param parent The parent creating construct (usually `this`).
   * @param name The construct's name.
   * @param ref A BucketRefProps object. Can be obtained from a call to
   * `bucket.export()`.
   */
  public static import(parent: cdk.Construct, name: string, props: BucketRefProps): BucketRef {
    return new ImportedBucketRef(parent, name, props);
  }

  /**
   * The ARN of the bucket.
   */
  public abstract readonly bucketArn: string;

  /**
   * The name of the bucket.
   */
  public abstract readonly bucketName: string;

  /**
   * Optional KMS encryption key associated with this bucket.
   */
  public abstract readonly encryptionKey?: kms.EncryptionKeyRef;

  /**
   * The resource policy assoicated with this bucket.
   *
   * If `autoCreatePolicy` is true, a `BucketPolicy` will be created upon the
   * first call to addToResourcePolicy(s).
   */
  protected abstract policy?: BucketPolicy;

  /**
   * Indicates if a bucket resource policy should automatically created upon
   * the first call to `addToResourcePolicy`.
   */
  protected abstract autoCreatePolicy = false;

  /**
   * Exports this bucket from the stack.
   */
  public export(): BucketRefProps {
    return {
      bucketArn: new cdk.Output(this, 'BucketArn', { value: this.bucketArn }).makeImportValue().toString(),
      bucketName: new cdk.Output(this, 'BucketName', { value: this.bucketName }).makeImportValue().toString(),
    };
  }

  /**
   * Convenience method for creating a new {@link PipelineSourceAction},
   * and adding it to the given Stage.
   *
   * @param stage the Pipeline Stage to add the new Action to
   * @param name the name of the newly created Action
   * @param props the properties of the new Action
   * @returns the newly created {@link PipelineSourceAction}
   */
  public addToPipeline(stage: actions.IStage, name: string, props: CommonPipelineSourceActionProps): PipelineSourceAction {
    return new PipelineSourceAction(this.parent!, name, {
      stage,
      bucket: this,
      ...props,
    });
  }

  /**
   * Adds a statement to the resource policy for a principal (i.e.
   * account/role/service) to perform actions on this bucket and/or it's
   * contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for
   * this bucket or objects.
   */
  public addToResourcePolicy(permission: cdk.PolicyStatement) {
    if (!this.policy && this.autoCreatePolicy) {
      this.policy = new BucketPolicy(this, 'Policy', { bucket: this });
    }

    if (this.policy) {
      this.policy.document.addStatement(permission);
    }
  }

  /**
   * The https:// URL of this bucket.
   * @example https://s3.us-west-1.amazonaws.com/onlybucket
   * Similar to calling `urlForObject` with no object key.
   */
  public get bucketUrl() {
    return this.urlForObject();
  }

  /**
   * The https URL of an S3 object. For example:
   * @example https://s3.us-west-1.amazonaws.com/onlybucket
   * @example https://s3.us-west-1.amazonaws.com/bucket/key
   * @example https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey
   * @param key The S3 key of the object. If not specified, the URL of the
   *      bucket is returned.
   * @returns an ObjectS3Url token
   */
  public urlForObject(key?: any): string {
    const components = [ 'https://', 's3.', new cdk.AwsRegion(), '.', new cdk.AwsURLSuffix(), '/', this.bucketName ];
    if (key) {
      // trim prepending '/'
      if (typeof key === 'string' && key.startsWith('/')) {
        key = key.substr(1);
      }
      components.push('/');
      components.push(key);
    }

    return new cdk.FnConcat(...components).toString();
  }

  /**
   * Returns an ARN that represents all objects within the bucket that match
   * the key pattern specified. To represent all keys, specify ``"*"``.
   *
   * If you specify multiple components for keyPattern, they will be concatenated::
   *
   *   arnForObjects('home/', team, '/', user, '/*')
   *
   */
  public arnForObjects(...keyPattern: any[]): string {
    return new cdk.FnConcat(this.bucketArn, '/', ...keyPattern).toString();
  }

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
  public grantRead(identity?: iam.IPrincipal, objectsKeyPattern: any = '*') {
    this.grant(identity, perms.BUCKET_READ_ACTIONS, perms.KEY_READ_ACTIONS,
      this.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grant write permissions to this bucket to an IAM principal.
   *
   * If encryption is used, permission to use the key to encrypt the contents
   * of written files will also be granted to the same principal.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public grantWrite(identity?: iam.IPrincipal, objectsKeyPattern: any = '*') {
    this.grant(identity, perms.BUCKET_WRITE_ACTIONS, perms.KEY_WRITE_ACTIONS,
      this.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grants s3:PutObject* and s3:Abort* permissions for this bucket to an IAM principal.
   *
   * If encryption is used, permission to use the key to encrypt the contents
   * of written files will also be granted to the same principal.
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public grantPut(identity?: iam.IPrincipal, objectsKeyPattern: any = '*') {
    this.grant(identity, perms.BUCKET_PUT_ACTIONS, perms.KEY_WRITE_ACTIONS,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grants s3:DeleteObject* permission to an IAM pricipal for objects
   * in this bucket.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public grantDelete(identity?: iam.IPrincipal, objectsKeyPattern: any = '*') {
    this.grant(identity, perms.BUCKET_DELETE_ACTIONS, [],
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grants read/write permissions for this bucket and it's contents to an IAM
   * principal (Role/Group/User).
   *
   * If an encryption key is used, permission to use the key for
   * encrypt/decrypt will also be granted.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public grantReadWrite(identity?: iam.IPrincipal, objectsKeyPattern: any = '*') {
    const bucketActions = perms.BUCKET_READ_ACTIONS.concat(perms.BUCKET_WRITE_ACTIONS);
    const keyActions = perms.KEY_READ_ACTIONS.concat(perms.KEY_WRITE_ACTIONS);

    this.grant(identity,
      bucketActions,
      keyActions,
      this.bucketArn,
      this.arnForObjects(objectsKeyPattern));
  }

  private grant(identity: iam.IPrincipal | undefined,
                bucketActions: string[],
                keyActions: string[],
                resourceArn: string, ...otherResourceArns: string[]) {

    if (!identity) {
      return;
    }

    const resources = [ resourceArn, ...otherResourceArns ];

    identity.addToPolicy(new cdk.PolicyStatement()
      .addResources(...resources)
      .addActions(...bucketActions));

    // grant key permissions if there's an associated key.
    if (this.encryptionKey) {
      // KMS permissions need to be granted both directions
      identity.addToPolicy(new cdk.PolicyStatement()
        .addResource(this.encryptionKey.keyArn)
        .addActions(...keyActions));

      this.encryptionKey.addToResourcePolicy(new cdk.PolicyStatement()
        .addAllResources()
        .addPrincipal(identity.principal)
        .addActions(...keyActions));
    }
  }
}

export interface BucketProps {
  /**
   * The kind of server-side encryption to apply to this bucket.
   *
   * If you choose KMS, you can specify a KMS key via `encryptionKey`. If
   * encryption key is not specified, a key will automatically be created.
   *
   * @default Unencrypted
   */
  encryption?: BucketEncryption;

  /**
   * External KMS key to use for bucket encryption.
   *
   * The 'encryption' property must be either not specified or set to "Kms".
   * An error will be emitted if encryption is set to "Unencrypted" or
   * "Managed".
   *
   * @default If encryption is set to "Kms" and this property is undefined, a
   * new KMS key will be created and associated with this bucket.
   */
  encryptionKey?: kms.EncryptionKeyRef;

  /**
   * Physical name of this bucket.
   *
   * @default Assigned by CloudFormation (recommended)
   */
  bucketName?: string;

  /**
   * Policy to apply when the bucket is removed from this stack.
   *
   * @default By default, the bucket will be destroyed if it is removed from the stack.
   */
  removalPolicy?: cdk.RemovalPolicy;

  /**
   * Whether this bucket should have versioning turned on or not.
   *
   * @default false
   */
  versioned?: boolean;

  /**
   * Rules that define how Amazon S3 manages objects during their lifetime.
   *
   * @default No lifecycle rules
   */
  lifecycleRules?: LifecycleRule[];
}

/**
 * An S3 bucket with associated policy objects
 *
 * This bucket does not yet have all features that exposed by the underlying
 * BucketResource.
 */
export class Bucket extends BucketRef {
  public readonly bucketArn: string;
  public readonly bucketName: string;
  public readonly domainName: string;
  public readonly dualstackDomainName: string;
  public readonly encryptionKey?: kms.EncryptionKeyRef;
  protected policy?: BucketPolicy;
  protected autoCreatePolicy = true;
  private readonly lifecycleRules: LifecycleRule[] = [];
  private readonly versioned?: boolean;
  private readonly notifications: BucketNotifications;

  constructor(parent: cdk.Construct, name: string, props: BucketProps = {}) {
    super(parent, name);

    const { bucketEncryption, encryptionKey } = this.parseEncryption(props);

    const resource = new cloudformation.BucketResource(this, 'Resource', {
      bucketName: props && props.bucketName,
      bucketEncryption,
      versioningConfiguration: props.versioned ? { status: 'Enabled' } : undefined,
      lifecycleConfiguration: new cdk.Token(() => this.parseLifecycleConfiguration()),
    });

    cdk.applyRemovalPolicy(resource, props.removalPolicy);

    this.versioned = props.versioned;
    this.encryptionKey = encryptionKey;
    this.bucketArn = resource.bucketArn;
    this.bucketName = resource.bucketName;
    this.domainName = resource.bucketDomainName;
    this.dualstackDomainName = resource.bucketDualStackDomainName;

    // Add all lifecycle rules
    (props.lifecycleRules || []).forEach(this.addLifecycleRule.bind(this));

    // defines a BucketNotifications construct. Notice that an actual resource will only
    // be added if there are notifications added, so we don't need to condition this.
    this.notifications = new BucketNotifications(this, 'Notifications', { bucket: this });
  }

  /**
   * Add a lifecycle rule to the bucket
   *
   * @param rule The rule to add
   */
  public addLifecycleRule(rule: LifecycleRule) {
    if ((rule.noncurrentVersionExpirationInDays !== undefined
      || (rule.noncurrentVersionTransitions && rule.noncurrentVersionTransitions.length > 0))
      && !this.versioned) {
      throw new Error("Cannot use 'noncurrent' rules on a nonversioned bucket");
    }

    this.lifecycleRules.push(rule);
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
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html#notification-how-to-filtering
   *
   * @example
   *
   *    bucket.onEvent(EventType.OnObjectCreated, myLambda, 'home/myusername/*')
   *
   * @see
   * https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html
   */
  public onEvent(event: EventType, dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
    this.notifications.addNotification(event, dest, ...filters);
  }

  /**
   * Subscribes a destination to receive notificatins when an object is
   * created in the bucket. This is identical to calling
   * `onEvent(EventType.ObjectCreated)`.
   *
   * @param dest The notification destination (see onEvent)
   * @param filters Filters (see onEvent)
   */
  public onObjectCreated(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
    return this.onEvent(EventType.ObjectCreated, dest, ...filters);
  }

  /**
   * Subscribes a destination to receive notificatins when an object is
   * removed from the bucket. This is identical to calling
   * `onEvent(EventType.ObjectRemoved)`.
   *
   * @param dest The notification destination (see onEvent)
   * @param filters Filters (see onEvent)
   */
  public onObjectRemoved(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
    return this.onEvent(EventType.ObjectRemoved, dest, ...filters);
  }

  /**
   * Set up key properties and return the Bucket encryption property from the
   * user's configuration.
   */
  private parseEncryption(props: BucketProps): {
    bucketEncryption?: cloudformation.BucketResource.BucketEncryptionProperty,
    encryptionKey?: kms.EncryptionKeyRef
  } {

    // default to unencrypted.
    const encryptionType = props.encryption || BucketEncryption.Unencrypted;

    // if encryption key is set, encryption must be set to KMS.
    if (encryptionType !== BucketEncryption.Kms && props.encryptionKey) {
      throw new Error(`encryptionKey is specified, so 'encryption' must be set to KMS (value: ${encryptionType})`);
    }

    if (encryptionType === BucketEncryption.Unencrypted) {
      return { bucketEncryption: undefined, encryptionKey: undefined };
    }

    if (encryptionType === BucketEncryption.Kms) {
      const encryptionKey = props.encryptionKey || new kms.EncryptionKey(this, 'Key', {
        description: `Created by ${this.path}`
      });

      const bucketEncryption = {
        serverSideEncryptionConfiguration: [
          {
            serverSideEncryptionByDefault: {
              sseAlgorithm: 'aws:kms',
              kmsMasterKeyId: encryptionKey.keyArn
            }
          }
        ]
      };
      return { encryptionKey, bucketEncryption };
    }

    if (encryptionType === BucketEncryption.S3Managed) {
      const bucketEncryption = {
        serverSideEncryptionConfiguration: [
          { serverSideEncryptionByDefault: { sseAlgorithm: 'AES256' } }
        ]
      };

      return { bucketEncryption };
    }

    if (encryptionType === BucketEncryption.KmsManaged) {
      const bucketEncryption = {
        serverSideEncryptionConfiguration: [
          { serverSideEncryptionByDefault: { sseAlgorithm: 'aws:kms' } }
        ]
      };
      return { bucketEncryption };
    }

    throw new Error(`Unexpected 'encryptionType': ${encryptionType}`);
  }

  /**
   * Parse the lifecycle configuration out of the uucket props
   * @param props Par
   */
  private parseLifecycleConfiguration(): cloudformation.BucketResource.LifecycleConfigurationProperty | undefined {
    if (!this.lifecycleRules || this.lifecycleRules.length === 0) {
      return undefined;
    }

    return { rules: this.lifecycleRules.map(parseLifecycleRule) };

    function parseLifecycleRule(rule: LifecycleRule): cloudformation.BucketResource.RuleProperty {
      const enabled = rule.enabled !== undefined ? rule.enabled : true;

      const x = {
        // tslint:disable-next-line:max-line-length
        abortIncompleteMultipartUpload: rule.abortIncompleteMultipartUploadAfterDays !== undefined ? { daysAfterInitiation: rule.abortIncompleteMultipartUploadAfterDays } : undefined,
        expirationDate: rule.expirationDate,
        expirationInDays: rule.expirationInDays,
        id: rule.id,
        noncurrentVersionExpirationInDays: rule.noncurrentVersionExpirationInDays,
        noncurrentVersionTransitions: rule.noncurrentVersionTransitions,
        prefix: rule.prefix,
        status: enabled ? 'Enabled' : 'Disabled',
        transitions: rule.transitions,
        tagFilters: parseTagFilters(rule.tagFilters)
      };

      return x;
    }

    function parseTagFilters(tagFilters?: {[tag: string]: any}) {
      if (!tagFilters || tagFilters.length === 0) {
        return undefined;
      }

      return Object.keys(tagFilters).map(tag => ({
        key: tag,
        value: tagFilters[tag]
      }));
    }
  }
}

/**
 * What kind of server-side encryption to apply to this bucket
 */
export enum BucketEncryption {
  /**
   * Objects in the bucket are not encrypted.
   */
  Unencrypted = 'NONE',

  /**
   * Server-side KMS encryption with a master key managed by KMS.
   */
  KmsManaged = 'MANAGED',

  /**
   * Server-side encryption with a master key managed by S3.
   */
  S3Managed = 'S3MANAGED',

  /**
   * Server-side encryption with a KMS key managed by the user.
   * If `encryptionKey` is specified, this key will be used, otherwise, one will be defined.
   */
  Kms = 'KMS',
}

/**
 * Notification event types.
 */
export enum EventType {
  /**
   * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
   * these event types, you can enable notification when an object is created
   * using a specific API, or you can use the s3:ObjectCreated:* event type to
   * request notification regardless of the API that was used to create an
   * object.
   */
  ObjectCreated = 's3:ObjectCreated:*',

  /**
   * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
   * these event types, you can enable notification when an object is created
   * using a specific API, or you can use the s3:ObjectCreated:* event type to
   * request notification regardless of the API that was used to create an
   * object.
   */
  ObjectCreatedPut = 's3:ObjectCreated:Put',

  /**
   * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
   * these event types, you can enable notification when an object is created
   * using a specific API, or you can use the s3:ObjectCreated:* event type to
   * request notification regardless of the API that was used to create an
   * object.
   */
  ObjectCreatedPost = 's3:ObjectCreated:Post',

  /**
   * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
   * these event types, you can enable notification when an object is created
   * using a specific API, or you can use the s3:ObjectCreated:* event type to
   * request notification regardless of the API that was used to create an
   * object.
   */
  ObjectCreatedCopy = 's3:ObjectCreated:Copy',

  /**
   * Amazon S3 APIs such as PUT, POST, and COPY can create an object. Using
   * these event types, you can enable notification when an object is created
   * using a specific API, or you can use the s3:ObjectCreated:* event type to
   * request notification regardless of the API that was used to create an
   * object.
   */
  ObjectCreatedCompleteMultipartUpload = 's3:ObjectCreated:CompleteMultipartUpload',

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
  ObjectRemoved = 's3:ObjectRemoved:*',

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
  ObjectRemovedDelete = 's3:ObjectRemoved:Delete',

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
  ObjectRemovedDeleteMarkerCreated = 's3:ObjectRemoved:DeleteMarkerCreated',

  /**
   * You can use this event type to request Amazon S3 to send a notification
   * message when Amazon S3 detects that an object of the RRS storage class is
   * lost.
   */
  ReducedRedundancyLostObject = 's3:ReducedRedundancyLostObject',
}

export interface NotificationKeyFilter {
  /**
   * S3 keys must have the specified prefix.
   */
  prefix?: string;

  /**
   * S3 keys must have the specified suffix.
   */
  suffix?: string;
}

class ImportedBucketRef extends BucketRef {
  public readonly bucketArn: string;
  public readonly bucketName: string;
  public readonly encryptionKey?: kms.EncryptionKey;

  protected policy?: BucketPolicy;
  protected autoCreatePolicy: boolean;

  constructor(parent: cdk.Construct, name: string, props: BucketRefProps) {
    super(parent, name);

    const bucketName = parseBucketName(props);
    if (!bucketName) {
      throw new Error('Bucket name is required');
    }

    this.bucketArn = parseBucketArn(props);
    this.bucketName = bucketName;
    this.autoCreatePolicy = false;
    this.policy = undefined;
  }
}
