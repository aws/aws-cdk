import * as s3 from '@aws-cdk/aws-s3';
import * as s3_assets from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import * as fs from 'fs';
import * as nodePath from 'path';
import { BundlingDockerImage, DockerVolume } from './bundling';
import { Function } from './function';

export abstract class Code {
  /**
   * @returns `LambdaS3Code` associated with the specified S3 object.
   * @param bucket The S3 bucket
   * @param key The object key
   * @param objectVersion Optional S3 object version
   */
  public static fromBucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3Code {
    return new S3Code(bucket, key, objectVersion);
  }

  /**
   * @deprecated use `fromBucket`
   */
  public static bucket(bucket: s3.IBucket, key: string, objectVersion?: string): S3Code {
    return this.fromBucket(bucket, key, objectVersion);
  }

  /**
   * @returns `LambdaInlineCode` with inline code.
   * @param code The actual handler code (limited to 4KiB)
   */
  public static fromInline(code: string): InlineCode {
    return new InlineCode(code);
  }

  /**
   * @deprecated use `fromInline`
   */
  public static inline(code: string): InlineCode {
    return this.fromInline(code);
  }

  /**
   * Loads the function code from a local disk path.
   *
   * @param path Either a directory with the Lambda code bundle or a .zip file
   */
  public static fromAsset(path: string, options?: AssetCodeOptions): AssetCode {
    return new AssetCode(path, options);
  }

  /**
   * @deprecated use `fromAsset`
   */
  public static asset(path: string): AssetCode {
    return this.fromAsset(path);
  }

  /**
   * Creates a new Lambda source defined using CloudFormation parameters.
   *
   * @returns a new instance of `CfnParametersCode`
   * @param props optional construction properties of {@link CfnParametersCode}
   */
  public static fromCfnParameters(props?: CfnParametersCodeProps): CfnParametersCode {
    return new CfnParametersCode(props);
  }

  /**
   * @deprecated use `fromCfnParameters`
   */
  public static cfnParameters(props?: CfnParametersCodeProps): CfnParametersCode {
    return this.fromCfnParameters(props);
  }

  /**
   * Determines whether this Code is inline code or not.
   *
   * @deprecated this value is ignored since inline is now determined based on the
   * the `inlineCode` field of `CodeConfig` returned from `bind()`.
   */
  public abstract readonly isInline: boolean;

  /**
   * Called when the lambda or layer is initialized to allow this object to bind
   * to the stack, add resources and have fun.
   *
   * @param scope The binding scope. Don't be smart about trying to down-cast or
   * assume it's initialized. You may just use it as a construct scope.
   */
  public abstract bind(scope: cdk.Construct): CodeConfig;

  /**
   * Called after the CFN function resource has been created to allow the code
   * class to bind to it. Specifically it's required to allow assets to add
   * metadata for tooling like SAM CLI to be able to find their origins.
   */
  public bindToResource(_resource: cdk.CfnResource, _options?: ResourceBindOptions) {
    return;
  }
}

export interface CodeConfig {
  /**
   * The location of the code in S3 (mutually exclusive with `inlineCode`).
   */
  readonly s3Location?: s3.Location;

  /**
   * Inline code (mutually exclusive with `s3Location`).
   */
  readonly inlineCode?: string;
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

  public bind(_scope: cdk.Construct): CodeConfig {
    return {
      s3Location: {
        bucketName: this.bucketName,
        objectKey: this.key,
        objectVersion: this.objectVersion,
      },
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

    if (code.length === 0) {
      throw new Error('Lambda inline code cannot be empty');
    }

    if (code.length > 4096) {
      throw new Error('Lambda source is too large, must be <= 4096 but is ' + code.length);
    }
  }

  public bind(_scope: cdk.Construct): CodeConfig {
    return {
      inlineCode: this.code,
    };
  }
}

/**
 * Bundling options
 */
export interface BundlingOptions {
  /**
   * The Docker image where the command will run.
   *
   * @default - The lambci/lambda build image for the function's runtime
   * https://hub.docker.com/r/lambci/lambda/
   */
  readonly image?: BundlingDockerImage;

  /**
   * The command to run in the container.
   *
   * @example ['npm', 'install']
   */
  readonly command: string[];

  /**
   * Additional Docker volumes to mount.
   *
   * @default - no additional volumes are mounted
   */
  readonly volumes?: DockerVolume[];

  /**
   * The environment variables to pass to the container.
   *
   * @default - no environment variables.
   */
  readonly environment?: { [key: string]: string; };

  /**
   * Working directory inside the container.
   *
   * @default /src
   */
  readonly workingDirectory?: string;

  /**
   * Bundle directory. Subdirectories named after the asset path will be
   * created in this directory and mounted at `/bundle` in the container.
   * Should be added to your `.gitignore`.
   *
   * @default .bundle next to the asset directory
   */
  readonly bundleDirectory?: string;
}

/**
 * Asset code options
 */
export interface AssetCodeOptions extends s3_assets.AssetOptions {
  /**
   * Bundle the Lambda code by executing a command in a Docker container.
   * The asset path will be mounted at `/src`. The Docker container is
   * responsible for putting content at `/bundle`. The content at `/bundle`
   * will be zipped and used as Lambda code.
   *
   * @default - asset path is zipped as is
   */
  readonly bundling?: BundlingOptions;
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
  constructor(public readonly path: string, private readonly options: AssetCodeOptions = {}) {
    super();
  }

  public bind(scope: cdk.Construct): CodeConfig {
    let bundleAssetPath: string | undefined;

    if (this.options.bundling) {
      // Create the directory for the bundle next to the asset path
      const bundlePath = nodePath.join(nodePath.dirname(this.path), this.options.bundling.bundleDirectory ?? '.bundle');
      if (!fs.existsSync(bundlePath)) {
        fs.mkdirSync(bundlePath);
      }

      bundleAssetPath = nodePath.join(bundlePath, nodePath.basename(this.path));
      if (!fs.existsSync(bundleAssetPath)) {
        fs.mkdirSync(bundleAssetPath);
      }

      const volumes = [
        {
          hostPath: this.path,
          containerPath: '/src',
        },
        {
          hostPath: bundleAssetPath,
          containerPath: '/bundle',
        },
        ...this.options.bundling.volumes ?? [],
      ];

      let image: BundlingDockerImage;
      if (this.options.bundling.image) {
        image = this.options.bundling.image;
      } else {
        if (scope instanceof Function) {
          image = BundlingDockerImage.fromRegistry(`lambci/lambda:build-${scope.runtime.name}`);
        } else {
          throw new Error('Cannot derive default bundling image from scope. Please specify an image.');
        }
      }

      image.run({
        command: this.options.bundling.command,
        volumes,
        environment: this.options.bundling.environment,
        workingDirectory: this.options.bundling.workingDirectory ?? '/src',
      });
    }

    // If the same AssetCode is used multiple times, retain only the first instantiation.
    if (!this.asset) {
      this.asset = new s3_assets.Asset(scope, 'Code', {
        path: bundleAssetPath ?? this.path,
        ...this.options,
      });
    }

    if (!this.asset.isZipArchive) {
      throw new Error(`Asset must be a .zip file or a directory (${this.path})`);
    }

    return {
      s3Location: {
        bucketName: this.asset.s3BucketName,
        objectKey: this.asset.s3ObjectKey,
      },
    };
  }

  public bindToResource(resource: cdk.CfnResource, options: ResourceBindOptions = { }) {
    if (!this.asset) {
      throw new Error('bindToResource() must be called after bind()');
    }

    const resourceProperty = options.resourceProperty || 'Code';

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

  public bind(scope: cdk.Construct): CodeConfig {
    if (!this._bucketNameParam) {
      this._bucketNameParam = new cdk.CfnParameter(scope, 'LambdaSourceBucketNameParameter', {
        type: 'String',
      });
    }

    if (!this._objectKeyParam) {
      this._objectKeyParam = new cdk.CfnParameter(scope, 'LambdaSourceObjectKeyParameter', {
        type: 'String',
      });
    }

    return {
      s3Location: {
        bucketName: this._bucketNameParam.valueAsString,
        objectKey: this._objectKeyParam.valueAsString,
      },
    };
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
