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
import { TargetSchema } from './base-schema';
import { Grant, IRole } from 'aws-cdk-lib/aws-iam';
import { Aws } from 'aws-cdk-lib';

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
 * Represents the concept of an API Schema for a Gateway Target.
 */
export abstract class ApiSchema extends TargetSchema {
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
   * @param bucketOwnerAccountId - optional The account ID of the Amazon S3 bucket owner. This ID is used for cross-account access to the bucket.
   */
  public static fromS3File(bucket: IBucket, objectKey: string, bucketOwnerAccountId?: string): S3ApiSchema {
    return new S3ApiSchema(
      {
        bucketName: bucket.bucketName,
        objectKey: objectKey,
      },
      bucketOwnerAccountId,
    );
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

  public readonly bucketOwnerAccountId?: string;

  protected constructor(s3File?: Location, bucketOwnerAccountId?: string, inlineSchema?: string) {
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
  public abstract _render(): any;
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
  public _bind(scope: Construct): void {
    // If the same AssetApiSchema is used multiple times, retain only the first instantiation
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
  public _render(): any {
    if (!this.asset) {
      throw new ApiSchemaError(
        'ApiSchema must be bound to a scope before rendering. Call bind() first.',
        'Asset not initialized',
      );
    }

    return {
      s3: {
        uri: `s3://${this.asset.s3BucketName}/${this.asset.s3ObjectKey}`,
      },
    };
  }

  public grantPermissionsToRole(role: IRole): Grant | undefined {
    this.asset?.grantRead(role);
    // Asset does not implement Grant properly
    return undefined;
  }
}

// ------------------------------------------------------
/**
 * Class to define an API Schema from an inline string.
 * The schema can be provided directly as a string in either JSON or YAML format.
 */
export class InlineApiSchema extends ApiSchema {
  constructor(private readonly schema: string) {
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

  public grantPermissionsToRole(role: IRole): Grant | undefined {
    if (role) {
    }
    return undefined;
  }

  public _bind(scope: Construct): void {
    if (scope) {
    }
    // No-op
  }
}

// ------------------------------------------------------
// S3 File
// ------------------------------------------------------
/**
 * Class to define an API Schema from an S3 object.
 */
export class S3ApiSchema extends ApiSchema {
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

  public _bind(scope: Construct): void {
    if (scope) {
    }
    // No-op
  }

  public grantPermissionsToRole(role: IRole): Grant | undefined {
    return Grant.addToPrincipal({
      grantee: role,
      actions: ['s3:GetObject'],
      resourceArns: [`arn:${Aws.PARTITION}:s3:::${this.location.bucketName}/${this.location.objectKey}`],
    });
  }
}
