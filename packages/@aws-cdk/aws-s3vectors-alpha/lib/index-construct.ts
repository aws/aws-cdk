import { Fn, IResource, Resource, ResourceProps, Stack, Token } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { CfnIndex } from 'aws-cdk-lib/aws-s3vectors';
import { UnscopedValidationError } from 'aws-cdk-lib/core/lib/errors';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import { IVectorBucket } from './vector-bucket';

/**
 * Represents a Vector Index
 */
export interface IIndex extends IResource {
  /**
   * The ARN of the vector index
   *
   * @attribute
   */
  readonly indexArn: string;

  /**
   * The name of the vector index
   *
   * @attribute
   */
  readonly indexName: string;
}

/**
 * Distance metric for similarity search
 */
export enum DistanceMetric {
  /**
   * Cosine distance - measures the cosine of the angle between vectors
   *
   * Best for normalized vectors and when direction matters more than magnitude
   */
  COSINE = 'cosine',

  /**
   * Euclidean distance - measures the straight-line distance between vectors
   *
   * Best when both direction and magnitude are important
   */
  EUCLIDEAN = 'euclidean',
}

/**
 * Data type for vectors
 */
export enum DataType {
  /**
   * 32-bit floating point
   */
  FLOAT32 = 'float32',
}

/**
 * Encryption type for Vector Index
 */
export enum IndexEncryption {
  /**
   * Server-side encryption with Amazon S3 managed keys (SSE-S3)
   */
  S3_MANAGED = 'AES256',

  /**
   * Server-side encryption with AWS KMS managed keys (SSE-KMS)
   */
  KMS = 'aws:kms',
}

/**
 * Properties for defining a Vector Index
 */
export interface IndexProps extends ResourceProps {
  /**
   * The vector bucket that will contain this index
   */
  readonly vectorBucket: IVectorBucket;

  /**
   * The name of the vector index
   *
   * Must be unique within the vector bucket, between 3 and 63 characters long,
   * and begin and end with a letter or number
   *
   * @default - Automatically generated name
   */
  readonly indexName?: string;

  /**
   * The number of dimensions in the vectors
   *
   * All vectors added to the index must have exactly this number of values.
   * Must be an integer between 1 and 4096.
   */
  readonly dimension: number;

  /**
   * The distance metric to use for similarity search
   *
   * Choose your embedding model's recommended distance metric for more accurate results.
   *
   * @default DistanceMetric.COSINE
   */
  readonly distanceMetric?: DistanceMetric;

  /**
   * The data type of the vectors
   *
   * @default DataType.FLOAT32
   */
  readonly dataType?: DataType;

  /**
   * Metadata keys that should not be filterable
   *
   * These keys can be retrieved but cannot be used as query filters.
   * Useful for storing additional context like original text, URLs, or timestamps
   * that you want to retrieve with search results but don't need for filtering.
   *
   * Must be unique within the vector index, 1 to 63 characters long.
   * Up to 10 non-filterable metadata keys are supported per index.
   *
   * @default - All metadata is filterable
   */
  readonly nonFilterableMetadataKeys?: string[];

  /**
   * The type of server-side encryption to apply to this index
   *
   * By default, if you don't specify, all new vectors in the vector index
   * will use the encryption configuration of the vector bucket.
   *
   * @default - Uses the encryption configuration of the vector bucket
   */
  readonly encryption?: IndexEncryption;

  /**
   * External KMS key to use for index encryption
   *
   * The encryption property must be KMS for this to have any effect.
   *
   * @default - If encryption is set to KMS and this property is undefined,
   * a new KMS key will be created and associated with this index
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * A Vector Index for organizing and querying vector data
 *
 * @resource AWS::S3Vectors::Index
 */
@propertyInjectable
export class Index extends Resource implements IIndex {
  /**
   * Property injection ID for Index
   */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-s3vectors-alpha.Index';

  /**
   * Import an existing vector index by ARN
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param indexArn The ARN of the index
   */
  public static fromIndexArn(scope: Construct, id: string, indexArn: string): IIndex {
    // ARN format: arn:partition:s3vectors:region:account:bucket/bucket-name/index/index-name
    // Extract index name using Fn.split and Fn.select (index 3 = last part)
    const indexName = Fn.select(3, Fn.split('/', indexArn));

    class Import extends Resource implements IIndex {
      public readonly indexArn = indexArn;
      public readonly indexName = indexName;
    }

    return new Import(scope, id);
  }

  /**
   * The ARN of the vector index
   * @attribute
   */
  public readonly indexArn: string;

  /**
   * The name of the vector index
   * @attribute
   */
  public readonly indexName: string;

  /**
   * The vector bucket that contains this index
   */
  public readonly vectorBucket: IVectorBucket;

  /**
   * The number of dimensions in the vectors
   */
  public readonly dimension: number;

  /**
   * The distance metric used for similarity search
   */
  public readonly distanceMetric: DistanceMetric;

  /**
   * The data type of the vectors
   */
  public readonly dataType: DataType;

  /**
   * Optional KMS encryption key associated with this index
   */
  public readonly encryptionKey?: kms.IKey;

  constructor(scope: Construct, id: string, props: IndexProps) {
    super(scope, id, {
      physicalName: props.indexName,
    });

    // Validate configuration
    this.validateIndexName(props.indexName);
    this.validateDimension(props.dimension);
    this.validateNonFilterableMetadataKeys(props.nonFilterableMetadataKeys);

    this.vectorBucket = props.vectorBucket;
    this.dimension = props.dimension;
    this.distanceMetric = props.distanceMetric ?? DistanceMetric.COSINE;
    this.dataType = props.dataType ?? DataType.FLOAT32;

    const metadataConfiguration = props.nonFilterableMetadataKeys
      ? { nonFilterableMetadataKeys: props.nonFilterableMetadataKeys }
      : undefined;

    // Parse encryption configuration
    const { encryptionConfiguration, encryptionKey } = this.parseEncryption(props);
    this.encryptionKey = encryptionKey;

    const resource = new CfnIndex(this, 'Resource', {
      vectorBucketArn: props.vectorBucket.vectorBucketArn,
      indexName: props.indexName,
      dimension: this.dimension,
      distanceMetric: this.distanceMetric,
      dataType: this.dataType,
      metadataConfiguration,
      encryptionConfiguration,
    });

    this.indexArn = resource.attrIndexArn;
    this.indexName = Fn.select(3, Fn.split('/', this.indexArn));
  }

  /**
   * Validate index name
   *
   * @param indexName The index name to validate
   */
  private validateIndexName(indexName: string | undefined): void {
    if (indexName == undefined || Token.isUnresolved(indexName)) {
      return; // Skip validation for tokens
    }

    const errors: string[] = [];

    // Length check: 3-63 characters
    if (indexName.length < 3 || indexName.length > 63) {
      errors.push('Index name must be between 3 and 63 characters');
    }

    // Character set check: lowercase, numbers, hyphens, dots
    const illegalCharsetRegEx = /[^a-z0-9-.]/;
    if (illegalCharsetRegEx.test(indexName)) {
      errors.push('Index name must only contain lowercase characters, numbers, hyphens (-), and dots (.)');
    }

    // Start/end character check: lowercase or number
    const allowedEdgeCharsetRegEx = /[a-z0-9]/;
    if (!allowedEdgeCharsetRegEx.test(indexName.charAt(0))) {
      errors.push('Index name must start with a lowercase letter or number');
    }
    if (!allowedEdgeCharsetRegEx.test(indexName.charAt(indexName.length - 1))) {
      errors.push('Index name must end with a lowercase letter or number');
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(`Invalid index name (value: ${indexName})\n${errors.join('\n')}`);
    }
  }

  /**
   * Validate dimension value
   *
   * @param dimension The dimension value to validate
   */
  private validateDimension(dimension: number): void {
    if (dimension < 1 || dimension > 4096) {
      throw new UnscopedValidationError(
        `Dimension must be between 1 and 4096, got ${dimension}. ` +
        'Choose a dimension that matches your embedding model output.',
      );
    }
  }

  /**
   * Validate non-filterable metadata keys
   *
   * @param keys The non-filterable metadata keys to validate
   */
  private validateNonFilterableMetadataKeys(keys: string[] | undefined): void {
    if (!keys || keys.length === 0) {
      return;
    }

    const errors: string[] = [];

    // Maximum 10 keys
    if (keys.length > 10) {
      errors.push(`Maximum 10 non-filterable metadata keys are supported, got ${keys.length}`);
    }

    // Each key must be 1-63 characters
    keys.forEach((key, index) => {
      if (key.length < 1 || key.length > 63) {
        errors.push(`Non-filterable metadata key at index ${index} must be between 1 and 63 characters, got "${key}" with length ${key.length}`);
      }
    });

    if (errors.length > 0) {
      throw new UnscopedValidationError(`Invalid non-filterable metadata keys:\n${errors.join('\n')}`);
    }
  }

  /**
   * Parse encryption configuration
   *
   * @param props The index properties
   */
  private parseEncryption(props: IndexProps): {
    encryptionConfiguration?: CfnIndex.EncryptionConfigurationProperty;
    encryptionKey?: kms.IKey;
  } {
    const encryptionType = props.encryption;
    let key = props.encryptionKey;

    // If encryption is undefined
    if (encryptionType === undefined) {
      if (key === undefined) {
        // No encryption specified, use vector bucket's encryption
        return { encryptionConfiguration: undefined, encryptionKey: undefined };
      } else {
        // Key provided without encryption type, use KMS
        this.allowIndexingAccessToKey(key);
        return {
          encryptionConfiguration: {
            sseType: IndexEncryption.KMS,
            kmsKeyArn: key.keyArn,
          },
          encryptionKey: key,
        };
      }
    }

    // KMS encryption
    if (encryptionType === IndexEncryption.KMS) {
      if (key === undefined) {
        // Create a new key
        key = new kms.Key(this, 'Key', {
          description: `Created by ${this.node.path}`,
          enableKeyRotation: true,
        });
      }
      this.allowIndexingAccessToKey(key);
      return {
        encryptionConfiguration: {
          sseType: IndexEncryption.KMS,
          kmsKeyArn: key.keyArn,
        },
        encryptionKey: key,
      };
    }

    // S3 managed encryption
    if (encryptionType === IndexEncryption.S3_MANAGED) {
      if (key !== undefined) {
        throw new UnscopedValidationError(
          'Expected encryption = IndexEncryption.KMS with user provided encryption key. ' +
          'Use IndexEncryption.KMS or remove the encryptionKey property.',
        );
      }
      return {
        encryptionConfiguration: {
          sseType: IndexEncryption.S3_MANAGED,
        },
      };
    }

    throw new UnscopedValidationError(`Unknown encryption configuration detected: ${props.encryption} with key ${props.encryptionKey}`);
  }

  /**
   * Allow S3 Vectors indexing service to access the encryption key
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-vectors-data-encryption.html
   * @param encryptionKey The key to provide access to
   */
  private allowIndexingAccessToKey(encryptionKey: kms.IKey): void {
    const stack = Stack.of(this);

    encryptionKey.addToResourcePolicy(new iam.PolicyStatement({
      sid: 'AllowS3VectorsIndexingAccess',
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.ServicePrincipal('indexing.s3vectors.amazonaws.com'),
      ],
      actions: [
        'kms:Decrypt',
      ],
      resources: ['*'],
      conditions: {
        ArnLike: {
          'aws:SourceArn': stack.formatArn({
            service: 's3vectors',
            resource: 'bucket',
            resourceName: '*',
          }),
        },
        StringEquals: {
          'aws:SourceAccount': stack.account,
        },
        'ForAnyValue:StringEquals': {
          'kms:EncryptionContextKeys': ['aws:s3vectors:arn', 'aws:s3vectors:resource-id'],
        },
      },
    }));
  }
}
