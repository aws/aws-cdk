import * as fs from 'fs';
import { CfnAgent } from 'aws-cdk-lib/aws-bedrock';
import { IBucket, Location } from 'aws-cdk-lib/aws-s3';

/******************************************************************************
 *                       API SCHEMA CLASS
 *****************************************************************************/
/**
 * Represents the concept of an API Schema for a Bedrock Agent Action Group.
 */
export abstract class ApiSchema {
  /**
   * Creates an API Schema from a local file.
   * @param path - the path to the local file containing the OpenAPI schema for the action group
   */
  public static fromLocalAsset(path: string): InlineApiSchema {
    return new InlineApiSchema(fs.readFileSync(path, 'utf8'));
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
  public static fromS3File(bucket: IBucket, objectKey: string): S3ApiSchema {
    return new S3ApiSchema({
      bucketName: bucket.bucketName,
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

  /**
   * Constructor accessible only to extending classes.
   */
  protected constructor(s3File?: Location, inlineSchema?: string) {
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

// ------------------------------------------------------
// Inline Definition
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
