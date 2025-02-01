import * as fs from 'fs';
import { join, dirname } from 'path';
import { Construct } from 'constructs';
import { renderData } from './render-data';
import * as iam from '../../aws-iam';
import * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import { FileSystem, Stack } from '../../core';
import { ValidationError } from '../../core/lib/errors';

/**
 * Source information.
 */
export interface SourceConfig {
  /**
   * The source bucket to deploy from.
   */
  readonly bucket: s3.IBucket;

  /**
   * An S3 object key in the source bucket that points to a zip file.
   */
  readonly zipObjectKey: string;

  /**
   * A set of markers to substitute in the source content.
   * @default - no markers
   */
  readonly markers?: Record<string, any>;
}

/**
 * Bind context for ISources
 */
export interface DeploymentSourceContext {
  /**
   * The role for the handler
   */
  readonly handlerRole: iam.IRole;
}

/**
 * Represents a source for bucket deployments.
 */
export interface ISource {
  /**
   * Binds the source to a bucket deployment.
   * @param scope The construct tree context.
   */
  bind(scope: Construct, context?: DeploymentSourceContext): SourceConfig;
}

/**
 * Specifies bucket deployment source.
 *
 * Usage:
 *
 *     Source.bucket(bucket, key)
 *     Source.asset('/local/path/to/directory')
 *     Source.asset('/local/path/to/a/file.zip')
 *     Source.data('hello/world/file.txt', 'Hello, world!')
 *     Source.jsonData('config.json', { baz: topic.topicArn })
 *     Source.yamlData('config.yaml', { baz: topic.topicArn })
 *
 */
export class Source {
  /**
   * Uses a .zip file stored in an S3 bucket as the source for the destination bucket contents.
   *
   * Make sure you trust the producer of the archive.
   *
   * If the `bucket` parameter is an "out-of-app" reference "imported" via static methods such
   * as `s3.Bucket.fromBucketName`, be cautious about the bucket's encryption key. In general,
   * CDK does not query for additional properties of imported constructs at synthesis time.
   * For example, for a bucket created from `s3.Bucket.fromBucketName`, CDK does not know
   * its `IBucket.encryptionKey` property, and therefore will NOT give KMS permissions to the
   * Lambda execution role of the `BucketDeployment` construct. If you want the
   * `kms:Decrypt` and `kms:DescribeKey` permissions on the bucket's encryption key
   * to be added automatically, reference the imported bucket via `s3.Bucket.fromBucketAttributes`
   * and pass in the `encryptionKey` attribute explicitly.
   *
   * @example
   * declare const destinationBucket: s3.Bucket;
   * const sourceBucket = s3.Bucket.fromBucketAttributes(this, 'SourceBucket', {
   *   bucketArn: 'arn:aws:s3:::my-source-bucket-name',
   *   encryptionKey: kms.Key.fromKeyArn(
   *     this,
   *     'SourceBucketEncryptionKey',
   *     'arn:aws:kms:us-east-1:123456789012:key/<key-id>'
   *   ),
   * });
   * const deployment = new s3deploy.BucketDeployment(this, 'DeployFiles', {
   *   sources: [s3deploy.Source.bucket(sourceBucket, 'source.zip')],
   *   destinationBucket,
   * });
   *
   * @param bucket The S3 Bucket
   * @param zipObjectKey The S3 object key of the zip file with contents
   */
  public static bucket(bucket: s3.IBucket, zipObjectKey: string): ISource {
    return {
      bind: (scope: Construct, context?: DeploymentSourceContext) => {
        if (!context) {
          throw new ValidationError('To use a Source.bucket(), context must be provided', scope);
        }

        bucket.grantRead(context.handlerRole);
        return { bucket, zipObjectKey };
      },
    };
  }

  /**
   * Uses a local asset as the deployment source.
   *
   * If the local asset is a .zip archive, make sure you trust the
   * producer of the archive.
   *
   * @param path The path to a local .zip file or a directory
   */
  public static asset(path: string, options?: s3_assets.AssetOptions): ISource {
    return {
      bind(scope: Construct, context?: DeploymentSourceContext): SourceConfig {
        if (!context) {
          throw new ValidationError('To use a Source.asset(), context must be provided', scope);
        }

        let id = 1;
        while (scope.node.tryFindChild(`Asset${id}`)) {
          id++;
        }
        const asset = new s3_assets.Asset(scope, `Asset${id}`, {
          path,
          ...options,
        });
        if (!asset.isZipArchive) {
          throw new ValidationError('Asset path must be either a .zip file or a directory', scope);
        }
        asset.grantRead(context.handlerRole);

        return {
          bucket: asset.bucket,
          zipObjectKey: asset.s3ObjectKey,
        };
      },
    };
  }

  /**
   * Deploys an object with the specified string contents into the bucket. The
   * content can include deploy-time values (such as `snsTopic.topicArn`) that
   * will get resolved only during deployment.
   *
   * To store a JSON object use `Source.jsonData()`.
   * To store YAML content use `Source.yamlData()`.
   *
   * @param objectKey The destination S3 object key (relative to the root of the
   * S3 deployment).
   * @param data The data to be stored in the object.
   */
  public static data(objectKey: string, data: string): ISource {
    return {
      bind: (scope: Construct, context?: DeploymentSourceContext) => {
        const workdir = FileSystem.mkdtemp('s3-deployment');
        const outputPath = join(workdir, objectKey);
        const rendered = renderData(scope, data);
        fs.mkdirSync(dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, rendered.text);
        const asset = this.asset(workdir).bind(scope, context);
        return {
          bucket: asset.bucket,
          zipObjectKey: asset.zipObjectKey,
          markers: rendered.markers,
        };
      },
    };
  }

  /**
   * Deploys an object with the specified JSON object into the bucket. The
   * object can include deploy-time values (such as `snsTopic.topicArn`) that
   * will get resolved only during deployment.
   *
   * @param objectKey The destination S3 object key (relative to the root of the
   * S3 deployment).
   * @param obj A JSON object.
   */
  public static jsonData(objectKey: string, obj: any): ISource {
    return {
      bind: (scope: Construct, context?: DeploymentSourceContext) => {
        return Source.data(objectKey, Stack.of(scope).toJsonString(obj)).bind(scope, context);
      },
    };
  }

  /**
   * Deploys an object with the specified JSON object formatted as YAML into the bucket.
   * The object can include deploy-time values (such as `snsTopic.topicArn`) that
   * will get resolved only during deployment.
   *
   * @param objectKey The destination S3 object key (relative to the root of the
   * S3 deployment).
   * @param obj A JSON object.
   */
  public static yamlData(objectKey: string, obj: any): ISource {
    return {
      bind: (scope: Construct, context?: DeploymentSourceContext) => {
        return Source.data(objectKey, Stack.of(scope).toYamlString(obj)).bind(scope, context);
      },
    };
  }

  private constructor() { }
}
