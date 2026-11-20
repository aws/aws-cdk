import * as fs from 'fs';
import { join, dirname, resolve } from 'path';
import type { Construct } from 'constructs';
import { MarkerEncoding } from './marker-encoding';
import { renderData, typeHintTokens } from './private/render-data';
import type * as iam from '../../aws-iam';
import type * as s3 from '../../aws-s3';
import * as s3_assets from '../../aws-s3-assets';
import { FileSystem } from '../../core';
import { ValidationError } from '../../core/lib/errors';
import { isInternalPath } from '../../core/lib/fs/utils';
import { TokenString } from '../../core/lib/private/encoding';
import { lit } from '../../core/lib/private/literal-string';
import * as yaml_cfn from '../../core/lib/private/yaml-cfn';

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
   *
   * Keys are the markers to replace, and values are the replacement CloudFormation
   * expressions.
   *
   * @default - no markers
   */
  readonly markers?: Record<string, any>;

  /**
   * A configuration for markers substitution strategy.
   * @default - no configuration
   */
  readonly markersConfig?: MarkersConfig;
}

/**
 * Options for `Source.data()` sources
 */
export interface SourceDataOptions {
  /**
   * Default marker encoding for markers that don't have a `markerEncodings` entry.
   *
   * - If `false` (default), the default marker encoding is `MarkerEncoding.LITERAL`.
   * - If `true`, the default marker encoding is `MarkerEncoding.UNQUOTED_JSON_VALUE`.
   *
   * See `Source.data()` for a full description of the effect of this setting.
   *
   * Unless you need fine-grained control over marker encoding, you should
   * use `Source.jsonData()` or `Source.yamlData()`.
   *
   * @default - false
   */
  readonly jsonEscape?: boolean;

}

/**
 * A configuration for markers substitution strategy.
 */
export interface MarkersConfig extends SourceDataOptions {
  /**
   * For every marker specified in the `markers` property, this defines how the marker value should be encoded.
   *
   * The key is the marker name and the value is the encoding to use for that marker.
   *
   * @default - markers with no entry use the default encoding derived from jsonEscape
   */
  readonly markerEncodings?: Record<string, MarkerEncoding>;
}

/**
 * Define options which can be passed using the method `Source.jsonData()`.
 */
export interface JsonProcessingOptions {
  /**
   * Whether deploy-time values should be treated as values and escaped
   *
   * The default behavior (`true`) treats deploy-time values as values and
   * serializes them accordingly.
   *
   * The only reason to set this to `false` would be if all Token values are
   * full JSON strings that you want to include into your JSON content as-is. You
   * must use `Token.asNumber()` on those to serialize them into an unquoted
   * context. This should be an exceedingly rare use case and hence it
   * is not the default.
   *
   * @default - true
   */
  readonly escape?: boolean;
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
          throw new ValidationError(lit`Source`, 'To use a Source.bucket(), context must be provided', scope);
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
          throw new ValidationError(lit`Source`, 'To use a Source.asset(), context must be provided', scope);
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
          throw new ValidationError(lit`AssetPathZipFileDirectory`, 'Asset path must be either a .zip file or a directory', scope);
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
   * Deploys an object with the specified string contents into the bucket.
   *
   * The content can include deploy-time values (such as `snsTopic.topicArn`)
   * that will get resolved only during deployment.
   *
   * The content is treated as an unstructured string, and deploy-time values
   * will (mostly) be replaced with a plain string substitution. To store
   * structured data, use either `Source.jsonData()` or `Source.yamlData()`.
   *
   * ## Default behavior
   *
   * Due to CloudFormation behavior, scalars (strings, numbers and booleans) in Token values are
   * all treated as strings at deploy time (`"80"`, `"true"`, etc).
   *
   * - Scalars are plain-text substituted.
   * - Non-scalars (lists, objects) lead to a deployment error
   *
   * ## JSON escaping
   *
   * JSON escaping can be forced by specifying `{ jsonEscape: true }`. Values
   * are substituted as follows:
   *
   * - Scalars come in as strings pre-encoded by CloudFormation; they are JSON-encoded, and then substituted without their surrounding quotes.
   *   - Strings expect to go into a pre-quoted JSON string context (e.g., `Source.data('{"arn": "' + snsTopic.topicArn + '"}')`).
   *   - Non-strings expect to go into a non-quoted JSON context (e.g., `Source.data('{"port": ' + cluster.port + '}')`).
   * - Non-scalars are JSON-encoded and then fully substituted. They expect to go into a non-quoted JSON
   *   context in the input string (e.g., `Source.data('{"ports": ' + Token.asString(cluster.allPorts) + '}')`).
   *
   * @param objectKey The destination S3 object key (relative to the root of the
   * S3 deployment).
   * @param data The data to be stored in the object.
   */
  public static data(objectKey: string, data: string, markersConfig?: SourceDataOptions): ISource {
    return {
      bind: (scope: Construct, context?: DeploymentSourceContext) => {
        // A list token embedded in a string is its encoding, `#{Token[...]}`, which marker
        // substitution does not recognize. It would be deployed into the file as that literal
        // text, so it is rejected here instead.
        if (TokenString.forListToken(data).test()) {
          throw new ValidationError(
            lit`ListTokenInSourceData`,
            `the content of ${JSON.stringify(objectKey)} contains a list token, which cannot be substituted into a string; use Fn.join() to join its elements, or Token.asString() with { jsonEscape: true } to insert it as a JSON array`,
            scope,
          );
        }

        const workdir = FileSystem.mkdtemp('s3-deployment');
        try {
          const outputPath = join(workdir, objectKey);
          // `objectKey` is a destination S3 object key relative to the deployment root, not a
          // local filesystem path. Guard against keys containing parent-directory segments
          // (e.g. `../`) that would resolve outside the staging directory and write the
          // rendered file to an unintended location.
          if (!isInternalPath(resolve(workdir), resolve(outputPath))) {
            throw new ValidationError(
              lit`ObjectKeyOutsideDeploymentRoot`,
              `object key ${JSON.stringify(objectKey)} points outside the deployment root, remove the '..' segments that go above it`,
              scope,
            );
          }
          const rendered = renderData(data);
          fs.mkdirSync(dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, rendered.text);
          const asset = this.asset(workdir).bind(scope, context);
          return {
            bucket: asset.bucket,
            zipObjectKey: asset.zipObjectKey,
            markers: rendered.markers,
            markersConfig: {
              jsonEscape: markersConfig?.jsonEscape,
              markerEncodings: rendered.markerEncodings,
            },
          };
        } finally {
          // Calling `this.asset()` has copied files to the assembly, so we can delete the temporary directory.
          FileSystem.rmrf(workdir);
        }
      },
    };
  }

  /**
   * Deploys an object with the specified JSON object into the bucket.
   *
   * The content can include deploy-time values (such as `snsTopic.topicArn`)
   * that will get resolved only during deployment.
   *
   * Quoting of deploy-time values will be done according to the ostensible
   * type of the Token used to represent the deploy-time value.
   *
   * - String tokens will be quoted into the JSON string skeleton, and
   *   deploy-time values will be encoded and substituted without their
   *   surrounding quotes. Will substitute correctly to working JSON if the
   *   deploy-time value is a string.
   * - Number and list tokens will be encoded and substituted without quotes. Will
   *   substitute correctly to working JSON if the deploy-time value is a
   *   number, boolean or list or map.
   *
   * Note that due to CloudFormation behavior, scalars inside lists and maps
   * will always be converted to strings.
   *
   * @param objectKey The destination S3 object key (relative to the root of the
   * S3 deployment).
   * @param obj A JSON object.
   * @param jsonProcessingOptions Options for how to process the JSON object.
   */
  public static jsonData(objectKey: string, obj: any, jsonProcessingOptions?: JsonProcessingOptions): ISource {
    return {
      bind: (scope: Construct, context?: DeploymentSourceContext) => {
        const typeHinted = typeHintTokens(obj, undefined);
        const serializedObj = JSON.stringify(typeHinted);

        return Source.data(
          objectKey,
          serializedObj,
          { jsonEscape: jsonProcessingOptions?.escape ?? true },
        ).bind(scope, context);
      },
    };
  }

  /**
   * Deploys an object with the specified JSON object formatted as YAML into the bucket.
   *
   * The object can include deploy-time values (such as `snsTopic.topicArn`) that
   * will get resolved only during deployment.
   *
   * Quoting of deploy-time values will be done according to the ostensible
   * type of the Token used to represent the deploy-time value.
   *
   * - String tokens will be unquoted if they are simple strings (basically, identifiers), and quoted
   *   if they start to look complex.
   * - Number and list tokens will be encoded and substituted without quotes. Will
   *   substitute correctly to working JSON if the deploy-time value is a
   *   number, boolean or list or map.
   *
   * Note that due to CloudFormation behavior, scalars inside lists and maps
   * will always be converted to strings.
   *
   * @param objectKey The destination S3 object key (relative to the root of the
   * S3 deployment).
   * @param obj A JSON object.
   */
  public static yamlData(objectKey: string, obj: any): ISource {
    return {
      bind: (scope: Construct, context?: DeploymentSourceContext) => {
        const typeHinted = typeHintTokens(obj, MarkerEncoding.YAML_STRING);
        const serializedObj = yaml_cfn.serialize(typeHinted);

        return Source.data(
          objectKey,
          serializedObj,
        ).bind(scope, context);
      },
    };
  }

  private constructor() { }
}
