import { EOL } from 'os';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3vectors from 'aws-cdk-lib/aws-s3vectors';
import type { IResource, ITaggableV2, RemovalPolicy, TagManager } from 'aws-cdk-lib/core';
import { ArnFormat, Resource, Stack, Token, UnscopedValidationError } from 'aws-cdk-lib/core';
import { lit, memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import * as perms from './permissions';
import { VectorBucketEncryption, type IVectorBucket } from './vector-bucket';

/**
 * The data type of the vectors to be inserted into the vector index.
 */
export enum VectorDataType {
  /**
   * 32-bit single-precision floating point values. This is currently the only
   * data type supported by S3 Vectors.
   */
  FLOAT32 = 'float32',
}

/**
 * The distance metric used for similarity search on the vector index.
 */
export enum DistanceMetric {
  /**
   * Cosine similarity.
   */
  COSINE = 'cosine',

  /**
   * Euclidean distance.
   */
  EUCLIDEAN = 'euclidean',
}

/**
 * Interface definition for S3 Vector Indexes.
 */
export interface IVectorIndex extends IResource {
  /**
   * The ARN of the vector index.
   * @attribute
   */
  readonly indexArn: string;

  /**
   * The name of the vector index.
   * @attribute
   */
  readonly indexName: string;

  /**
   * The parent vector bucket that contains this index.
   */
  readonly vectorBucket: IVectorBucket;

  /**
   * Optional KMS encryption key associated with this vector index.
   *
   * If the index does not override the bucket's encryption settings, this is
   * the KMS key inherited from the parent vector bucket (if any).
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Add a statement to the resource policy that protects this vector index.
   *
   * S3 Vectors does not expose a per-index resource policy: index-level
   * permissions are stored on the parent vector bucket's policy, scoped to
   * this index's ARN. Statements added through this method are therefore
   * forwarded to `vectorBucket.addToResourcePolicy(...)`.
   *
   * @param statement the policy statement to be added.
   * @returns metadata about the execution of this method. Mirrors the
   * semantics of `IVectorBucket.addToResourcePolicy` — if the parent bucket
   * is imported and has no mutable policy, `statementAdded` will be `false`.
   */
  addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;

  /**
   * Grant read permissions for this vector index to an IAM principal
   * (Role/Group/User).
   *
   * If encryption is used on the parent bucket, permission to use the key to
   * decrypt vector contents will also be granted.
   *
   * @param identity The principal to allow read permissions to
   */
  grantRead(identity: iam.IGrantable): iam.Grant;

  /**
   * Grant write permissions for this vector index to an IAM principal
   * (Role/Group/User).
   *
   * If encryption is used on the parent bucket, permission to use the key to
   * encrypt vector contents will also be granted.
   *
   * @param identity The principal to allow write permissions to
   */
  grantWrite(identity: iam.IGrantable): iam.Grant;

  /**
   * Grant read and write permissions for this vector index to an IAM principal
   * (Role/Group/User).
   *
   * If encryption is used on the parent bucket, permission to use the key to
   * encrypt/decrypt vector contents will also be granted.
   *
   * @param identity The principal to allow read and write permissions to
   */
  grantReadWrite(identity: iam.IGrantable): iam.Grant;
}

abstract class VectorIndexBase extends Resource implements IVectorIndex {
  public abstract readonly indexArn: string;
  public abstract readonly indexName: string;
  public abstract readonly vectorBucket: IVectorBucket;
  public abstract readonly encryptionKey?: kms.IKey;

  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    return this.vectorBucket.addToResourcePolicy(statement);
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantRead(identity: iam.IGrantable) {
    return this.grant(identity, perms.VECTOR_INDEX_READ_ACCESS, perms.KEY_READ_ACCESS);
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantWrite(identity: iam.IGrantable) {
    return this.grant(identity, perms.VECTOR_INDEX_WRITE_ACCESS, perms.KEY_READ_WRITE_ACCESS);
  }

  /**
   * [disable-awslint:no-grants]
   */
  public grantReadWrite(identity: iam.IGrantable) {
    return this.grant(identity, perms.VECTOR_INDEX_READ_WRITE_ACCESS, perms.KEY_READ_WRITE_ACCESS);
  }

  private grant(
    grantee: iam.IGrantable,
    indexActions: string[],
    keyActions: string[],
  ) {
    const grant = iam.Grant.addToPrincipalOrResource({
      grantee,
      actions: indexActions,
      resourceArns: [this.indexArn],
      resource: this.vectorBucket,
    });

    if (this.encryptionKey && keyActions.length !== 0) {
      this.encryptionKey.grant(grantee, ...keyActions);
    }

    return grant;
  }
}

/**
 * Parameters for constructing a VectorIndex.
 */
export interface VectorIndexProps {
  /**
   * The vector bucket to create this index in.
   */
  readonly vectorBucket: IVectorBucket;

  /**
   * Name for this vector index.
   *
   * Must be 3-63 characters, lowercase letters, numbers, hyphens (-) and dots
   * (.) only, and must start and end with a letter or number.
   *
   * @default - CloudFormation generates a unique physical name.
   */
  readonly indexName?: string;

  /**
   * The dimensionality of the vectors stored in this index.
   *
   * Must be an integer between 1 and 4096.
   */
  readonly dimension: number;

  /**
   * The data type of the vectors stored in this index.
   */
  readonly dataType: VectorDataType;

  /**
   * The distance metric used for similarity search on this index.
   */
  readonly distanceMetric: DistanceMetric;

  /**
   * The kind of server-side encryption to apply to this index.
   *
   * When omitted (and `encryptionKey` is also omitted), no
   * `EncryptionConfiguration` is sent to CloudFormation, and S3 Vectors
   * applies the parent bucket's encryption settings to vectors stored in
   * this index.
   *
   * @default - inherits the encryption configuration of the parent vector bucket.
   */
  readonly encryption?: VectorBucketEncryption;

  /**
   * External KMS key to use for index encryption.
   *
   * The `encryption` property must be either not specified or set to `KMS`.
   * An error will be emitted if `encryption` is set to `S3_MANAGED`.
   *
   * @default - inherits the encryption key from the parent vector bucket (if any).
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Metadata keys that will not be available for filtering on vector queries.
   *
   * Non-filterable metadata keys allow you to enrich vectors with additional
   * context during storage and retrieval, but cannot be used as query filters.
   *
   * Must contain 1 to 10 keys, each 1 to 63 characters long.
   *
   * @default - all metadata keys on stored vectors are filterable.
   */
  readonly nonFilterableMetadataKeys?: string[];

  /**
   * Controls what happens to this index if it stops being managed by
   * CloudFormation.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * A reference to a vector index outside this stack.
 */
export interface VectorIndexAttributes {
  /**
   * The vector bucket that contains this index.
   */
  readonly vectorBucket: IVectorBucket;

  /**
   * The ARN of the vector index.
   * @default - indexArn derived from `vectorBucket.vectorBucketArn` and `indexName`.
   */
  readonly indexArn?: string;

  /**
   * The name of the vector index.
   * @default - indexName inferred from `indexArn`.
   */
  readonly indexName?: string;
}

/**
 * An S3 Vector Index inside a VectorBucket.
 *
 * @stateful
 * @resource AWS::S3Vectors::Index
 * @example
 * declare const vectorBucket: VectorBucket;
 * const index = new VectorIndex(scope, 'ExampleIndex', {
 *   vectorBucket,
 *   indexName: 'example-index',
 *   dimension: 1024,
 *   dataType: VectorDataType.FLOAT32,
 *   distanceMetric: DistanceMetric.COSINE,
 * });
 */
@propertyInjectable
export class VectorIndex extends VectorIndexBase implements ITaggableV2 {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-s3vectors-alpha.VectorIndex';

  /**
   * Defines a VectorIndex construct that represents an external vector index.
   */
  public static fromVectorIndexAttributes(scope: Construct, id: string, attrs: VectorIndexAttributes): IVectorIndex {
    const { vectorBucket } = attrs;
    let indexArn = attrs.indexArn;
    let indexName = attrs.indexName;

    if (!indexArn && indexName) {
      indexArn = `${vectorBucket.vectorBucketArn}/index/${indexName}`;
    }

    if (!indexName && indexArn && !Token.isUnresolved(indexArn)) {
      const resourceName = Stack.of(scope).splitArn(indexArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName;
      if (resourceName) {
        // Expected resourceName shape: '<bucketName>/index/<indexName>'
        const parts = resourceName.split('/');
        if (parts.length !== 3 || parts[1] !== 'index') {
          throw new UnscopedValidationError(
            lit`InvalidVectorIndexArn`,
            `Expected an ARN of the form 'arn:...:bucket/<bucket>/index/<index>', got: ${JSON.stringify(indexArn)}`,
          );
        }
        indexName = parts[2];
      }
    }

    if (!indexArn || !indexName) {
      throw new UnscopedValidationError(
        lit`CannotDetermineVectorIndexIdentity`,
        'Either `indexArn` or `indexName` must be provided to fromVectorIndexAttributes',
      );
    }

    const resolvedIndexArn = indexArn;
    const resolvedIndexName = indexName;

    class Import extends VectorIndexBase {
      public readonly vectorBucket = vectorBucket;
      public readonly indexArn = resolvedIndexArn;
      public readonly indexName = resolvedIndexName;
      public readonly encryptionKey = vectorBucket.encryptionKey;
    }

    return new Import(scope, id);
  }

  /**
   * Returns true if the given object is a VectorIndex.
   */
  public static isVectorIndex(x: any): x is VectorIndex {
    return x !== null && typeof x === 'object' && VECTOR_INDEX_SYMBOL in x;
  }

  /**
   * Throws an exception if the given vector index name is not valid.
   */
  public static validateIndexName(indexName: string | undefined): void {
    if (indexName == undefined || Token.isUnresolved(indexName)) {
      return;
    }

    const errors: string[] = [];

    if (indexName.length < 3 || indexName.length > 63) {
      errors.push('Index name must be at least 3 and no more than 63 characters');
    }

    const illegalCharsetRegEx = /[^a-z0-9.-]/;
    const allowedEdgeCharsetRegEx = /[a-z0-9]/;

    const illegalCharMatch = indexName.match(illegalCharsetRegEx);
    if (illegalCharMatch) {
      errors.push(
        'Index name must only contain lowercase letters, numbers, hyphens (-), and dots (.)' +
          ` (offset: ${illegalCharMatch.index})`,
      );
    }

    if (indexName.length > 0 && !allowedEdgeCharsetRegEx.test(indexName.charAt(0))) {
      errors.push('Index name must start with a lowercase letter or number (offset: 0)');
    }
    if (indexName.length > 0 && !allowedEdgeCharsetRegEx.test(indexName.charAt(indexName.length - 1))) {
      errors.push(`Index name must end with a lowercase letter or number (offset: ${indexName.length - 1})`);
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(
        lit`InvalidVectorIndexName`,
        `Invalid S3 vector index name (value: ${indexName})${EOL}${errors.join(EOL)}`,
      );
    }
  }

  /**
   * Throws an exception if the given dimension is not valid.
   */
  public static validateDimension(dimension: number): void {
    if (Token.isUnresolved(dimension)) {
      return;
    }
    if (!Number.isInteger(dimension) || dimension < 1 || dimension > 4096) {
      throw new UnscopedValidationError(
        lit`InvalidVectorIndexDimension`,
        `Dimension must be an integer in [1, 4096] (value: ${JSON.stringify(dimension)})`,
      );
    }
  }

  /**
   * Throws an exception if the given non-filterable metadata key list is not valid.
   */
  public static validateNonFilterableMetadataKeys(keys: string[] | undefined): void {
    if (keys == undefined || Token.isUnresolved(keys)) {
      return;
    }
    if (keys.length < 1 || keys.length > 10) {
      throw new UnscopedValidationError(
        lit`InvalidNonFilterableMetadataKeys`,
        `nonFilterableMetadataKeys must have between 1 and 10 entries (received ${keys.length})`,
      );
    }
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (Token.isUnresolved(key)) {
        continue;
      }
      if (key.length < 1 || key.length > 63) {
        throw new UnscopedValidationError(
          lit`InvalidNonFilterableMetadataKeys`,
          `nonFilterableMetadataKeys[${i}] must be between 1 and 63 characters (value: ${JSON.stringify(key)})`,
        );
      }
    }
  }

  /**
   * The underlying CfnIndex L1 resource.
   * @internal
   */
  private readonly resource: s3vectors.CfnIndex;

  /**
   * The tag manager for this resource.
   */
  public readonly cdkTagManager: TagManager;

  public readonly vectorBucket: IVectorBucket;

  public readonly encryptionKey?: kms.IKey;

  constructor(scope: Construct, id: string, props: VectorIndexProps) {
    super(scope, id, {
      physicalName: props.indexName,
    });

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);
    Object.defineProperty(this, VECTOR_INDEX_SYMBOL, { value: true });

    VectorIndex.validateIndexName(props.indexName);
    VectorIndex.validateDimension(props.dimension);
    VectorIndex.validateNonFilterableMetadataKeys(props.nonFilterableMetadataKeys);

    const { encryptionConfiguration, encryptionKey } = this.parseEncryption(props);

    this.vectorBucket = props.vectorBucket;
    this.encryptionKey = encryptionKey;

    this.resource = new s3vectors.CfnIndex(this, 'Resource', {
      vectorBucketArn: props.vectorBucket.vectorBucketArn,
      indexName: props.indexName,
      dataType: props.dataType,
      dimension: props.dimension,
      distanceMetric: props.distanceMetric,
      encryptionConfiguration,
      metadataConfiguration: props.nonFilterableMetadataKeys
        ? { nonFilterableMetadataKeys: props.nonFilterableMetadataKeys }
        : undefined,
    });

    this.cdkTagManager = this.resource.cdkTagManager;
    this.resource.applyRemovalPolicy(props.removalPolicy);
  }

  /**
   * The name of this vector index.
   */
  @memoizedGetter
  public get indexName(): string {
    return this.getResourceNameAttribute(this.resource.ref);
  }

  /**
   * The unique Amazon Resource Name (arn) of this vector index.
   */
  @memoizedGetter
  public get indexArn(): string {
    return this.resource.attrIndexArn;
  }

  /**
   * Set up key properties and return the index encryption configuration from
   * the user's configuration, according to the following table:
   *
   * | props.encryption | props.encryptionKey | encryptionConfiguration (return value) | encryptionKey (return value)  |
   * |------------------|---------------------|----------------------------------------|-------------------------------|
   * | undefined        | undefined           | undefined                              | bucket.encryptionKey          |
   * | undefined        | k                   | aws:kms                                | k                             |
   * | KMS              | undefined           | aws:kms                                | new key                       |
   * | KMS              | k                   | aws:kms                                | k                             |
   * | S3_MANAGED       | undefined           | AES256                                 | undefined                     |
   * | S3_MANAGED       | k                   | ERROR!                                 | ERROR!                        |
   *
   * When `encryptionConfiguration` is `undefined`, no `EncryptionConfiguration`
   * is sent to CloudFormation, and S3 Vectors applies the parent bucket's
   * encryption settings to vectors stored in this index. In that case the
   * returned `encryptionKey` mirrors the bucket's key so grant helpers issue
   * the right kms permissions on the key that actually protects the data.
   */
  private parseEncryption(props: VectorIndexProps): {
    encryptionConfiguration?: s3vectors.CfnIndex.EncryptionConfigurationProperty;
    encryptionKey?: kms.IKey;
  } {
    const encryptionType = props.encryption;
    let key = props.encryptionKey;

    if (encryptionType === undefined) {
      if (key === undefined) {
        return { encryptionKey: props.vectorBucket.encryptionKey };
      } else {
        return {
          encryptionConfiguration: {
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
        encryptionConfiguration: {
          kmsKeyArn: key.keyArn,
          sseType: VectorBucketEncryption.KMS,
        },
        encryptionKey: key,
      };
    }

    if (encryptionType === VectorBucketEncryption.S3_MANAGED) {
      if (key !== undefined) {
        throw new UnscopedValidationError(
          lit`InvalidEncryptionConfiguration`,
          'Expected encryption = `KMS` when a user-provided encryption key is specified',
        );
      }
      return { encryptionConfiguration: { sseType: VectorBucketEncryption.S3_MANAGED } };
    }

    throw new UnscopedValidationError(
      lit`UnknownEncryptionConfiguration`,
      `Unknown encryption configuration: ${JSON.stringify(props.encryption)}`,
    );
  }
}

const VECTOR_INDEX_SYMBOL = Symbol.for('@aws-cdk/aws-s3vectors-alpha.VectorIndex');
