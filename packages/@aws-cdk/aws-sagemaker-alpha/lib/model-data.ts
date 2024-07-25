import * as s3 from 'aws-cdk-lib/aws-s3';
import * as assets from 'aws-cdk-lib/aws-s3-assets';
import { Construct } from 'constructs';
import { IModel } from './model';
import { hashcode } from './private/util';

// The only supported extension for local asset model data
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sagemaker-model-containerdefinition.html#cfn-sagemaker-model-containerdefinition-modeldataurl
const COMPRESSED_ARTIFACT_EXTENSION = 'tar.gz';

/**
 * Specifies how the ML model data is prepared.
 */
export enum CompressionType {
  /**
   * If you choose `CompressionType.GZIP` and choose `S3DataType.S3_OBJECT` as the value of `s3DataType`,
   * S3 URI identifies an object that is a gzip-compressed TAR archive.
   * SageMaker will attempt to decompress and untar the object during model deployment.
   */
  GZIP = 'Gzip',
  /**
   * If you choose `CompressionType.NONE` and choose `S3DataType.S3_PREFIX` as the value of `s3DataType`,
   * S3 URI identifies a key name prefix, under which all objects represents the uncompressed ML model to deploy.
   *
   * If you choose `CompressionType.NONE`, then SageMaker will follow rules below when creating model data files
   * under `/opt/ml/model` directory for use by your inference code:
   * - If you choose `S3DataType.S3_OBJECT` as the value of `s3DataType`, then SageMaker will split the key of the S3 object referenced by S3 URI by slash (/),
   *    and use the last part as the filename of the file holding the content of the S3 object.
   * - If you choose `S3DataType.S3_PREFIX` as the value of `s3DataType`, then for each S3 object under the key name pefix referenced by S3 URI,
   *    SageMaker will trim its key by the prefix, and use the remainder as the path (relative to `/opt/ml/model`) of the file holding the content of the S3 object.
   *    SageMaker will split the remainder by slash (/), using intermediate parts as directory names and the last part as filename of the file holding the content of the S3 object.
   * - Do not use any of the following as file names or directory names:
   *   - An empty or blank string
   *   - A string which contains null bytes
   *   - A string longer than 255 bytes
   *   - A single dot (.)
   *   - A double dot (..)
   * - Ambiguous file names will result in model deployment failure.
   *    For example, if your uncompressed ML model consists of two S3 objects `s3://mybucket/model/weights` and `s3://mybucket/model/weights/part1`
   *    and you specify `s3://mybucket/model/` as the value of S3 URI and `S3DataType.S3_PREFIX` as the value of `s3DataType`,
   *    then it will result in name clash between `/opt/ml/model/weights` (a regular file) and `/opt/ml/model/weights/` (a directory).
   */
  NONE = 'None',
}

/**
 * Specifies the type of ML model data to deploy.
 */
export enum S3DataType {
  /**
   * If you choose `S3DataType.S3_OBJECT`, S3 UTI identifies an object that is the ML model data to deploy.
   */
  S3_OBJECT = 'S3Object',
  /**
   * If you choose `S3DataType.S3_PREFIX`, S3 URI identifies a key name prefix.
   * SageMaker uses all objects that match the specified key name prefix as part of the ML model data to deploy.
   * A valid key name prefix identified by S3 URI always ends with a forward slash (/).
   */
  S3_PREFIX = 'S3Prefix',
}

/**
 * The configuration needed to reference model artifacts.
 */
export interface ModelDataConfig {
  /**
   * The S3 path where the model artifacts, which result from model training, are stored. This path
   * must point to a single gzip compressed tar archive (.tar.gz suffix).
   */
  readonly uri: string;
  /**
   * Specifies how the ML model data is prepared.
   * @default CompressionType.GZIP
   */
  readonly compressionType?: CompressionType;
  /**
   * Specifies the type of ML model data to deploy.
   * @default S3DataType.S3_OBJECT
   */
  readonly s3DataType?: S3DataType;
}

/**
 * Model data represents the source of model artifacts, which will ultimately be loaded from an S3
 * location.
 */
export abstract class ModelData {
  /**
   * Constructs model data which is already available within S3.
   * @param bucket The S3 bucket within which the model artifacts are stored
   * @param objectKey The S3 object key at which the model artifacts are stored
   * @param options The options for identifying model artifacts
   */
  public static fromBucket(bucket: s3.IBucket, objectKey: string, options?: S3ModelDataOptions): ModelData {
    return new S3ModelData(bucket, objectKey, options);
  }

  /**
   * Constructs model data that will be uploaded to S3 as part of the CDK app deployment.
   * @param path The local path to a model artifact file as a gzipped tar file
   * @param options The options to further configure the selected asset
   */
  public static fromAsset(path: string, options: assets.AssetOptions = {}): ModelData {
    return new AssetModelData(path, options);
  }

  /**
   * This method is invoked by the SageMaker Model construct when it needs to resolve the model
   * data to a URI.
   * @param scope The scope within which the model data is resolved
   * @param model The Model construct performing the URI resolution
   */
  public abstract bind(scope: Construct, model: IModel): ModelDataConfig;
}

/**
 * The options for identifying model artifacts.
 * When you choose `CompressionType.GZIP` and `S3DataType.S3_OBJECT` then use `ModelDataUrl` property.
 * Otherwise, use `ModelDataSource` property.
 *
 * Currently you cannot use ModelDataSource in conjunction with:
 * - SageMaker batch transform
 * - SageMaker serverless endpoints
 * - SageMaker multi-model endpoints
 * - SageMaker Marketplace
 */
export interface S3ModelDataOptions {
  /**
   * Specifies how the ML model data is prepared.
   * @default CompressionType.GZIP
   */
  readonly compressionType: CompressionType;
  /**
   * Specifies the type of ML model data to deploy.
   * @default S3DataType.S3_OBJECT
   */
  readonly s3DataType: S3DataType;
}

class S3ModelData extends ModelData {
  constructor(private readonly bucket: s3.IBucket,
    private readonly objectKey: string, private readonly options?: S3ModelDataOptions) {
    super();
  }

  public bind(_scope: Construct, model: IModel): ModelDataConfig {
    this.bucket.grantRead(model);

    return {
      uri: this.bucket.urlForObject(this.objectKey),
      compressionType: this.options?.compressionType,
      s3DataType: this.options?.s3DataType,
    };
  }
}

class AssetModelData extends ModelData {
  private asset?: assets.Asset;

  constructor(private readonly path: string, private readonly options: assets.AssetOptions) {
    super();
  }

  public bind(scope: Construct, model: IModel): ModelDataConfig {
    // Retain the first instantiation of this asset
    if (!this.asset) {
      this.asset = new assets.Asset(scope, `ModelData${hashcode(this.path)}`, {
        path: this.path,
        ...this.options,
      });
    }
    if (!this.asset.isFile) {
      throw new Error(`Asset must be a file, if you want to use directory you can use 'ModelData.fromBucket()' with the 's3DataType' option to 'S3DataType.S3_PREFIX' and 'compressionType' option to 'CompressionType.NONE' (${this.path})`);
    }
    this.asset.grantRead(model);

    return {
      uri: this.asset.httpUrl,
      compressionType: this.asset.assetPath.toLowerCase().endsWith(COMPRESSED_ARTIFACT_EXTENSION)
        ? CompressionType.GZIP
        : CompressionType.NONE,
      s3DataType: S3DataType.S3_OBJECT,
    };
  }
}
