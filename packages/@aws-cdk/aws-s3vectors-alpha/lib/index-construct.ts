import { Fn, IResource, Resource, ResourceProps, Token } from 'aws-cdk-lib';
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

    const resource = new CfnIndex(this, 'Resource', {
      vectorBucketArn: props.vectorBucket.vectorBucketArn,
      indexName: props.indexName,
      dimension: this.dimension,
      distanceMetric: this.distanceMetric,
      dataType: this.dataType,
      metadataConfiguration,
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
}
