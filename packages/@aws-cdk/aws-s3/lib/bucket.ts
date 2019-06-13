import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import { applyRemovalPolicy, Construct, IResource, Lazy, PhysicalName,
  RemovalPolicy, Resource, ResourceIdentifiers, Stack, Token } from '@aws-cdk/cdk';
import { EOL } from 'os';
import { BucketPolicy } from './bucket-policy';
import { IBucketNotificationDestination } from './destination';
import { BucketNotifications } from './notifications-resource';
import perms = require('./perms');
import { LifecycleRule } from './rule';
import { CfnBucket } from './s3.generated';
import { parseBucketArn, parseBucketName } from './util';

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
   * Optional KMS encryption key associated with this bucket.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * The resource policy assoicated with this bucket.
   *
   * If `autoCreatePolicy` is true, a `BucketPolicy` will be created upon the
   * first call to addToResourcePolicy(s).
   */
  policy?: BucketPolicy;

  /**
   * Adds a statement to the resource policy for a principal (i.e.
   * account/role/service) to perform actions on this bucket and/or it's
   * contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for
   * this bucket or objects.
   */
  addToResourcePolicy(permission: iam.PolicyStatement): void;

  /**
   * The https URL of an S3 object. For example:
   * @example https://s3.us-west-1.amazonaws.com/onlybucket
   * @example https://s3.us-west-1.amazonaws.com/bucket/key
   * @example https://s3.cn-north-1.amazonaws.com.cn/china-bucket/mykey
   * @param key The S3 key of the object. If not specified, the URL of the
   *      bucket is returned.
   * @returns an ObjectS3Url token
   */
  urlForObject(key?: string): string;

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
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  grantWrite(identity: iam.IGrantable, objectsKeyPattern?: any): iam.Grant;

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
   * Grants s3:DeleteObject* permission to an IAM pricipal for objects
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
   * Define a CloudWatch event that triggers when something happens to this repository
   *
   * Requires that there exists at least one CloudTrail Trail in your account
   * that captures the event. This method will not create the Trail.
   *
   * @param id The id of the rule
   * @param options Options for adding the rule
   */
  onCloudTrailEvent(id: string, options: OnCloudTrailBucketEventOptions): events.Rule;

  /**
   * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
   * repository.
   *
   * Requires that there exists at least one CloudTrail Trail in your account
   * that captures the event. This method will not create the Trail.
   *
   * @param id The id of the rule
   * @param options Options for adding the rule
   */
  onCloudTrailPutObject(id: string, options: OnCloudTrailBucketEventOptions): events.Rule;
}

/**
 * A reference to a bucket. The easiest way to instantiate is to call
 * `bucket.export()`. Then, the consumer can use `Bucket.import(this, ref)` and
 * get a `Bucket`.
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
   * @default Inferred from bucket name
   */
  readonly bucketDomainName?: string;

  /**
   * The website URL of the bucket (if static web hosting is enabled).
   *
   * @default Inferred from bucket name
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
   * The format of the website URL of the bucket. This should be true for
   * regions launched since 2014.
   *
   * @default false
   */
  readonly bucketWebsiteNewUrlFormat?: boolean;
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
abstract class BucketBase extends Resource implements IBucket {
  public abstract readonly bucketArn: string;
  public abstract readonly bucketName: string;
  public abstract readonly bucketDomainName: string;
  public abstract readonly bucketWebsiteUrl: string;
  public abstract readonly bucketRegionalDomainName: string;
  public abstract readonly bucketDualStackDomainName: string;

  /**
   * Optional KMS encryption key associated with this bucket.
   */
  public abstract readonly encryptionKey?: kms.IKey;

  /**
   * The resource policy assoicated with this bucket.
   *
   * If `autoCreatePolicy` is true, a `BucketPolicy` will be created upon the
   * first call to addToResourcePolicy(s).
   */
  public abstract policy?: BucketPolicy;

  /**
   * Indicates if a bucket resource policy should automatically created upon
   * the first call to `addToResourcePolicy`.
   */
  protected abstract autoCreatePolicy = false;

  /**
   * Whether to disallow public access
   */
  protected abstract disallowPublicAccess?: boolean;

  /**
   * Define a CloudWatch event that triggers when something happens to this repository
   *
   * Requires that there exists at least one CloudTrail Trail in your account
   * that captures the event. This method will not create the Trail.
   *
   * @param id The id of the rule
   * @param options Options for adding the rule
   */
  public onCloudTrailEvent(id: string, options: OnCloudTrailBucketEventOptions): events.Rule {
    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      source: ['aws.s3'],
      detailType: ['AWS API Call via CloudTrail'],
      detail: {
        resources: {
          ARN: options.paths ? options.paths.map(p => this.arnForObjects(p)) : [this.bucketArn],
        },
      }
    });
    return rule;
  }

  /**
   * Defines an AWS CloudWatch event rule that can trigger a target when an image is pushed to this
   * repository.
   *
   * Requires that there exists at least one CloudTrail Trail in your account
   * that captures the event. This method will not create the Trail.
   *
   * @param id The id of the rule
   * @param options Options for adding the rule
   */
  public onCloudTrailPutObject(id: string, options: OnCloudTrailBucketEventOptions): events.Rule {
    const rule = this.onCloudTrailEvent(id, options);
    rule.addEventPattern({
      detail: {
        eventName: ['PutObject'],
      },
    });
    return rule;
  }

  /**
   * Adds a statement to the resource policy for a principal (i.e.
   * account/role/service) to perform actions on this bucket and/or it's
   * contents. Use `bucketArn` and `arnForObjects(keys)` to obtain ARNs for
   * this bucket or objects.
   */
  public addToResourcePolicy(permission: iam.PolicyStatement) {
    if (!this.policy && this.autoCreatePolicy) {
      this.policy = new BucketPolicy(this, 'Policy', { bucket: this });
    }

    if (this.policy) {
      this.policy.document.addStatements(permission);
    }
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
  public urlForObject(key?: string): string {
    const stack = Stack.of(this);
    const components = [ `https://s3.${stack.region}.${stack.urlSuffix}/${this.bucketName}` ];
    if (key) {
      // trim prepending '/'
      if (typeof key === 'string' && key.startsWith('/')) {
        key = key.substr(1);
      }
      components.push('/');
      components.push(key);
    }

    return components.join('');
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
  public arnForObjects(keyPattern: string): string {
    return `${this.bucketArn}/${keyPattern}`;
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
  public grantRead(identity: iam.IGrantable, objectsKeyPattern: any = '*') {
    return this.grant(identity, perms.BUCKET_READ_ACTIONS, perms.KEY_READ_ACTIONS,
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
  public grantWrite(identity: iam.IGrantable, objectsKeyPattern: any = '*') {
    return this.grant(identity, perms.BUCKET_WRITE_ACTIONS, perms.KEY_WRITE_ACTIONS,
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
  public grantPut(identity: iam.IGrantable, objectsKeyPattern: any = '*') {
    return this.grant(identity, perms.BUCKET_PUT_ACTIONS, perms.KEY_WRITE_ACTIONS,
      this.arnForObjects(objectsKeyPattern));
  }

  /**
   * Grants s3:DeleteObject* permission to an IAM pricipal for objects
   * in this bucket.
   *
   * @param identity The principal
   * @param objectsKeyPattern Restrict the permission to a certain key pattern (default '*')
   */
  public grantDelete(identity: iam.IGrantable, objectsKeyPattern: any = '*') {
    return this.grant(identity, perms.BUCKET_DELETE_ACTIONS, [],
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
  public grantReadWrite(identity: iam.IGrantable, objectsKeyPattern: any = '*') {
    const bucketActions = perms.BUCKET_READ_ACTIONS.concat(perms.BUCKET_WRITE_ACTIONS);
    const keyActions = perms.KEY_READ_ACTIONS.concat(perms.KEY_WRITE_ACTIONS);

    return this.grant(identity,
      bucketActions,
      keyActions,
      this.bucketArn,
      this.arnForObjects(objectsKeyPattern));
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
   *
   * @param keyPrefix the prefix of S3 object keys (e.g. `home/*`). Default is "*".
   * @param allowedActions the set of S3 actions to allow. Default is "s3:GetObject".
   */
  public grantPublicAccess(keyPrefix = '*', ...allowedActions: string[]) {
    if (this.disallowPublicAccess) {
      throw new Error("Cannot grant public access when 'blockPublicPolicy' is enabled");
    }

    allowedActions = allowedActions.length > 0 ? allowedActions : [ 's3:GetObject' ];

    return iam.Grant.addToPrincipalOrResource({
      actions: allowedActions,
      resourceArns: [this.arnForObjects(keyPrefix)],
      grantee: new iam.Anyone(),
      resource: this,
    });
  }

  private grant(grantee: iam.IGrantable,
                bucketActions: string[],
                keyActions: string[],
                resourceArn: string, ...otherResourceArns: string[]) {
    const resources = [ resourceArn, ...otherResourceArns ];

    const crossAccountAccess = this.isGranteeFromAnotherAccount(grantee);
    let ret: iam.Grant;
    if (crossAccountAccess) {
      // if the access is cross-account, we need to trust the accessing principal in the bucket's policy
      ret = iam.Grant.addToPrincipalAndResource({
        grantee,
        actions: bucketActions,
        resourceArns: resources,
        resource: this,
      });
    } else {
      // if not, we don't need to modify the resource policy if the grantee is an identity principal
      ret = iam.Grant.addToPrincipalOrResource({
        grantee,
        actions: bucketActions,
        resourceArns: resources,
        resource: this,
      });
    }

    if (this.encryptionKey) {
      if (crossAccountAccess) {
        // we can't access the Key ARN (they don't have physical names),
        // so fall back on using '*'. ToDo we need to make this better... somehow
        iam.Grant.addToPrincipalAndResource({
          actions: keyActions,
          grantee,
          resourceArns: ['*'],
          resource: this.encryptionKey,
        });
      } else {
        this.encryptionKey.grant(grantee, ...keyActions);
      }
    }

    return ret;
  }

  private isGranteeFromAnotherAccount(grantee: iam.IGrantable): boolean {
    if (!(Construct.isConstruct(grantee))) {
      return false;
    }
    const bucketStack = Stack.of(this);
    const identityStack = Stack.of(grantee);
    return bucketStack.account !== identityStack.account;
  }
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

export class BlockPublicAccess {
  public static readonly BlockAll = new BlockPublicAccess({
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true
  });

  public static readonly BlockAcls = new BlockPublicAccess({
    blockPublicAcls: true,
    ignorePublicAcls: true
  });

  public blockPublicAcls: boolean | undefined;
  public blockPublicPolicy: boolean | undefined;
  public ignorePublicAcls: boolean | undefined;
  public restrictPublicBuckets: boolean | undefined;

  constructor(options: BlockPublicAccessOptions) {
    this.blockPublicAcls = options.blockPublicAcls;
    this.blockPublicPolicy = options.blockPublicPolicy;
    this.ignorePublicAcls = options.ignorePublicAcls;
    this.restrictPublicBuckets = options.restrictPublicBuckets;
  }
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
  readonly tagFilters?: {[tag: string]: any};
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
   * Physical name of this bucket.
   *
   * @default - Assigned by CloudFormation (recommended).
   */
  readonly bucketName?: PhysicalName;

  /**
   * Policy to apply when the bucket is removed from this stack.
   *
   * @default - The bucket will be orphaned.
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * Whether this bucket should have versioning turned on or not.
   *
   * @default false
   */
  readonly versioned?: boolean;

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
   * @default false New buckets and objects don't allow public access, but users can modify bucket
   * policies or object permissions to allow public access.
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
}

/**
 * An S3 bucket with associated policy objects
 *
 * This bucket does not yet have all features that exposed by the underlying
 * BucketResource.
 */
export class Bucket extends BucketBase {

  public static fromBucketArn(scope: Construct, id: string, bucketArn: string): IBucket {
    return Bucket.fromBucketAttributes(scope, id, { bucketArn });
  }

  public static fromBucketName(scope: Construct, id: string, bucketName: string): IBucket {
    return Bucket.fromBucketAttributes(scope, id, { bucketName });
  }

  /**
   * Creates a Bucket construct that represents an external bucket.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs A `BucketAttributes` object. Can be obtained from a call to
   * `bucket.export()` or manually created.
   */
  public static fromBucketAttributes(scope: Construct, id: string, attrs: BucketAttributes): IBucket {
    const stack = Stack.of(scope);
    const region = stack.region;
    const urlSuffix = stack.urlSuffix;

    const bucketName = parseBucketName(scope, attrs);
    if (!bucketName) {
      throw new Error('Bucket name is required');
    }

    const newUrlFormat = attrs.bucketWebsiteNewUrlFormat === undefined
      ? false
      : attrs.bucketWebsiteNewUrlFormat;

    const websiteUrl = newUrlFormat
      ? `${bucketName}.s3-website.${region}.${urlSuffix}`
      : `${bucketName}.s3-website-${region}.${urlSuffix}`;

    class Import extends BucketBase {
      public readonly bucketName = bucketName!;
      public readonly bucketArn = parseBucketArn(scope, attrs);
      public readonly bucketDomainName = attrs.bucketDomainName || `${bucketName}.s3.${urlSuffix}`;
      public readonly bucketWebsiteUrl = attrs.bucketWebsiteUrl || websiteUrl;
      public readonly bucketRegionalDomainName = attrs.bucketRegionalDomainName || `${bucketName}.s3.${region}.${urlSuffix}`;
      public readonly bucketDualStackDomainName = attrs.bucketDualStackDomainName || `${bucketName}.s3.dualstack.${region}.${urlSuffix}`;
      public readonly bucketWebsiteNewUrlFormat = newUrlFormat;
      public readonly encryptionKey?: kms.IKey;
      public policy?: BucketPolicy = undefined;
      protected autoCreatePolicy = false;
      protected disallowPublicAccess = false;

      /**
       * Exports this bucket from the stack.
       */
      public export() {
        return attrs;
      }
    }

    return new Import(scope, id);
  }

  public readonly bucketArn: string;
  public readonly bucketName: string;
  public readonly bucketDomainName: string;
  public readonly bucketWebsiteUrl: string;
  public readonly bucketDualStackDomainName: string;
  public readonly bucketRegionalDomainName: string;

  public readonly encryptionKey?: kms.IKey;
  public policy?: BucketPolicy;
  protected autoCreatePolicy = true;
  protected disallowPublicAccess?: boolean;
  private readonly lifecycleRules: LifecycleRule[] = [];
  private readonly versioned?: boolean;
  private readonly notifications: BucketNotifications;
  private readonly metrics: BucketMetrics[] = [];

  constructor(scope: Construct, id: string, props: BucketProps = {}) {
    super(scope, id, {
      physicalName: props.bucketName,
    });

    const { bucketEncryption, encryptionKey } = this.parseEncryption(props);
    if (props.bucketName && !Token.isUnresolved(props.bucketName)) {
      this.validateBucketName(props.bucketName);
    }

    const resource = new CfnBucket(this, 'Resource', {
      bucketName: this.physicalName.value,
      bucketEncryption,
      versioningConfiguration: props.versioned ? { status: 'Enabled' } : undefined,
      lifecycleConfiguration: Lazy.anyValue({ produce: () => this.parseLifecycleConfiguration() }),
      websiteConfiguration: this.renderWebsiteConfiguration(props),
      publicAccessBlockConfiguration: props.blockPublicAccess,
      metricsConfigurations: Lazy.anyValue({ produce: () => this.parseMetricConfiguration() })
    });

    applyRemovalPolicy(resource, props.removalPolicy !== undefined ? props.removalPolicy : RemovalPolicy.Orphan);

    this.versioned = props.versioned;
    this.encryptionKey = encryptionKey;

    const resourceIdentifiers = new ResourceIdentifiers(this, {
      arn: resource.bucketArn,
      name: resource.bucketName,
      arnComponents: {
        region: '',
        account: '',
        service: 's3',
        resource: this.physicalName.value || '',
      },
    });
    this.bucketArn = resourceIdentifiers.arn;
    this.bucketName = resourceIdentifiers.name;
    this.bucketDomainName = resource.bucketDomainName;
    this.bucketWebsiteUrl = resource.bucketWebsiteUrl;
    this.bucketDualStackDomainName = resource.bucketDualStackDomainName;
    this.bucketRegionalDomainName = resource.bucketRegionalDomainName;

    this.disallowPublicAccess = props.blockPublicAccess && props.blockPublicAccess.blockPublicPolicy;

    // Add all bucket metric configurations rules
    (props.metrics || []).forEach(this.addMetric.bind(this));

    // Add all lifecycle rules
    (props.lifecycleRules || []).forEach(this.addLifecycleRule.bind(this));

    // defines a BucketNotifications construct. Notice that an actual resource will only
    // be added if there are notifications added, so we don't need to condition this.
    this.notifications = new BucketNotifications(this, 'Notifications', { bucket: this });

    if (props.publicReadAccess) {
      this.grantPublicAccess();
    }
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
   * Adds a metrics configuration for the CloudWatch request metrics from the bucket.
   *
   * @param metric The metric configuration to add
   */
  public addMetric(metric: BucketMetrics) {
    this.metrics.push(metric);
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
   *    bucket.addEventNotification(EventType.OnObjectCreated, myLambda, 'home/myusername/*')
   *
   * @see
   * https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html
   */
  public addEventNotification(event: EventType, dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
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
  public addObjectCreatedNotification(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
    return this.addEventNotification(EventType.ObjectCreated, dest, ...filters);
  }

  /**
   * Subscribes a destination to receive notificatins when an object is
   * removed from the bucket. This is identical to calling
   * `onEvent(EventType.ObjectRemoved)`.
   *
   * @param dest The notification destination (see onEvent)
   * @param filters Filters (see onEvent)
   */
  public addObjectRemovedNotification(dest: IBucketNotificationDestination, ...filters: NotificationKeyFilter[]) {
    return this.addEventNotification(EventType.ObjectRemoved, dest, ...filters);
  }

  private validateBucketName(physicalName: PhysicalName): void {
    const bucketName = physicalName.value;
    if (!bucketName || Token.isUnresolved(bucketName)) {
      // the name is a late-bound value, not a defined string,
      // so skip validation
      return;
    }

    const errors: string[] = [];

    // Rules codified from https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html
    if (bucketName.length < 3 || bucketName.length > 63) {
      errors.push('Bucket name must be at least 3 and no more than 63 characters');
    }
    const charsetMatch = bucketName.match(/[^a-z0-9.-]/);
    if (charsetMatch) {
      errors.push('Bucket name must only contain lowercase characters and the symbols, period (.) and dash (-) '
        + `(offset: ${charsetMatch.index})`);
    }
    if (!/[a-z0-9]/.test(bucketName.charAt(0))) {
      errors.push('Bucket name must start and end with a lowercase character or number '
        + '(offset: 0)');
    }
    if (!/[a-z0-9]/.test(bucketName.charAt(bucketName.length - 1))) {
      errors.push('Bucket name must start and end with a lowercase character or number '
        + `(offset: ${bucketName.length - 1})`);
    }
    const consecSymbolMatch = bucketName.match(/\.-|-\.|\.\./);
    if (consecSymbolMatch) {
      errors.push('Bucket name must not have dash next to period, or period next to dash, or consecutive periods '
        + `(offset: ${consecSymbolMatch.index})`);
    }
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(bucketName)) {
      errors.push('Bucket name must not resemble an IP address');
    }

    if (errors.length > 0) {
      throw new Error(`Invalid S3 bucket name (value: ${bucketName})${EOL}${errors.join(EOL)}`);
    }
  }

  /**
   * Set up key properties and return the Bucket encryption property from the
   * user's configuration.
   */
  private parseEncryption(props: BucketProps): {
    bucketEncryption?: CfnBucket.BucketEncryptionProperty,
    encryptionKey?: kms.IKey
  } {

    // default based on whether encryptionKey is specified
    let encryptionType = props.encryption;
    if (encryptionType === undefined) {
      encryptionType = props.encryptionKey ? BucketEncryption.Kms : BucketEncryption.Unencrypted;
    }

    // if encryption key is set, encryption must be set to KMS.
    if (encryptionType !== BucketEncryption.Kms && props.encryptionKey) {
      throw new Error(`encryptionKey is specified, so 'encryption' must be set to KMS (value: ${encryptionType})`);
    }

    if (encryptionType === BucketEncryption.Unencrypted) {
      return { bucketEncryption: undefined, encryptionKey: undefined };
    }

    if (encryptionType === BucketEncryption.Kms) {
      const encryptionKey = props.encryptionKey || new kms.Key(this, 'Key', {
        description: `Created by ${this.node.path}`
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
  private parseLifecycleConfiguration(): CfnBucket.LifecycleConfigurationProperty | undefined {
    if (!this.lifecycleRules || this.lifecycleRules.length === 0) {
      return undefined;
    }

    const self = this;

    return { rules: this.lifecycleRules.map(parseLifecycleRule) };

    function parseLifecycleRule(rule: LifecycleRule): CfnBucket.RuleProperty {
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
        tagFilters: self.parseTagFilters(rule.tagFilters)
      };

      return x;
    }
  }

  private parseMetricConfiguration(): CfnBucket.MetricsConfigurationProperty[] | undefined {
    if (!this.metrics || this.metrics.length === 0) {
      return undefined;
    }

    const self = this;

    return this.metrics.map(parseMetric);

    function parseMetric(metric: BucketMetrics): CfnBucket.MetricsConfigurationProperty {
      return {
        id: metric.id,
        prefix: metric.prefix,
        tagFilters: self.parseTagFilters(metric.tagFilters)
      };
    }
  }

  private parseTagFilters(tagFilters?: {[tag: string]: any}) {
    if (!tagFilters || tagFilters.length === 0) {
      return undefined;
    }

    return Object.keys(tagFilters).map(tag => ({
      key: tag,
      value: tagFilters[tag]
    }));
  }

  private renderWebsiteConfiguration(props: BucketProps): CfnBucket.WebsiteConfigurationProperty | undefined {
    if (!props.websiteErrorDocument && !props.websiteIndexDocument) {
      return undefined;
    }

    if (props.websiteErrorDocument && !props.websiteIndexDocument) {
      throw new Error(`"websiteIndexDocument" is required if "websiteErrorDocument" is set`);
    }

    return {
      indexDocument: props.websiteIndexDocument,
      errorDocument: props.websiteErrorDocument
    };
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
