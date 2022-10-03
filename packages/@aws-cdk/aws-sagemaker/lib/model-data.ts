import * as crypto from 'crypto';
import * as s3 from '@aws-cdk/aws-s3';
import * as assets from '@aws-cdk/aws-s3-assets';
import { Construct } from 'constructs';
import { IModel } from './model';

// The only supported extension for local asset model data
const ARTIFACT_EXTENSION = '.tar.gz';

/**
 * The configuration needed to reference model artifacts.
 */
export interface ModelDataConfig {
  /**
   * The S3 path where the model artifacts, which result from model training, are stored. This path
   * must point to a single gzip compressed tar archive (.tar.gz suffix).
   */
  readonly uri: string;
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
   */
  public static fromBucket(bucket: s3.IBucket, objectKey: string): ModelData {
    return new S3ModelData(bucket, objectKey);
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

class S3ModelData extends ModelData {
  constructor(private readonly bucket: s3.IBucket, private readonly objectKey: string) {
    super();
  }

  public bind(_scope: Construct, model: IModel): ModelDataConfig {
    this.bucket.grantRead(model);

    return {
      uri: this.bucket.urlForObject(this.objectKey),
    };
  }
}

class AssetModelData extends ModelData {
  private asset?: assets.Asset;

  constructor(private readonly path: string, private readonly options: assets.AssetOptions) {
    super();
    if (!path.toLowerCase().endsWith(ARTIFACT_EXTENSION)) {
      throw new Error(`Asset must be a gzipped tar file with extension ${ARTIFACT_EXTENSION} (${this.path})`);
    }
  }

  public bind(scope: Construct, model: IModel): ModelDataConfig {
    // Retain the first instantiation of this asset
    if (!this.asset) {
      this.asset = new assets.Asset(scope, `ModelData${this.hashcode(this.path)}`, {
        path: this.path,
        ...this.options,
      });
    }

    this.asset.grantRead(model);

    return {
      uri: this.asset.httpUrl,
    };
  }

  /**
   * Generates a hash from the provided string for the purposes of avoiding construct ID collision
   * for models with multiple distinct sets of model data.
   * @param s A string for which to generate a hash
   * @returns A hex string representing the hash of the provided string
   */
  private hashcode(s: string): string {
    const hash = crypto.createHash('md5');
    hash.update(s);
    return hash.digest('hex');
  }
}
