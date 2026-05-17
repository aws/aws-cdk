import { EOL } from 'os';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3vectors from 'aws-cdk-lib/aws-s3vectors';
import type { IResource, ITaggableV2, RemovalPolicy, TagManager } from 'aws-cdk-lib/core';
import { Resource, Token, UnscopedValidationError } from 'aws-cdk-lib/core';
import { lit, memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import * as perms from './permissions';
import { validateVectorBucketAttributes } from './util';
import { VectorBucketPolicy } from './vector-bucket-policy';

/**
 * Interface definition for S3 Vector Buckets.
 */
export interface IVectorBucket extends IResource {
  /**
   * The ARN of the vector bucket.
   * @attribute
   */
  readonly vectorBucketArn: string;

  /**
   * The name of the vector bucket.
   * @attribute
   */
  readonly vectorBucketName: string;

  /**
   * The accountId containing the vector bucket.
   * @attribute
   */
  readonly account?: string;

  /**
   * The region containing the vector bucket.
   * @attribute
   */
  readonly region?: string;

  /**
   * Optional KMS encryption key associated with this vector bucket.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Adds a statement to the resource policy for a principal (i.e. account/role/service)
   * to perform actions on this vector bucket and/or its indexes.
   *
   * Note that the policy statement may or may not be added to the policy.
   * For example, when an `IVectorBucket` is created from an existing vector bucket,
   * it's not possible to tell whether the bucket already has a policy attached,
   * let alone to re-use that policy to add more statements to it. So it's safest
   * to do nothing in these cases.
   *
   * @param statement the policy statement to be added to the bucket's policy.
   * @returns metadata about the execution of this method. If the policy was not
   * added, the value of `statementAdded` will be `false`. You should always check
   * this value to make sure that the operation was actually carried out. Otherwise,
   * synthesis and deploy will terminate silently, which may be confusing.
   */
  addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;

  /**
   * Grant read permissions for this vector bucket and its indexes to an IAM
   * principal (Role/Group/User).
   *
   * If encryption is used, permission to use the key to decrypt the contents of
   * the bucket will also be granted to the same principal.
   *
   * @param identity The principal to allow read permissions to
   * @param indexName Allow the permissions to all indexes using '*' or to a single index by its name.
   */
  grantRead(identity: iam.IGrantable, indexName: string): iam.Grant;

  /**
   * Grant write permissions for this vector bucket and its indexes to an IAM
   * principal (Role/Group/User).
   *
   * If encryption is used, permission to use the key to encrypt the contents of
   * the bucket will also be granted to the same principal.
   *
   * @param identity The principal to allow write permissions to
   * @param indexName Allow the permissions to all indexes using '*' or to a single index by its name.
   */
  grantWrite(identity: iam.IGrantable, indexName: string): iam.Grant;

  /**
   * Grant read and write permissions for this vector bucket and its indexes to
   * an IAM principal (Role/Group/User).
   *
   * If encryption is used, permission to use the key to encrypt/decrypt the
   * contents of the bucket will also be granted to the same principal.
   *
   * @param identity The principal to allow read and write permissions to
   * @param indexName Allow the permissions to all indexes using '*' or to a single index by its name.
   */
  grantReadWrite(identity: iam.IGrantable, indexName: string): iam.Grant;
}

/**
 * Controls Server Side Encryption (SSE) for this VectorBucket.
 */
export enum VectorBucketEncryption {
  /**
   * Use a customer-managed KMS key for encryption.
   * If `encryptionKey` is specified, that key will be used; otherwise a new key will be created.
   */
  KMS = 'aws:kms',

  /**
   * Use S3-managed encryption keys with AES256 encryption.
   */
  S3_MANAGED = 'AES256',
}

abstract class VectorBucketBase extends Resource implements IVectorBucket {
  public abstract readonly vectorBucketArn: string;
  public abstract readonly vectorBucketName: string;

  /**
   * The resource policy associated with this vector bucket.
   *
   * If `autoCreatePolicy` is true, a `VectorBucketPolicy` will be created upon
   * the first call to `addToResourcePolicy()`.
   */
  public abstract vectorBucketPolicy?: VectorBucketPolicy;

  /**
   * Indicates if a vector bucket resource policy should be automatically created
   * upon the first call to `addToResourcePolicy`.
   */
  protected abstract autoCreatePolicy: boolean;

  public abstract encryptionKey?: kms.IKey | undefined;

  public addToResourcePolicy(
    statement: iam.PolicyStatement,
  ): iam.AddToResourcePolicyResult {
    if (!this.vectorBucketPolicy && this.autoCreatePolicy) {
      this.vectorBucketPolicy = new VectorBucketPolicy(this, 'DefaultPolicy', {
        vectorBucket: this,
      });
    }

    if (this.vectorBucketPolicy) {
      this.vectorBucketPolicy.document.addStatements(statement);
      return { statementAdded: true, policyDependable: this.vectorBucketPolicy };
    }

    return { statementAdded: false };
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantRead(identity: iam.IGrantable, indexName: string) {
    return this.grant(
      identity,
      perms.VECTOR_BUCKET_READ_ACCESS,
      perms.KEY_READ_ACCESS,
      this.vectorBucketArn,
      this.getIndexArn(indexName),
    );
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantWrite(identity: iam.IGrantable, indexName: string) {
    return this.grant(
      identity,
      perms.VECTOR_BUCKET_WRITE_ACCESS,
      perms.KEY_READ_WRITE_ACCESS,
      this.vectorBucketArn,
      this.getIndexArn(indexName),
    );
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantReadWrite(identity: iam.IGrantable, indexName: string) {
    return this.grant(
      identity,
      perms.VECTOR_BUCKET_READ_WRITE_ACCESS,
      perms.KEY_READ_WRITE_ACCESS,
      this.vectorBucketArn,
      this.getIndexArn(indexName),
    );
  }

  private grant(
    grantee: iam.IGrantable,
    vectorBucketActions: string[],
    keyActions: string[],
    resourceArn: string,
    indexArn?: string,
  ) {
    const resources = [resourceArn, indexArn].filter((arn): arn is string => arn !== undefined);

    const grant = iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: vectorBucketActions,
      resourceArns: resources,
      resource: this,
    });

    if (this.encryptionKey && keyActions && keyActions.length !== 0) {
      this.encryptionKey.grant(grantee, ...keyActions);
    }

    return grant;
  }

  private getIndexArn(indexName: string | undefined) {
    return indexName ? `${this.vectorBucketArn}/index/${indexName}` : undefined;
  }
}

/**
 * Parameters for constructing a VectorBucket.
 */
export interface VectorBucketProps {
  /**
   * Name for this vector bucket.
   *
   * Must be 3-63 characters, lowercase letters, numbers, and hyphens only, and
   * must start and end with a letter or number.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-buckets-naming.html
   *
   * @default - CloudFormation generates a unique physical name.
   */
  readonly vectorBucketName?: string;

  /**
   * The kind of server-side encryption to apply to this bucket.
   *
   * If you choose KMS, you can specify a KMS key via `encryptionKey`. If the
   * encryption key is not specified, a key will automatically be created.
   *
   * @default - `KMS` if `encryptionKey` is specified, or `S3_MANAGED` otherwise.
   */
  readonly encryption?: VectorBucketEncryption;

  /**
   * External KMS key to use for bucket encryption.
   *
   * The `encryption` property must be either not specified or set to `KMS`.
   * An error will be emitted if `encryption` is set to `S3_MANAGED`.
   *
   * @default - If `encryption` is set to `KMS` and this property is undefined,
   * a new KMS key will be created and associated with this bucket.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Controls what happens to this vector bucket if it stops being managed by
   * CloudFormation.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * A reference to a vector bucket outside this stack.
 *
 * The vectorBucketName, region, and account can be provided explicitly or will
 * be inferred from the vectorBucketArn.
 */
export interface VectorBucketAttributes {
  /**
   * AWS region this vector bucket exists in.
   * @default - region inferred from scope
   */
  readonly region?: string;

  /**
   * The accountId containing this vector bucket.
   * @default - account inferred from scope
   */
  readonly account?: string;

  /**
   * The vector bucket name, unique per region.
   * @default - vectorBucketName inferred from arn
   */
  readonly vectorBucketName?: string;

  /**
   * The vector bucket's ARN.
   * @default - vectorBucketArn constructed from region, account and vectorBucketName
   */
  readonly vectorBucketArn?: string;

  /**
   * Optional KMS encryption key associated with this bucket.
   * @default - undefined
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * An S3 Vector bucket with helpers for associated resource policies.
 *
 * This bucket may not yet have all features that are exposed by the underlying
 * CfnVectorBucket.
 *
 * @stateful
 * @example
 * const sampleVectorBucket = new VectorBucket(scope, 'SampleVectorBucket', {
 *   vectorBucketName: 'sample-vector-bucket',
 * });
 */
@propertyInjectable
export class VectorBucket extends VectorBucketBase implements ITaggableV2 {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-s3vectors-alpha.VectorBucket';

  /**
   * Defines a VectorBucket construct from an external vector bucket ARN.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param vectorBucketArn Amazon Resource Name (arn) of the vector bucket
   */
  public static fromVectorBucketArn(scope: Construct, id: string, vectorBucketArn: string): IVectorBucket {
    return VectorBucket.fromVectorBucketAttributes(scope, id, { vectorBucketArn });
  }

  /**
   * Defines a VectorBucket construct that represents an external vector bucket.
   *
   * @param scope The parent creating construct (usually `this`).
   * @param id The construct's name.
   * @param attrs A `VectorBucketAttributes` object. Can be manually created.
   */
  public static fromVectorBucketAttributes(
    scope: Construct,
    id: string,
    attrs: VectorBucketAttributes,
  ): IVectorBucket {
    const { vectorBucketName, region, account, vectorBucketArn } = validateVectorBucketAttributes(scope, attrs);
    VectorBucket.validateVectorBucketName(vectorBucketName);
    class Import extends VectorBucketBase {
      public readonly vectorBucketName = vectorBucketName!;
      public readonly vectorBucketArn = vectorBucketArn;
      public readonly vectorBucketPolicy?: VectorBucketPolicy;
      public readonly region = region;
      public readonly account = account;
      public readonly encryptionKey?: kms.IKey = attrs.encryptionKey;
      protected autoCreatePolicy: boolean = false;

      public export() {
        return attrs;
      }
    }

    return new Import(scope, id, {
      account,
      region,
      physicalName: vectorBucketName,
    });
  }

  /**
   * Returns true if the given object is a VectorBucket.
   */
  public static isVectorBucket(x: any): x is VectorBucket {
    return x !== null && typeof x === 'object' && VECTOR_BUCKET_SYMBOL in x;
  }

  /**
   * Throws an exception if the given vector bucket name is not valid.
   *
   * @param bucketName name of the bucket.
   */
  public static validateVectorBucketName(
    bucketName: string | undefined,
  ) {
    if (bucketName == undefined || Token.isUnresolved(bucketName)) {
      // the name is a late-bound value, not a defined string, so skip validation
      return;
    }

    const errors: string[] = [];

    // Length validation
    if (bucketName.length < 3 || bucketName.length > 63) {
      errors.push(
        'Bucket name must be at least 3 and no more than 63 characters',
      );
    }

    // Character set validation
    const illegalCharsetRegEx = /[^a-z0-9-]/;
    const allowedEdgeCharsetRegEx = /[a-z0-9]/;

    const illegalCharMatch = bucketName.match(illegalCharsetRegEx);
    if (illegalCharMatch) {
      errors.push(
        'Bucket name must only contain lowercase characters, numbers, and hyphens (-)' +
          ` (offset: ${illegalCharMatch.index})`,
      );
    }

    // Edge character validation
    if (bucketName.length > 0 && !allowedEdgeCharsetRegEx.test(bucketName.charAt(0))) {
      errors.push(
        'Bucket name must start with a lowercase letter or number (offset: 0)',
      );
    }
    if (
      bucketName.length > 0 && !allowedEdgeCharsetRegEx.test(bucketName.charAt(bucketName.length - 1))
    ) {
      errors.push(
        `Bucket name must end with a lowercase letter or number (offset: ${
          bucketName.length - 1
        })`,
      );
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(
        lit`InvalidVectorBucketName`,
        `Invalid S3 vector bucket name (value: ${bucketName})${EOL}${errors.join(EOL)}`,
      );
    }
  }

  /**
   * The underlying CfnVectorBucket L1 resource.
   * @internal
   */
  private readonly resource: s3vectors.CfnVectorBucket;

  /**
   * The tag manager for this resource.
   */
  public readonly cdkTagManager: TagManager;

  /**
   * The resource policy for this vector bucket. Created on first
   * `addToResourcePolicy` call.
   */
  public vectorBucketPolicy?: VectorBucketPolicy;

  public readonly encryptionKey?: kms.IKey | undefined;

  protected autoCreatePolicy: boolean = true;

  constructor(scope: Construct, id: string, props: VectorBucketProps = {}) {
    super(scope, id, {
      physicalName: props.vectorBucketName,
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    Object.defineProperty(this, VECTOR_BUCKET_SYMBOL, { value: true });

    VectorBucket.validateVectorBucketName(props.vectorBucketName);
    const { bucketEncryption, encryptionKey } = this.parseEncryption(props);
    this.encryptionKey = encryptionKey;

    this.resource = new s3vectors.CfnVectorBucket(this, 'Resource', {
      vectorBucketName: props.vectorBucketName,
      encryptionConfiguration: bucketEncryption,
    });

    this.cdkTagManager = this.resource.cdkTagManager;
    this.resource.applyRemovalPolicy(props.removalPolicy);
  }

  /**
   * The name of this vector bucket.
   */
  @memoizedGetter
  public get vectorBucketName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  /**
   * The unique Amazon Resource Name (arn) of this vector bucket.
   */
  @memoizedGetter
  public get vectorBucketArn(): string {
    return this.resource.attrVectorBucketArn;
  }

  /**
   * Set up key properties and return the Bucket encryption property from the
   * user's configuration, according to the following table:
   *
   * | props.encryption | props.encryptionKey | bucketEncryption (return value) | encryptionKey (return value)  |
   * |------------------|---------------------|---------------------------------|-------------------------------|
   * | undefined        | undefined           | undefined                       | undefined                     |
   * | undefined        | k                   | aws:kms                         | k                             |
   * | KMS              | undefined           | aws:kms                         | new key                       |
   * | KMS              | k                   | aws:kms                         | k                             |
   * | S3_MANAGED       | undefined           | AES256                          | undefined                     |
   * | S3_MANAGED       | k                   | ERROR!                          | ERROR!                        |
   */
  private parseEncryption(props: VectorBucketProps): {
    bucketEncryption?: s3vectors.CfnVectorBucket.EncryptionConfigurationProperty;
    encryptionKey?: kms.IKey;
  } {
    const encryptionType = props.encryption;
    let key = props.encryptionKey;

    if (encryptionType === undefined) {
      if (key === undefined) {
        return {};
      } else {
        return {
          bucketEncryption: {
            kmsKeyArn: key.keyArn,
            sseType: VectorBucketEncryption.KMS,
          },
          encryptionKey: key,
        };
      }
    }

    if (encryptionType === VectorBucketEncryption.KMS) {
      if (key === undefined) {
        key = new kms.Key(this, 'Key', {
          description: `Created by ${this.node.path}`,
          enableKeyRotation: true,
        });
      }
      return {
        bucketEncryption: {
          kmsKeyArn: key.keyArn,
          sseType: VectorBucketEncryption.KMS,
        },
        encryptionKey: key,
      };
    }

    if (encryptionType === VectorBucketEncryption.S3_MANAGED) {
      if (key === undefined) {
        return {
          bucketEncryption: {
            sseType: VectorBucketEncryption.S3_MANAGED,
          },
        };
      } else {
        throw new UnscopedValidationError(lit`InvalidEncryptionConfiguration`, 'Expected encryption = `KMS` with user provided encryption key');
      }
    }
    throw new UnscopedValidationError(lit`UnknownEncryptionConfiguration`, `Unknown encryption configuration: ${JSON.stringify(props.encryption)}`);
  }
}

const VECTOR_BUCKET_SYMBOL = Symbol.for('@aws-cdk/aws-s3vectors-alpha.VectorBucket');
