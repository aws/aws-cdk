import cloudformation = require("@aws-cdk/aws-cloudformation");
import cloudfront = require("@aws-cdk/aws-cloudfront");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");
import s3 = require("@aws-cdk/aws-s3");
import cdk = require("@aws-cdk/core");
import { Token } from "@aws-cdk/core";
import crypto = require('crypto');
import fs = require('fs');
import path = require("path");
import { ISource, SourceConfig } from "./source";

const handlerCodeBundle = path.join(__dirname, "..", "lambda", "bundle.zip");
const handlerSourceDirectory = path.join(__dirname, '..', 'lambda', 'src');

export interface BucketDeploymentProps {
  /**
   * The sources from which to deploy the contents of this bucket.
   */
  readonly sources: ISource[];

  /**
   * The S3 bucket to sync the contents of the zip file to.
   */
  readonly destinationBucket: s3.IBucket;

  /**
   * Key prefix in the destination bucket.
   *
   * @default "/" (unzip to root of the destination bucket)
   */
  readonly destinationKeyPrefix?: string;

  /**
   * If this is set to "false", the destination files will be deleted when the
   * resource is deleted or the destination is updated.
   *
   * NOTICE: if this is set to "false" and destination bucket/prefix is updated,
   * all files in the previous destination will first be deleted and then
   * uploaded to the new destination location. This could have availablity
   * implications on your users.
   *
   * @default true - when resource is deleted/updated, files are retained
   */
  readonly retainOnDelete?: boolean;

  /**
   * The CloudFront distribution using the destination bucket as an origin.
   * Files in the distribution's edge caches will be invalidated after
   * files are uploaded to the destination bucket.
   *
   * @default - No invalidation occurs
   */
  readonly distribution?: cloudfront.IDistribution;

  /**
   * The file paths to invalidate in the CloudFront distribution.
   *
   * @default - All files under the destination bucket key prefix will be invalidated.
   */
  readonly distributionPaths?: string[];

  /**
   * The amount of memory (in MiB) to allocate to the AWS Lambda function which
   * replicates the files from the CDK bucket to the destination bucket.
   *
   * If you are deploying large files, you will need to increase this number
   * accordingly.
   *
   * @default 128
   */
  readonly memoryLimit?: number;

  /**
   * User-defined object metadata to be set on all objects in the deployment
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#UserMetadata
   */
  readonly userMetadata?: UserDefinedObjectMetadata;

  /**
   * System-defined object metadata to set on all objects in the deployment
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly cacheControl?: CacheControl[];
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly contentDisposition?: string;
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly contentEncoding?: string;
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly contentLanguage?: string;
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly contentType?: string;
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly expires?: Expires;
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly serverSideEncryption?: ServerSideEncryption;
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly storageClass?: StorageClass;
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly websiteRedirectLocation?: string;
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly serverSideEncryptionAwsKmsKeyId?: string;
  /**
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly serverSideEncryptionCustomerAlgorithm?: string;
}

export class BucketDeployment extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: BucketDeploymentProps) {
    super(scope, id);

    if (props.distributionPaths && !props.distribution) {
      throw new Error("Distribution must be specified if distribution paths are specified");
    }

    const sourceHash = calcSourceHash(handlerSourceDirectory);
    // tslint:disable-next-line: no-console
    console.error({sourceHash});

    const handler = new lambda.SingletonFunction(this, 'CustomResourceHandler', {
      uuid: this.renderSingletonUuid(props.memoryLimit),
      code: lambda.Code.fromAsset(handlerCodeBundle, { sourceHash }),
      runtime: lambda.Runtime.PYTHON_3_6,
      handler: 'index.handler',
      lambdaPurpose: 'Custom::CDKBucketDeployment',
      timeout: cdk.Duration.minutes(15),
      memorySize: props.memoryLimit
    });

    const sources: SourceConfig[] = props.sources.map((source: ISource) => source.bind(this));
    sources.forEach(source => source.bucket.grantRead(handler));

    props.destinationBucket.grantReadWrite(handler);
    if (props.distribution) {
      handler.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cloudfront:GetInvalidation', 'cloudfront:CreateInvalidation'],
        resources: ['*'],
      }));
    }

    new cloudformation.CustomResource(this, 'CustomResource', {
      provider: cloudformation.CustomResourceProvider.lambda(handler),
      resourceType: 'Custom::CDKBucketDeployment',
      properties: {
        SourceBucketNames: sources.map(source => source.bucket.bucketName),
        SourceObjectKeys: sources.map(source => source.zipObjectKey),
        DestinationBucketName: props.destinationBucket.bucketName,
        DestinationBucketKeyPrefix: props.destinationKeyPrefix,
        RetainOnDelete: props.retainOnDelete,
        UserMetadata: props.userMetadata ? mapUserMetadata(props.userMetadata) : undefined,
        SystemMetadata: mapSystemMetadata(props),
        DistributionId: props.distribution ? props.distribution.distributionId : undefined,
        DistributionPaths: props.distributionPaths
      }
    });
  }

  private renderSingletonUuid(memoryLimit?: number) {
    let uuid = '8693BB64-9689-44B6-9AAF-B0CC9EB8756C';

    // if user specify a custom memory limit, define another singleton handler
    // with this configuration. otherwise, it won't be possible to use multiple
    // configurations since we have a singleton.
    if (memoryLimit) {
      if (Token.isUnresolved(memoryLimit)) {
        throw new Error(`Can't use tokens when specifying "memoryLimit" since we use it to identify the singleton custom resource handler`);
      }

      uuid += `-${memoryLimit.toString()}MiB`;
    }

    return uuid;
  }
}

/**
 * We need a custom source hash calculation since the bundle.zip file
 * contains python dependencies installed during build and results in a
 * non-deterministic behavior.
 *
 * So we just take the `src/` directory of our custom resoruce code.
 */
function calcSourceHash(srcDir: string): string {
  const sha = crypto.createHash('sha256');
  for (const file of fs.readdirSync(srcDir)) {
    const data = fs.readFileSync(path.join(srcDir, file));
    sha.update(`<file name=${file}>`);
    sha.update(data);
    sha.update('</file>');
  }

  return sha.digest('hex');
}

/**
 * Metadata
 */

function mapUserMetadata(metadata: UserDefinedObjectMetadata) {
  const mapKey = (key: string) =>
    key.toLowerCase().startsWith("x-amzn-meta-")
      ? key.toLowerCase()
      : `x-amzn-meta-${key.toLowerCase()}`;

  return Object.keys(metadata).reduce((o, key) => ({ ...o, [mapKey(key)]: metadata[key] }), {});
}

function mapSystemMetadata(metadata: BucketDeploymentProps) {
  function mapCacheControlDirective(cacheControl: CacheControl) {
    const { value } = cacheControl;

    if (typeof value === "string") { return value; }
    if ("max-age" in value) { return `max-age=${value["max-age"].toSeconds()}`; }
    if ("s-max-age" in value) { return `s-max-age=${value["s-max-age"].toSeconds()}`; }

    throw new Error(`Unsupported cache-control directive ${value}`);
  }

  const res: { [key: string]: string } = {};
  if (metadata.cacheControl) {
    res["cache-control"] = metadata.cacheControl.map(mapCacheControlDirective).join(", ");
  }

  if (metadata.expires) {
    const { value } = metadata.expires;

    if(typeof value === "string") {
      return value;
    } else if(value instanceof Date) {
      return value.toUTCString();
    } else if(value instanceof cdk.Duration) {
      return new Date(Date.now() + value.toMilliseconds()).toUTCString();
    }

    throw new Error(`Unsupported system-metadata expires ${value}`);
  }

  if (metadata.contentDisposition) { res["content-disposition"] = metadata.contentDisposition; }
  if (metadata.contentEncoding) { res["content-encoding"] = metadata.contentEncoding; }
  if (metadata.contentLanguage) { res["content-language"] = metadata.contentLanguage; }
  if (metadata.contentType) { res["content-type"] = metadata.contentType; }
  if (metadata.serverSideEncryption) { res["server-side-encryption"] = metadata.serverSideEncryption; }
  if (metadata.storageClass) { res["storage-class"] = metadata.storageClass; }
  if (metadata.websiteRedirectLocation) { res["website-redirect-location"] = metadata.websiteRedirectLocation; }
  if (metadata.serverSideEncryptionAwsKmsKeyId) { res["ssekms-key-id"] = metadata.serverSideEncryptionAwsKmsKeyId; }
  if (metadata.serverSideEncryptionCustomerAlgorithm) { res["sse-customer-algorithm"] = metadata.serverSideEncryptionCustomerAlgorithm; }

  return Object.keys(res).length === 0 ? undefined : res;
}

export class CacheControl {
  public static mustRevalidate() { return new CacheControl("must-revalidate"); }
  public static noCache() { return new CacheControl("no-cache"); }
  public static noTransform() { return new CacheControl("no-transform"); }
  public static setPublic() { return new CacheControl("public"); }
  public static setPrivate() { return new CacheControl("private"); }
  public static proxyRevalidate() { return new CacheControl("proxy-revalidate"); }
  public static maxAge(t: cdk.Duration) { return new CacheControl({ "max-age": t }); }
  public static sMaxAge(t: cdk.Duration) { return new CacheControl({ "s-max-age": t }); }
  public static fromString(s: string) {  return new CacheControl(s); }

  private constructor(public value: any) {}
}

export enum ServerSideEncryption {
  AES_256 = 'AES256',
  AWS_KMS = 'aws:kms'
}

export enum StorageClass {
  STANDARD = 'STANDARD',
  REDUCED_REDUNDANCY = 'REDUCED_REDUNDANCY',
  STANDARD_IA = 'STANDARD_IA',
  ONEZONE_IA = 'ONEZONE_IA',
  INTELLIGENT_TIERING = 'INTELLIGENT_TIERING',
  GLACIER = 'GLACIER',
  DEEP_ARCHIVE = 'DEEP_ARCHIVE'
}

export class Expires {
  /**
   * Expire at the specified date
   * @param d date to expire at
   */
  public static atDate(d: Date) { return new Expires(d); }
  /**
   * Expire at the specified timestamp
   * @param t timestamp in unix milliseconds
   */
  public static atTimestamp(t: number) { return new Expires(t); }
  /**
   * Expire once the specified duration has passed since deployment time
   * @param t the duration to wait before expiring
   */
  public static offset(t: cdk.Duration) { return new Expires(t); }
  public static fromString(s: string) { return new Expires(s); }

  private constructor(public value: any) {}
}

export interface UserDefinedObjectMetadata {
  /**
   * Arbitrary metadata key-values
   * Keys must begin with `x-amzn-meta-` (will be added automatically if not provided)
   */
  readonly [key: string]: string;
}