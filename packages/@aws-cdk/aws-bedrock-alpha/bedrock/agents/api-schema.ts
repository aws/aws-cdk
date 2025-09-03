import { Construct } from 'constructs';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import { CfnAgent } from 'aws-cdk-lib/aws-bedrock';
import { IBucketRef, Location } from 'aws-cdk-lib/aws-s3';
import { ActionGroupSchema } from './schema-base';

/**
 * Error thrown when an ApiSchema is not properly initialized.
 */
class ApiSchemaError extends Error {
  constructor(message: string, public readonly cause?: string) {
    super(message);
    this.name = 'ApiSchemaError';
  }
}

/******************************************************************************
 *                       API SCHEMA CLASS
 *****************************************************************************/
/**
 * Represents the concept of an API Schema for a Bedrock Agent Action Group.
 */
export abstract class ApiSchema extends ActionGroupSchema {
  /**
   * Creates an API Schema from a local file.
   * @param path - the path to the local file containing the OpenAPI schema for the action group
   */
  public static fromLocalAsset(path: string): AssetApiSchema {
    return new AssetApiSchema(path);
  }

  /**
   * Creates an API Schema from an inline string.
   * @param schema - the JSON or YAML payload defining the OpenAPI schema for the action group
   */
  public static fromInline(schema: string): InlineApiSchema {
    return new InlineApiSchema(schema);
  }

  /**
   * Creates an API Schema from an S3 File
   * @param bucket - the bucket containing the local file containing the OpenAPI schema for the action group
   * @param objectKey - object key in the bucket
   */
  public static fromS3File(bucket: IBucketRef, objectKey: string): S3ApiSchema {
    return new S3ApiSchema({
      bucketName: bucket.bucketRef.bucketName,
      objectKey: objectKey,
    });
  }

  /**
   * The S3 location of the API schema file, if using an S3-based schema.
   * Contains the bucket name and object key information.
   */
  public readonly s3File?: Location;

  /**
   * The inline OpenAPI schema definition as a string, if using an inline schema.
   * Can be in JSON or YAML format.
   */
  public readonly inlineSchema?: string;

  protected constructor(s3File?: Location, inlineSchema?: string) {
    super();
    this.s3File = s3File;
    this.inlineSchema = inlineSchema;
  }

  /**
   * Format as CFN properties
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public abstract _render(): CfnAgent.APISchemaProperty;
}

/**
 * API Schema from a local asset.
 *
 * The asset is uploaded to an S3 staging bucket, then moved to its final location
 * by CloudFormation during deployment.
 */
export class AssetApiSchema extends ApiSchema {
  private asset?: s3_assets.Asset;

  constructor(private readonly path: string, private readonly options: s3_assets.AssetOptions = {}) {
    super();
  }

  /**
   * Binds this API schema to a construct scope.
   * This method initializes the S3 asset if it hasn't been initialized yet.
   * Must be called before rendering the schema as CFN properties.
   *
   * @param scope - The construct scope to bind to
   */
  public bind(scope: Construct): void {
    // If the same AssetApiSchema is used multiple times, retain only the first instantiation
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, 'Schema', {
        path: this.path,
        ...this.options,
      });
      // Note: Permissions will be granted by the Agent construct when adding the action group
    }
  }

  /**
   * Format as CFN properties
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnAgent.APISchemaProperty {
    if (!this.asset) {
      throw new ApiSchemaError('ApiSchema must be bound to a scope before rendering. Call bind() first.', 'Asset not initialized');
    }

    return {
      s3: {
        s3BucketName: this.asset.s3BucketName,
        s3ObjectKey: this.asset.s3ObjectKey,
      },
    };
  }
}

// ------------------------------------------------------
/**
 * Class to define an API Schema from an inline string.
 * The schema can be provided directly as a string in either JSON or YAML format.
 */
export class InlineApiSchema extends ApiSchema {
  constructor(private readonly schema: string) {
    super(undefined, schema);
  }

  /**
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnAgent.APISchemaProperty {
    return {
      payload: this.schema,
    };
  }
}

// ------------------------------------------------------
// S3 File
// ------------------------------------------------------
/**
 * Class to define an API Schema from an S3 object.
 */
export class S3ApiSchema extends ApiSchema {
  constructor(private readonly location: Location) {
    super(location, undefined);
  }
  /**
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): CfnAgent.APISchemaProperty {
    return {
      s3: {
        s3BucketName: this.location.bucketName,
        s3ObjectKey: this.location.objectKey,
      },
    };
  }
}
