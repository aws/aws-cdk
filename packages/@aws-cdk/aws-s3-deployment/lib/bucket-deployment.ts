import cloudformation = require("@aws-cdk/aws-cloudformation");
import cloudfront = require("@aws-cdk/aws-cloudfront");
import iam = require("@aws-cdk/aws-iam");
import lambda = require("@aws-cdk/aws-lambda");
import s3 = require("@aws-cdk/aws-s3");
import cdk = require("@aws-cdk/core");
import { Token } from "@aws-cdk/core";
import path = require("path");
import { ISource, SourceConfig } from "./source";

const handlerCodeBundle = path.join(__dirname, "..", "lambda", "bundle.zip");

export type CacheControlDirective =
  | "must-revalidate"
  | "no-cache"
  | "no-store"
  | "no-transform"
  | "public"
  | "private"
  | "proxy-revalidate"
  | { "max-age": cdk.Duration }
  | { "s-max-age": cdk.Duration }
  | string;
export type SystemDefinedObjectsMetadata = {
  "cache-control"?: CacheControlDirective[];
  "content-disposition"?: string;
  "content-encoding"?: string;
  "content-language"?: string;
  "content-type"?: string;
  expires?: string | Date;
};

export type UserDefinedObjectsMetadata = {
  /**
   * Arbitrary metadata key-values
   * Keys must begin with `x-amzn-meta-` (will be added automatically if not provided)
   */
  [key: string]: string;
};

export type ObjectsMetadata = {
  /**
   * System-defined objects metadata
   */
  system?: SystemDefinedObjectsMetadata;
  /**
   * User-defined objects metadata
   */
  user?: UserDefinedObjectsMetadata;
};

function mapUserMetadata(metadata: UserDefinedObjectsMetadata) {
  const mapKey = (key: string) =>
    key.toLowerCase().startsWith("x-amzn-meta-")
      ? key.toLowerCase()
      : `x-amzn-meta-${key.toLowerCase()}`;

  return Object.keys(metadata).reduce((o, key) => ({ ...o, [mapKey(key)]: metadata[key] }), {});
}

function mapSystemMetadata(metadata: SystemDefinedObjectsMetadata) {
  function mapCacheControlDirective(value: CacheControlDirective) {
    if (typeof value === "string") return value;
    if ("max-age" in value) return `max-age=${value["max-age"].toSeconds()}`;
    if ("s-max-age" in value) return `s-max-age=${value["s-max-age"].toSeconds()}`;
    throw new Error(`Unsupported cache-control directive ${value}`);
  }

  const res: { [key: string]: string } = {};
  if (metadata["cache-control"]) {
    res["cache-control"] = metadata["cache-control"].map(mapCacheControlDirective).join(", ");
  }

  if (metadata["expires"]) {
    const val = metadata["expires"];
    res["expires"] = typeof val === "string" ? val : val.toUTCString();
  }

  if (metadata["content-disposition"]) res["content-disposition"] = metadata["content-disposition"];
  if (metadata["content-encoding"]) res["content-encoding"] = metadata["content-encoding"];
  if (metadata["content-language"]) res["content-language"] = metadata["content-language"];
  if (metadata["content-type"]) res["content-type"] = metadata["content-type"];

  return res;
}

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
   * A map of object metadata to set on all objects in the deployment
   *
   * @default - No object metadata is set
   */
  readonly objectsMetadata?: ObjectsMetadata;

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
}

export class BucketDeployment extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: BucketDeploymentProps) {
    super(scope, id);

    if (props.distributionPaths && !props.distribution) {
      throw new Error("Distribution must be specified if distribution paths are specified");
    }

    const handler = new lambda.SingletonFunction(this, 'CustomResourceHandler', {
      uuid: this.renderSingletonUuid(props.memoryLimit),
      code: lambda.Code.fromAsset(handlerCodeBundle),
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
        ObjectsMetadata: props.objectsMetadata ? {
          user: props.objectsMetadata.user ? mapUserMetadata(props.objectsMetadata.user) : undefined,
          system: props.objectsMetadata.system ? mapSystemMetadata(props.objectsMetadata.system) : undefined
        } : undefined,
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
