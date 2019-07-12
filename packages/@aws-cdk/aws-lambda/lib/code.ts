import s3 = require('@aws-cdk/aws-s3');
import s3_assets = require('@aws-cdk/aws-s3-assets');
import cdk = require('@aws-cdk/core');
import { CfnFunction } from './lambda.generated';

export abstract class Code {
  /**
   * @returns `LambdaS3Code` associated with the specified S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   */
  public static bucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3Code {
    return new S3Code(bucket, key, objectVersion);
  }

  /**
   * @returns `LambdaInlineCode` with inline code.
   * @param code The actual handler code (limited to 4KiB)
   */
  public static inline(code: string): InlineCode {
    return new InlineCode(code);
  }

  /**
   * Loads the function code from a local disk asset.
   * @param path Either a directory with the Lambda code bundle or a .zip file
   */
  public static asset(path: string): AssetCode {
    return new AssetCode(path);
  }

  /**
   * Creates a new Lambda source defined using CloudFormation parameters.
   *
   * @returns a new instance of `CfnParametersCode`
   * @param props optional construction properties of {@link CfnParametersCode}
   */
  public static cfnParameters(props?: CfnParametersCodeProps): CfnParametersCode {
    return new CfnParametersCode(props);
  }

  /**
   * Determines whether this Code is inline code or not.
   */
  public abstract readonly isInline: boolean;

  /**
   * Called during stack synthesis to render the CodePropery for the
   * Lambda function.
   *
   * @param resource the resource to which the code will be attached (a CfnFunction, or a CfnLayerVersion).
   *
   * @internal
   */
  public abstract _toJSON(resource?: cdk.CfnResource): CfnFunction.CodeProperty;

  /**
   * Called when the lambda or layer is initialized to allow this object to
   * bind to the stack, add resources and have fun.
   */
  public bind(_construct: cdk.Construct) {
    return;
  }
}

/**
 * Lambda code from an S3 archive.
 */
export class S3Code extends Code {
  public readonly isInline = false;
  private bucketName: string;

  constructor(bucket: s3.IBucket, private key: string, private objectVersion?: string) {
    super();

    if (!bucket.bucketName) {
      throw new Error('bucketName is undefined for the provided bucket');
    }

    this.bucketName = bucket.bucketName;
  }

  /**
   * @internal
   */
  public _toJSON(_?: cdk.CfnResource): CfnFunction.CodeProperty {
    return {
      s3Bucket: this.bucketName,
      s3Key: this.key,
      s3ObjectVersion: this.objectVersion
    };
  }
}

/**
 * Lambda code from an inline string (limited to 4KiB).
 */
export class InlineCode extends Code {
  public readonly isInline = true;

  constructor(private code: string) {
    super();

    if (code.length > 4096) {
      throw new Error("Lambda source is too large, must be <= 4096 but is " + code.length);
    }
  }

  public bind(construct: cdk.Construct) {
    const runtime = (construct as any).runtime;
    if (!runtime.supportsInlineCode) {
      throw new Error(`Inline source not allowed for ${runtime && runtime.name}`);
    }
  }

  /**
   * @internal
   */
  public _toJSON(_?: cdk.CfnResource): CfnFunction.CodeProperty {
    return {
      zipFile: this.code
    };
  }
}

/**
 * Lambda code from a local directory.
 */
export class AssetCode extends Code {
  public readonly isInline = false;
  private asset?: s3_assets.Asset;

  /**
   * @param path The path to the asset file or directory.
   */
  constructor(public readonly path: string) {
    super();
  }

  public bind(construct: cdk.Construct) {
    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new s3_assets.Asset(construct, 'Code', { path: this.path });
    }

    if (!this.asset.isZipArchive) {
      throw new Error(`Asset must be a .zip file or a directory (${this.path})`);
    }
  }

  /**
   * @internal
   */
  public _toJSON(resource?: cdk.CfnResource): CfnFunction.CodeProperty {
    if (resource) {
      // https://github.com/aws/aws-cdk/issues/1432
      this.asset!.addResourceMetadata(resource, 'Code');
    }

    return {
      s3Bucket: this.asset!.s3BucketName,
      s3Key: this.asset!.s3ObjectKey
    };
  }
}

/**
 * Construction properties for {@link CfnParametersCode}.
 */
export interface CfnParametersCodeProps {
  /**
   * The CloudFormation parameter that represents the name of the S3 Bucket
   * where the Lambda code will be located in.
   * Must be of type 'String'.
   *
   * @default a new parameter will be created
   */
  readonly bucketNameParam?: cdk.CfnParameter;

  /**
   * The CloudFormation parameter that represents the path inside the S3 Bucket
   * where the Lambda code will be located at.
   * Must be of type 'String'.
   *
   * @default a new parameter will be created
   */
  readonly objectKeyParam?: cdk.CfnParameter;
}

/**
 * Lambda code defined using 2 CloudFormation parameters.
 * Useful when you don't have access to the code of your Lambda from your CDK code, so you can't use Assets,
 * and you want to deploy the Lambda in a CodePipeline, using CloudFormation Actions -
 * you can fill the parameters using the {@link #assign} method.
 */
export class CfnParametersCode extends Code {
  public readonly isInline = false;
  private _bucketNameParam?: cdk.CfnParameter;
  private _objectKeyParam?: cdk.CfnParameter;

  constructor(props: CfnParametersCodeProps = {}) {
    super();

    this._bucketNameParam = props.bucketNameParam;
    this._objectKeyParam = props.objectKeyParam;
  }

  public bind(construct: cdk.Construct) {
    if (!this._bucketNameParam) {
      this._bucketNameParam = new cdk.CfnParameter(construct, 'LambdaSourceBucketNameParameter', {
        type: 'String',
      });
    }

    if (!this._objectKeyParam) {
      this._objectKeyParam = new cdk.CfnParameter(construct, 'LambdaSourceObjectKeyParameter', {
        type: 'String',
      });
    }
  }

  /**
   * Create a parameters map from this instance's CloudFormation parameters.
   *
   * It returns a map with 2 keys that correspond to the names of the parameters defined in this Lambda code,
   * and as values it contains the appropriate expressions pointing at the provided S3 location
   * (most likely, obtained from a CodePipeline Artifact by calling the `artifact.s3Location` method).
   * The result should be provided to the CloudFormation Action
   * that is deploying the Stack that the Lambda with this code is part of,
   * in the `parameterOverrides` property.
   *
   * @param location the location of the object in S3 that represents the Lambda code
   */
  public assign(location: s3.Location): { [name: string]: any } {
    const ret: { [name: string]: any } = {};
    ret[this.bucketNameParam] = location.bucketName;
    ret[this.objectKeyParam] = location.objectKey;
    return ret;
  }

  /** @internal */
  public _toJSON(_?: cdk.CfnResource): CfnFunction.CodeProperty {
    return {
      s3Bucket: this._bucketNameParam!.valueAsString,
      s3Key: this._objectKeyParam!.valueAsString,
    };
  }

  public get bucketNameParam(): string {
    if (this._bucketNameParam) {
      return this._bucketNameParam.logicalId;
    } else {
      throw new Error('Pass CfnParametersCode to a Lambda Function before accessing the bucketNameParam property');
    }
  }

  public get objectKeyParam(): string {
    if (this._objectKeyParam) {
      return this._objectKeyParam.logicalId;
    } else {
      throw new Error('Pass CfnParametersCode to a Lambda Function before accessing the objectKeyParam property');
    }
  }
}
