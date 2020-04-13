import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { CfnRestApi } from './apigateway.generated';

export abstract class APIDefinition {
  /**
   * @returns `APIDefinitionS3` associated with the specified S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   */
  public static fromBucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3APIDefinition {
    return new S3APIDefinition(bucket, key, objectVersion);
  }

  /**
   * @returns `InlineAPIDefinition` with inline specification.
   * @param code The actual API specification (limited to 4KiB)
   */
  public static fromInline(code: string): InlineAPIDefinition {
    return new InlineAPIDefinition(code);
  }

  /**
   * Loads the API specification from a local disk asset.
   * @param file The path to the JSON or YAML specification file
   */
  public static fromAsset(file: string, options?: s3_assets.AssetOptions): AssetAPIDefinition {
    return new AssetAPIDefinition(file, options);
  }

  /**
   * Creates an OpenAPI/Swagger specification source using CloudFormation parameters.
   *
   * @returns a new instance of `CfnParametersAPIDefinition`
   * @param props optional construction properties of {@link CfnParametersAPIDefinition}
   */
  public static fromCfnParameters(props?: CfnParametersAPIDefinitionProps): CfnParametersAPIDefinition {
    return new CfnParametersAPIDefinition(props);
  }

  /**
   * Determines whether this API definition is inline or not.
   */
  public abstract readonly isInline: boolean;

  /**
   * Called when the specification is initialized to allow this object to bind
   * to the stack, add resources and have fun.
   *
   * @param scope The binding scope. Don't be smart about trying to down-cast or
   * assume it's initialized. You may just use it as a construct scope.
   */
  public abstract bind(scope: cdk.Construct): APIDefinitionConfig;

  /**
   * Called after the CFN function resource has been created to allow the API definition
   * class to bind to it. Specifically it's required to allow assets to add
   * metadata for tooling like SAM CLI to be able to find their origins.
   */
  public bindToResource(_resource: cdk.CfnResource, _options?: ResourceBindOptions) {
    return;
  }
}

export interface APIDefinitionConfig {
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
export class S3APIDefinition extends APIDefinition {
  public readonly isInline = false;
  private bucketName: string;

  constructor(bucket: s3.IBucket, private key: string, private objectVersion?: string) {
    super();

    if (!bucket.bucketName) {
      throw new Error('bucketName is undefined for the provided bucket');
    }

    this.bucketName = bucket.bucketName;
  }

  public bind(_scope: cdk.Construct): APIDefinitionConfig {
    return {
      s3Location: {
        bucket: this.bucketName,
        key: this.key,
        version: this.objectVersion
      }
    };
  }
}

/**
 * Swagger/OpenAPI specification from an inline string (limited to 4KiB)
 */
export class InlineAPIDefinition extends APIDefinition {
  public readonly isInline = true;

  constructor(private definition: string) {
    super();

    if (definition.length === 0) {
      throw new Error('Inline API definition cannot be empty');
    }

    if (definition.length > 4906) {
      throw new Error('API definition is too large, must be <= 4096 but is ' + definition.length);
    }
  }

  public bind(_scope: cdk.Construct): APIDefinitionConfig {
    return {
      inlineDefinition: this.definition
    };
  }
}

/**
 * Swagger/OpenAPI specification from a local file.
 */
export class AssetAPIDefinition extends APIDefinition {
  public readonly isInline = false;
  private asset?: s3_assets.Asset;

  /**
   * @param path The path to the asset file
   */
  constructor(public readonly path: string, private readonly options: s3_assets.AssetOptions = { }) {
    super();
  }

  public bind(scope: cdk.Construct): APIDefinitionConfig {
    // If the same AssetAPIDefinition is used multiple times, retain only the first instantiation.
    if (this.asset === undefined) {
      this.asset = new s3_assets.Asset(scope, 'APIDefinition', {
        path: this.path,
        ...this.options
      });
    }

    if (this.asset.isZipArchive) {
      throw new Error(`Asset cannot be a .zip file or a directory (${this.path})`);
    }

    return {
      s3Location: {
        bucket: this.asset.s3BucketName,
        key: this.asset.s3ObjectKey
      }
    };
  }

  public bindToResource(resource: cdk.CfnResource, options: ResourceBindOptions = { }) {
    if (!this.asset) {
      throw new Error('bindToResource() must be called after bind()');
    }

    const resourceProperty = options.resourceProperty || 'APIDefinition';

    // https://github.com/aws/aws-cdk/issues/1432
    this.asset.addResourceMetadata(resource, resourceProperty);
  }
}

export interface ResourceBindOptions {
  /**
   * The name of the CloudFormation property to annotate with asset metadata.
   * @see https://github.com/aws/aws-cdk/issues/1432
   * @default Code
   */
  readonly resourceProperty?: string;
}

/**
 * Construction properties for {@link CfnParametersAPIDefinition}.
 */
export interface CfnParametersAPIDefinitionProps {
  /**
   * The CloudFormation parameter that represents the name of the S3 Bucket
   * where the API specification file is located.
   * Must be of type 'String'.
   *
   * @default a new parameter will be created
   */
  readonly bucketNameParam?: cdk.CfnParameter;

  /**
   * The CloudFormation parameter that represents the path inside the S3 Bucket
   * where the API specification file is located.
   * Must be of type 'String'.
   *
   * @default a new parameter will be created
   */
  readonly objectKeyParam?: cdk.CfnParameter;
}

/**
 * Swagger/OpenAPI specification using 2 CloudFormation parameters.
 * Useful when you don't have access to the specification from your CDK code, so you can't use Assets,
 * and you want to deploy a REST API with a pre-built spec in a CodePipeline, using CloudFormation Actions -
 * you can fill the parameters using the {@link #assign} method.
 */
export class CfnParametersAPIDefinition extends APIDefinition {
  public readonly isInline = false;
  private _bucketNameParam?: cdk.CfnParameter;
  private _objectKeyParam?: cdk.CfnParameter;

  constructor(props: CfnParametersAPIDefinitionProps = {}) {
    super();

    this._bucketNameParam = props.bucketNameParam;
    this._objectKeyParam = props.objectKeyParam;
  }

  public bind(scope: cdk.Construct): APIDefinitionConfig {
    if (!this._bucketNameParam) {
      this._bucketNameParam = new cdk.CfnParameter(scope, 'APIDefinitionBucketNameParameter', {
        type: 'String',
      });
    }

    if (!this._objectKeyParam) {
      this._objectKeyParam = new cdk.CfnParameter(scope, 'APIDefinitionObjectKeyParameter', {
        type: 'String',
      });
    }

    return {
      s3Location: {
        bucket: this._bucketNameParam.valueAsString,
        key: this._objectKeyParam.valueAsString,
      }
    };
  }

  /**
   * Create a parameters map from this instance's CloudFormation parameters.
   *
   * It returns a map with 2 keys that correspond to the names of the parameters defined in this API definition,
   * and as values it contains the appropriate expressions pointing at the provided S3 location
   * (most likely, obtained from a CodePipeline Artifact by calling the `artifact.s3Location` method).
   * The result should be provided to the CloudFormation Action
   * that is deploying the Stack that the REST API with this definition is part of,
   * in the `parameterOverrides` property.
   *
   * @param location the location of the object in S3 that represents the API definition
   */
  public assign(location: s3.Location): { [name: string]: any } {
    const ret: { [name: string]: any } = {};
    ret[this.bucketNameParam] = location.bucketName;
    ret[this.objectKeyParam] = location.objectKey;
    return ret;
  }

  public get bucketNameParam(): string {
    if (this._bucketNameParam) {
      return this._bucketNameParam.logicalId;
    } else {
      throw new Error('Pass CfnParametersAPIDefinition to a REST API before accessing the bucketNameParam property');
    }
  }

  public get objectKeyParam(): string {
    if (this._objectKeyParam) {
      return this._objectKeyParam.logicalId;
    } else {
      throw new Error('Pass CfnParametersAPIDefinition to a REST API before accessing the objectKeyParam property');
    }
  }
}
