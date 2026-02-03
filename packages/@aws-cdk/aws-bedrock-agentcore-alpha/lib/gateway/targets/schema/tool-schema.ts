import { Aws } from 'aws-cdk-lib';
import type { IRole } from 'aws-cdk-lib/aws-iam';
import { Grant } from 'aws-cdk-lib/aws-iam';
import type { IBucket, Location } from 'aws-cdk-lib/aws-s3';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import { md5hash } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { Construct } from 'constructs';
import { TargetSchema } from './base-schema';

/******************************************************************************
 *                                Tool Schema Configuration
 *****************************************************************************/

/**
 * Abstract interface for tool schema configuration
 * @internal
 */
export interface IToolSchemaConfiguration {
  /**
   * The tool schema configuration type
   */
  readonly toolSchemaType: string;

  /**
   * The tool schema configuration object
   */
  readonly configuration: any;
}

/**
 * Schema definition types
 */
export enum SchemaDefinitionType {
  /** String type */
  STRING = 'string',
  /** Number type */
  NUMBER = 'number',
  /** Object type */
  OBJECT = 'object',
  /** Array type */
  ARRAY = 'array',
  /** Boolean type */
  BOOLEAN = 'boolean',
  /** Integer type */
  INTEGER = 'integer',
}

/**
 * Schema definition for tool input/output
 */
export interface SchemaDefinition {
  /**
   * The type of the schema definition. This field specifies the data type of the schema.
   */
  readonly type: SchemaDefinitionType;

  /**
   * The description of the schema definition. This description provides information about the purpose and usage of the schema.
   */
  /**
   * The description of the schema definition. This description provides information about the purpose and usage of the schema.
   * @default - No description
   */
  readonly description?: string;

  /**
   * The items in the schema definition. This field is used for array types to define the structure of the array elements.
   */
  /**
   * The items in the schema definition. This field is used for array types to define the structure of the array elements.
   * @default - No items definition
   */
  readonly items?: SchemaDefinition;

  /**
   * The properties of the schema definition. These properties define the fields in the schema.
   */
  /**
   * The properties of the schema definition. These properties define the fields in the schema.
   * @default - No properties
   */
  readonly properties?: Record<string, SchemaDefinition>;

  /**
   * The required fields in the schema definition. These fields must be provided when using the schema.
   * @default - No required fields
   */
  readonly required?: string[];
}

/**
 * Tool definition for inline payload
 */
export interface ToolDefinition {
  /**
   * The name of the tool. This name identifies the tool in the Model Context Protocol.
   */
  readonly name: string;

  /**
   * The description of the tool. This description provides information about the purpose and usage of the tool.
   */
  readonly description: string;

  /**
   * The input schema for the tool. This schema defines the structure of the input that the tool accepts.
   */
  readonly inputSchema: SchemaDefinition;

  /**
   * The output schema for the tool. This schema defines the structure of the output that the tool produces.
   */
  /**
   * The output schema for the tool. This schema defines the structure of the output that the tool produces.
   * @default - No output schema
   */
  readonly outputSchema?: SchemaDefinition;
}

/**
 * Error thrown when a ToolSchema is not properly initialized.
 */
class ToolSchemaError extends Error {
  constructor(message: string, public readonly cause?: string) {
    super(message);
    this.name = 'ToolSchemaError';
  }
}

/******************************************************************************
 *                       TOOL SCHEMA CLASS
 *****************************************************************************/
export abstract class ToolSchema extends TargetSchema {
  /**
   * Creates a tool Schema from a local file.
   * @param path - the path to the local file containing the function schema for the tool
   */
  public static fromLocalAsset(path: string): ToolSchema {
    return new AssetToolSchema(path);
  }

  /**
   * Creates a Tool Schema from an inline string.
   * @param schema - the JSON or YAML payload defining the OpenAPI schema for the action group
   */
  public static fromInline(schema: ToolDefinition[]): InlineToolSchema {
    return new InlineToolSchema(schema);
  }

  /**
   * Creates a Tool Schema from an S3 File
   * @param bucket - the bucket containing the local file containing the OpenAPI schema for the action group
   * @param objectKey - object key in the bucket
   * @param bucketOwnerAccountId - optional The account ID of the Amazon S3 bucket owner. This ID is used for cross-account access to the bucket.
   */
  public static fromS3File(bucket: IBucket, objectKey: string, bucketOwnerAccountId?: string): S3ToolSchema {
    return new S3ToolSchema(
      {
        bucketName: bucket.bucketName,
        objectKey: objectKey,
      },
      bucketOwnerAccountId,
    );
  }

  /**
   * The S3 location of the tool schema file, if using an S3-based schema.
   * Contains the bucket name and object key information.
   */
  public readonly s3File?: Location;

  /**
   * The inline tool schema definition as a string, if using an inline schema.
   * Can be in JSON or YAML format.
   */
  public readonly inlineSchema?: ToolDefinition[];

  /**
   * The account ID of the S3 bucket owner for cross-account access
   */
  public readonly bucketOwnerAccountId?: string;

  protected constructor(s3File?: Location, bucketOwnerAccountId?: string, inlineSchema?: ToolDefinition[]) {
    super();
    this.s3File = s3File;
    this.inlineSchema = inlineSchema;
    this.bucketOwnerAccountId = bucketOwnerAccountId;
  }

  /**
   * Format as CFN properties
   * @internal This is an internal core function and should not be called directly.
   */
  public abstract _render(): any;
}

/**
 * Tool Schema from a local asset.
 *
 * The asset is uploaded to an S3 staging bucket, then moved to its final location
 * by CloudFormation during deployment.
 */
export class AssetToolSchema extends ToolSchema {
  private asset?: s3_assets.Asset;

  constructor(private readonly path: string, private readonly options: s3_assets.AssetOptions = {}) {
    super();
  }

  /**
   * Binds this tool schema to a construct scope.
   * This method initializes the S3 asset if it hasn't been initialized yet.
   * Must be called before rendering the schema as CFN properties.
   *
   * @param scope - The construct scope to bind to
   */
  public bind(scope: Construct): void {
    // If the same AssetToolSchema is used multiple times, retain only the first instantiation
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, `Schema${md5hash(this.path)}`, {
        path: this.path,
        ...this.options,
      });
      // Note: Permissions will be granted by the Gateway target construct when adding the target
    }
  }

  /**
   * Format as CFN properties
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): any {
    if (!this.asset) {
      throw new ToolSchemaError(
        'ToolSchema must be bound to a scope before rendering. Call bind() first.',
        'Asset not initialized',
      );
    }

    return {
      s3: {
        uri: `s3://${this.asset.s3BucketName}/${this.asset.s3ObjectKey}`,
      },
    };
  }

  public grantPermissionsToRole(role: IRole): void {
    if (!this.asset) {
      throw new ToolSchemaError(
        'ToolSchema must be bound to a scope before rendering. Call bind() first.',
        'Asset not initialized',
      );
    }
    this.asset.grantRead(role);
  }
}

// ------------------------------------------------------
/**
 * Class to define a Tool Schema from an inline string.
 * The schema can be provided directly as a string in either JSON or YAML format.
 */
export class InlineToolSchema extends ToolSchema {
  constructor(private readonly schema: ToolDefinition[]) {
    super(undefined, undefined, schema);
  }

  /**
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): any {
    return {
      inlinePayload: this.schema,
    };
  }

  public bind(scope: Construct): void {
    if (scope) {
    }
    // No-op
  }

  public grantPermissionsToRole(_role: IRole): void {
    // No-op - InlineToolSchema doesn't need permissions
  }
}

// ------------------------------------------------------
// S3 File
// ------------------------------------------------------
/**
 * Class to define a Tool Schema from an S3 object.
 */
export class S3ToolSchema extends ToolSchema {
  constructor(private readonly location: Location, public readonly bucketOwnerAccountId?: string) {
    super(location, bucketOwnerAccountId, undefined);
  }
  /**
   * @internal This is an internal core function and should not be called directly.
   */
  public _render(): any {
    return {
      s3: {
        uri: `s3://${this.location.bucketName}/${this.location.objectKey}`,
        ...(this.bucketOwnerAccountId && { bucketOwnerAccountId: this.bucketOwnerAccountId }),
      },
    };
  }

  public bind(scope: Construct): void {
    if (scope) {
    }
    // No-op
  }

  public grantPermissionsToRole(role: IRole): void {
    Grant.addToPrincipal({
      grantee: role,
      actions: ['s3:GetObject'],
      resourceArns: [`arn:${Aws.PARTITION}:s3:::${this.location.bucketName}/${this.location.objectKey}`],
    });
  }
}
