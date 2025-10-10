/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { IBucket, Location } from 'aws-cdk-lib/aws-s3';
import * as s3_assets from 'aws-cdk-lib/aws-s3-assets';
import { Construct } from 'constructs';
import { TargetSchema } from '../base-schema';
import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';
import { Aws } from 'aws-cdk-lib';

/******************************************************************************
 *                                Tool Schema Configuration
 *****************************************************************************/

/**
 * Abstract interface for tool schema configuration
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
  STRING = 'string',
  NUMBER = 'number',
  OBJECT = 'object',
  ARRAY = 'array',
  BOOLEAN = 'boolean',
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
  readonly description?: string;

  /**
   * The items in the schema definition. This field is used for array types to define the structure of the array elements.
   */
  readonly items?: SchemaDefinition;

  /**
   * The properties of the schema definition. These properties define the fields in the schema.
   */
  readonly properties?: Record<string, SchemaDefinition>;

  /**
   * The required fields in the schema definition. These fields must be provided when using the schema.
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
      bucketOwnerAccountId
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

  public readonly bucketOwnerAccountId?: string;

  protected constructor(s3File?: Location, bucketOwnerAccountId?: string, inlineSchema?: ToolDefinition[]) {
    super();
    this.s3File = s3File;
    this.inlineSchema = inlineSchema;
    this.bucketOwnerAccountId = bucketOwnerAccountId;
  }

  /**
   * Format as CFN properties
   * TODO: this doesn't exist yet in cloudformation, but we will render the Cfn object
   *
   * @internal This is an internal core function and should not be called directly.
   */
  public abstract _render(): CfnGatewayTarget.ToolSchemaProperty;
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
   * @internal
   */
  public _bind(scope: Construct): void {
    // If the same AssetToolSchema is used multiple times, retain only the first instantiation
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, 'Schema', {
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
  public _render(): CfnGatewayTarget.ToolSchemaProperty {
    if (!this.asset) {
      throw new ToolSchemaError(
        'ToolSchema must be bound to a scope before rendering. Call bind() first.',
        'Asset not initialized'
      );
    }

    return {
      s3: {
        uri: `s3://${this.asset.s3BucketName}/${this.asset.s3ObjectKey}`,
      },
    };
  }

  /**
   * @internal
   */
  public _grantPermissionsToRole(role: IRole): Grant | undefined {
    this.asset?.grantRead(role);
    // Asset does not implement grant properly
    return undefined;
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
  public _render(): CfnGatewayTarget.ToolSchemaProperty {
    // Convert ToolDefinition[] to the expected CFN format
    const convertSchemaDefinition = (schema: SchemaDefinition): CfnGatewayTarget.SchemaDefinitionProperty => {
      return {
        type: schema.type,
        description: schema.description,
        items: schema.items ? convertSchemaDefinition(schema.items) : undefined,
        properties: schema.properties
          ? Object.fromEntries(
              Object.entries(schema.properties).map(([key, value]) => [key, convertSchemaDefinition(value)])
            )
          : undefined,
        required: schema.required,
      };
    };

    const convertedPayload: CfnGatewayTarget.ToolDefinitionProperty[] = this.schema.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: convertSchemaDefinition(tool.inputSchema),
      outputSchema: tool.outputSchema ? convertSchemaDefinition(tool.outputSchema) : undefined,
    }));

    return {
      inlinePayload: convertedPayload,
    };
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): void {
    if (scope) {
    }
    // No-op
  }

  /**
   * @internal
   */
  public _grantPermissionsToRole(role: any): Grant | undefined {
    if (role) {
    }
    return undefined;
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
  public _render(): CfnGatewayTarget.ToolSchemaProperty {
    return {
      s3: {
        uri: `s3://${this.location.bucketName}/${this.location.objectKey}`,
        ...(this.bucketOwnerAccountId && { bucketOwnerAccountId: this.bucketOwnerAccountId }),
      },
    };
  }

  /**
   * @internal
   */
  public _bind(scope: Construct): void {
    if (scope) {
    }
    // No-op
  }

  /**
   * @internal
   */
  public _grantPermissionsToRole(role: IRole): Grant | undefined {
    return Grant.addToPrincipal({
      grantee: role,
      actions: ['s3:GetObject'],
      resourceArns: [`arn:${Aws.PARTITION}:s3:::${this.location.bucketName}/${this.location.objectKey}`],
    });
  }
}
