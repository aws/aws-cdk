import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { CfnRestApi } from './apigateway.generated';

/**
 * Represents an OpenAPI definition asset.
 */
export abstract class ApiDefinition {
  /**
   * Creates an API definition from a specification file in an S3 bucket
   */
  public static fromBucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3ApiDefinition {
    return new S3ApiDefinition(bucket, key, objectVersion);
  }

  /**
   * Creates an API definition from a string
   */
  public static fromInline(definition: string): InlineApiDefinition {
    return new InlineApiDefinition(definition);
  }

  /**
   * Loads the API specification from a local disk asset.
   */
  public static fromAsset(file: string, options?: s3_assets.AssetOptions): AssetApiDefinition {
    return new AssetApiDefinition(file, options);
  }

  /**
   * Called when the specification is initialized to allow this object to bind
   * to the stack, add resources and have fun.
   *
   * @param scope The binding scope. Don't be smart about trying to down-cast or
   * assume it's initialized. You may just use it as a construct scope.
   */
  public abstract bind(scope: cdk.Construct): ApiDefinitionConfig;
}

/**
 * Post-Binding Configuration for a CDK construct
 */
export interface ApiDefinitionConfig {
  /**
   * The location of the specification in S3 (mutually exclusive with `inlineDefinition`).
   *
   * @default a new parameter will be created
   */
  readonly s3Location?: CfnRestApi.S3LocationProperty;

  /**
   * Inline specification (mutually exclusive with `s3Location`).
   *
   * @default a new parameter will be created
   */
  readonly inlineDefinition?: string;
}

/**
 * Swagger/OpenAPI specification from an S3 archive
 */
export class S3ApiDefinition extends ApiDefinition {
  private bucketName: string;

  constructor(bucket: s3.IBucket, private key: string, private objectVersion?: string) {
    super();

    if (!bucket.bucketName) {
      throw new Error('bucketName is undefined for the provided bucket');
    }

    this.bucketName = bucket.bucketName;
  }

  public bind(_scope: cdk.Construct): ApiDefinitionConfig {
    return {
      s3Location: {
        bucket: this.bucketName,
        key: this.key,
        version: this.objectVersion,
      },
    };
  }
}

/**
 * OpenAPI specification from an inline string (limited to 4KiB)
 */
export class InlineApiDefinition extends ApiDefinition {
  constructor(private definition: string) {
    super();

    if (definition.length === 0) {
      throw new Error('Inline API definition cannot be empty');
    }
  }

  public bind(_scope: cdk.Construct): ApiDefinitionConfig {
    return {
      inlineDefinition: this.definition,
    };
  }
}

/**
 * OpenAPI specification from a local file.
 */
export class AssetApiDefinition extends ApiDefinition {
  private asset?: s3_assets.Asset;

  constructor(private readonly path: string, private readonly options: s3_assets.AssetOptions = { }) {
    super();
  }

  public bind(scope: cdk.Construct): ApiDefinitionConfig {
    // If the same AssetAPIDefinition is used multiple times, retain only the first instantiation.
    if (this.asset === undefined) {
      this.asset = new s3_assets.Asset(scope, 'APIDefinition', {
        path: this.path,
        ...this.options,
      });
    }

    if (this.asset?.isZipArchive) {
      throw new Error(`Asset cannot be a .zip file or a directory (${this.path})`);
    }

    return {
      s3Location: {
        bucket: this.asset?.s3BucketName,
        key: this.asset?.s3ObjectKey,
      },
    };
  }
}