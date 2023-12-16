
import * as fs from 'fs';
import { kebab as toKebabCase } from 'case';
import { Construct } from 'constructs';
import { ISource, SourceConfig, Source } from './source';
import * as cloudfront from '../../aws-cloudfront';
import * as ec2 from '../../aws-ec2';
import * as efs from '../../aws-efs';
import * as iam from '../../aws-iam';
import * as lambda from '../../aws-lambda';
import * as logs from '../../aws-logs';
import * as s3 from '../../aws-s3';
import * as cdk from '../../core';
import { BucketDeploymentSingletonFunction } from '../../custom-resource-handlers/dist/aws-s3-deployment/bucket-deployment-provider.generated';
import { AwsCliLayer } from '../../lambda-layer-awscli';

// tag key has a limit of 128 characters
const CUSTOM_RESOURCE_OWNER_TAG = 'aws-cdk:cr-owned';

/**
 * Properties for `BucketDeployment`.
 */
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
   * Must be <=104 characters
   *
   * @default "/" (unzip to root of the destination bucket)
   */
  readonly destinationKeyPrefix?: string;

  /**
   * If this is set, the zip file will be synced to the destination S3 bucket and extracted.
   * If false, the file will remain zipped in the destination bucket.
   * @default true
   */
  readonly extract?: boolean;

  /**
   * If this is set, matching files or objects will be excluded from the deployment's sync
   * command. This can be used to exclude a file from being pruned in the destination bucket.
   *
   * If you want to just exclude files from the deployment package (which excludes these files
   * evaluated when invalidating the asset), you should leverage the `exclude` property of
   * `AssetOptions` when defining your source.
   *
   * @default - No exclude filters are used
   * @see https://docs.aws.amazon.com/cli/latest/reference/s3/index.html#use-of-exclude-and-include-filters
   */
  readonly exclude?: string[]

  /**
   * If this is set, matching files or objects will be included with the deployment's sync
   * command. Since all files from the deployment package are included by default, this property
   * is usually leveraged alongside an `exclude` filter.
   *
   * @default - No include filters are used and all files are included with the sync command
   * @see https://docs.aws.amazon.com/cli/latest/reference/s3/index.html#use-of-exclude-and-include-filters
   */
  readonly include?: string[]

  /**
   * If this is set to false, files in the destination bucket that
   * do not exist in the asset, will NOT be deleted during deployment (create/update).
   *
   * @see https://docs.aws.amazon.com/cli/latest/reference/s3/sync.html
   *
   * @default true
   */
  readonly prune?: boolean

  /**
   * If this is set to "false", the destination files will be deleted when the
   * resource is deleted or the destination is updated.
   *
   * NOTICE: Configuring this to "false" might have operational implications. Please
   * visit to the package documentation referred below to make sure you fully understand those implications.
   *
   * @see https://github.com/aws/aws-cdk/tree/main/packages/aws-cdk-lib/aws-s3-deployment#retain-on-delete
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
   * The number of days that the lambda function's log events are kept in CloudWatch Logs.
   *
   * @default logs.RetentionDays.INFINITE
   */
  readonly logRetention?: logs.RetentionDays;

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
   * The size of the AWS Lambda function’s /tmp directory in MiB.
   *
   * @default 512 MiB
   */
  readonly ephemeralStorageSize?: cdk.Size;

  /**
   *  Mount an EFS file system. Enable this if your assets are large and you encounter disk space errors.
   *  Enabling this option will require a VPC to be specified.
   *
   * @default - No EFS. Lambda has access only to 512MB of disk space.
   */
  readonly useEfs?: boolean

  /**
   * Execution role associated with this function
   *
   * @default - A role is automatically created
   */
  readonly role?: iam.IRole;

  /**
   * User-defined object metadata to be set on all objects in the deployment
   * @default - No user metadata is set
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#UserMetadata
   */
  readonly metadata?: { [key: string]: string };

  /**
   * System-defined cache-control metadata to be set on all objects in the deployment.
   * @default - Not set.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly cacheControl?: CacheControl[];
  /**
   * System-defined cache-disposition metadata to be set on all objects in the deployment.
   * @default - Not set.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly contentDisposition?: string;
  /**
   * System-defined content-encoding metadata to be set on all objects in the deployment.
   * @default - Not set.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly contentEncoding?: string;
  /**
   * System-defined content-language metadata to be set on all objects in the deployment.
   * @default - Not set.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly contentLanguage?: string;
  /**
   * System-defined content-type metadata to be set on all objects in the deployment.
   * @default - Not set.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly contentType?: string;
  /**
   * System-defined expires metadata to be set on all objects in the deployment.
   * @default - The objects in the distribution will not expire.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly expires?: cdk.Expiration;
  /**
   * System-defined x-amz-server-side-encryption metadata to be set on all objects in the deployment.
   * @default - Server side encryption is not used.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly serverSideEncryption?: ServerSideEncryption;
  /**
   * System-defined x-amz-storage-class metadata to be set on all objects in the deployment.
   * @default - Default storage-class for the bucket is used.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly storageClass?: StorageClass;
  /**
   * System-defined x-amz-website-redirect-location metadata to be set on all objects in the deployment.
   * @default - No website redirection.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly websiteRedirectLocation?: string;
  /**
   * System-defined x-amz-server-side-encryption-aws-kms-key-id metadata to be set on all objects in the deployment.
   * @default - Not set.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
   */
  readonly serverSideEncryptionAwsKmsKeyId?: string;
  /**
   * System-defined x-amz-server-side-encryption-customer-algorithm metadata to be set on all objects in the deployment.
   * Warning: This is not a useful parameter until this bug is fixed: https://github.com/aws/aws-cdk/issues/6080
   * @default - Not set.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerSideEncryptionCustomerKeys.html#sse-c-how-to-programmatically-intro
   */
  readonly serverSideEncryptionCustomerAlgorithm?: string;
  /**
   * System-defined x-amz-acl metadata to be set on all objects in the deployment.
   * @default - Not set.
   * @see https://docs.aws.amazon.com/AmazonS3/latest/userguide/acl-overview.html#canned-acl
   */
  readonly accessControl?: s3.BucketAccessControl;

  /**
   * The VPC network to place the deployment lambda handler in.
   * This is required if `useEfs` is set.
   *
   * @default None
   */
  readonly vpc?: ec2.IVpc;

  /**
   * Where in the VPC to place the deployment lambda handler.
   * Only used if 'vpc' is supplied.
   *
   * @default - the Vpc default strategy if not specified
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * If set to true, uploads will precompute the value of `x-amz-content-sha256`
   * and include it in the signed S3 request headers.
   *
   * @default - `x-amz-content-sha256` will not be computed
   */
  readonly signContent?: boolean;
}

/**
 * `BucketDeployment` populates an S3 bucket with the contents of .zip files from
 * other S3 buckets or from local disk
 */
export class BucketDeployment extends Construct {
  private readonly cr: cdk.CustomResource;
  private _deployedBucket?: s3.IBucket;
  private requestDestinationArn: boolean = false;
  private readonly destinationBucket: s3.IBucket;
  private readonly sources: SourceConfig[];
  private readonly handlerRole: iam.IRole;

  constructor(scope: Construct, id: string, props: BucketDeploymentProps) {
    super(scope, id);

    if (props.distributionPaths) {
      if (!props.distribution) {
        throw new Error('Distribution must be specified if distribution paths are specified');
      }
      if (!cdk.Token.isUnresolved(props.distributionPaths)) {
        if (!props.distributionPaths.every(distributionPath => cdk.Token.isUnresolved(distributionPath) || distributionPath.startsWith('/'))) {
          throw new Error('Distribution paths must start with "/"');
        }
      }
    }

    if (props.useEfs && !props.vpc) {
      throw new Error('Vpc must be specified if useEfs is set');
    }

    this.destinationBucket = props.destinationBucket;

    const accessPointPath = '/lambda';
    let accessPoint;
    if (props.useEfs && props.vpc) {
      const accessMode = '0777';
      const fileSystem = this.getOrCreateEfsFileSystem(scope, {
        vpc: props.vpc,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      });
      accessPoint = fileSystem.addAccessPoint('AccessPoint', {
        path: accessPointPath,
        createAcl: {
          ownerUid: '1001',
          ownerGid: '1001',
          permissions: accessMode,
        },
        posixUser: {
          uid: '1001',
          gid: '1001',
        },
      });
      accessPoint.node.addDependency(fileSystem.mountTargetsAvailable);
    }

    // Making VPC dependent on BucketDeployment so that CFN stack deletion is smooth.
    // Refer comments on https://github.com/aws/aws-cdk/pull/15220 for more details.
    if (props.vpc) {
      this.node.addDependency(props.vpc);
    }

    const mountPath = `/mnt${accessPointPath}`;
    const handler = new BucketDeploymentSingletonFunction(this, 'CustomResourceHandler', {
      uuid: this.renderSingletonUuid(props.memoryLimit, props.ephemeralStorageSize, props.vpc),
      layers: [new AwsCliLayer(this, 'AwsCliLayer')],
      environment: {
        ...props.useEfs ? { MOUNT_PATH: mountPath } : undefined,
        // Override the built-in CA bundle from the AWS CLI with the Lambda-curated one
        // This is necessary to make the CLI work in ADC regions.
        AWS_CA_BUNDLE: '/etc/pki/ca-trust/extracted/pem/tls-ca-bundle.pem',
      },
      lambdaPurpose: 'Custom::CDKBucketDeployment',
      timeout: cdk.Duration.minutes(15),
      role: props.role,
      memorySize: props.memoryLimit,
      ephemeralStorageSize: props.ephemeralStorageSize,
      vpc: props.vpc,
      vpcSubnets: props.vpcSubnets,
      filesystem: accessPoint ? lambda.FileSystem.fromEfsAccessPoint(
        accessPoint,
        mountPath,
      ) : undefined,
      logRetention: props.logRetention,
    });

    const handlerRole = handler.role;
    if (!handlerRole) { throw new Error('lambda.SingletonFunction should have created a Role'); }
    this.handlerRole = handlerRole;

    this.sources = props.sources.map((source: ISource) => source.bind(this, { handlerRole: this.handlerRole }));

    this.destinationBucket.grantReadWrite(handler);
    if (props.accessControl) {
      this.destinationBucket.grantPutAcl(handler);
    }
    if (props.distribution) {
      handler.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['cloudfront:GetInvalidation', 'cloudfront:CreateInvalidation'],
        resources: ['*'],
      }));
    }

    // Markers are not replaced if zip sources are not extracted, so throw an error
    // if extraction is not wanted and sources have markers.
    const _this = this;
    this.node.addValidation({
      validate(): string[] {
        if (_this.sources.some(source => source.markers) && props.extract == false) {
          return ['Some sources are incompatible with extract=false; sources with deploy-time values (such as \'snsTopic.topicArn\') must be extracted.'];
        }
        return [];
      },
    });

    const crUniqueId = `CustomResource${this.renderUniqueId(props.memoryLimit, props.ephemeralStorageSize, props.vpc)}`;
    this.cr = new cdk.CustomResource(this, crUniqueId, {
      serviceToken: handler.functionArn,
      resourceType: 'Custom::CDKBucketDeployment',
      properties: {
        SourceBucketNames: cdk.Lazy.uncachedList({ produce: () => this.sources.map(source => source.bucket.bucketName) }),
        SourceObjectKeys: cdk.Lazy.uncachedList({ produce: () => this.sources.map(source => source.zipObjectKey) }),
        SourceMarkers: cdk.Lazy.uncachedAny({
          produce: () => {
            return this.sources.reduce((acc, source) => {
              if (source.markers) {
                acc.push(source.markers);
                // if there are more than 1 source, then all sources
                // require markers (custom resource will throw an error otherwise)
              } else if (this.sources.length > 1) {
                acc.push({});
              }
              return acc;
            }, [] as Array<Record<string, any>>);
          },
        }, { omitEmptyArray: true }),
        DestinationBucketName: this.destinationBucket.bucketName,
        DestinationBucketKeyPrefix: props.destinationKeyPrefix,
        RetainOnDelete: props.retainOnDelete,
        Extract: props.extract,
        Prune: props.prune ?? true,
        Exclude: props.exclude,
        Include: props.include,
        UserMetadata: props.metadata ? mapUserMetadata(props.metadata) : undefined,
        SystemMetadata: mapSystemMetadata(props),
        DistributionId: props.distribution?.distributionId,
        DistributionPaths: props.distributionPaths,
        SignContent: props.signContent,
        // Passing through the ARN sequences dependency on the deployment
        DestinationBucketArn: cdk.Lazy.string({ produce: () => this.requestDestinationArn ? this.destinationBucket.bucketArn : undefined }),
      },
    });

    let prefix: string = props.destinationKeyPrefix ?
      `:${props.destinationKeyPrefix}` :
      '';
    prefix += `:${this.cr.node.addr.slice(-8)}`;
    const tagKey = CUSTOM_RESOURCE_OWNER_TAG + prefix;

    // destinationKeyPrefix can be 104 characters before we hit
    // the tag key limit of 128
    // '/this/is/a/random/key/prefix/that/is/a/lot/of/characters/do/we/think/that/it/will/ever/be/this/long?????'
    // better to throw an error here than wait for CloudFormation to fail
    if (!cdk.Token.isUnresolved(tagKey) && tagKey.length > 128) {
      throw new Error('The BucketDeployment construct requires that the "destinationKeyPrefix" be <=104 characters.');
    }

    /*
     * This will add a tag to the deployment bucket in the format of
     * `aws-cdk:cr-owned:{keyPrefix}:{uniqueHash}`
     *
     * For example:
     * {
     *   Key: 'aws-cdk:cr-owned:deploy/here/:240D17B3',
     *   Value: 'true',
     * }
     *
     * This will allow for scenarios where there is a single S3 Bucket that has multiple
     * BucketDeployment resources deploying to it. Each bucket + keyPrefix can be "owned" by
     * 1 or more BucketDeployment resources. Since there are some scenarios where multiple BucketDeployment
     * resources can deploy to the same bucket and key prefix (e.g. using include/exclude) we
     * also append part of the id to make the key unique.
     *
     * As long as a bucket + keyPrefix is "owned" by a BucketDeployment resource, another CR
     * cannot delete data. There are a couple of scenarios where this comes into play.
     *
     * 1. If the LogicalResourceId of the CustomResource changes (e.g. the crUniqueId changes)
     * CloudFormation will first issue a 'Create' to create the new CustomResource and will
     * update the Tag on the bucket. CloudFormation will then issue a 'Delete' on the old CustomResource
     * and since the new CR "owns" the Bucket+keyPrefix it will not delete the contents of the bucket
     *
     * 2. If the BucketDeployment resource is deleted _and_ it is the only CR for that bucket+keyPrefix
     * then CloudFormation will first remove the tag from the bucket and then issue a "Delete" to the
     * CR. Since there are no tags indicating that this bucket+keyPrefix is "owned" then it will delete
     * the contents.
     *
     * 3. If the BucketDeployment resource is deleted _and_ it is *not* the only CR for that bucket:keyPrefix
     * then CloudFormation will first remove the tag from the bucket and then issue a "Delete" to the CR.
     * Since there are other CRs that also "own" that bucket+keyPrefix there will still be a tag on the bucket
     * and the contents will not be removed.
     *
     * 4. If the BucketDeployment resource _and_ the S3 Bucket are both removed, then CloudFormation will first
     * issue a "Delete" to the CR and since there is a tag on the bucket the contents will not be removed. If you
     * want the contents of the bucket to be removed on bucket deletion, then `autoDeleteObjects` property should
     * be set to true on the Bucket.
     */
    cdk.Tags.of(this.destinationBucket).add(tagKey, 'true');

  }

  /**
   * The bucket after the deployment
   *
   * If you want to reference the destination bucket in another construct and make sure the
   * bucket deployment has happened before the next operation is started, pass the other construct
   * a reference to `deployment.deployedBucket`.
   *
   * Note that this only returns an immutable reference to the destination bucket.
   * If sequenced access to the original destination bucket is required, you may add a dependency
   * on the bucket deployment instead: `otherResource.node.addDependency(deployment)`
   */
  public get deployedBucket(): s3.IBucket {
    this.requestDestinationArn = true;
    this._deployedBucket = this._deployedBucket ?? s3.Bucket.fromBucketAttributes(this, 'DestinationBucket', {
      bucketArn: cdk.Token.asString(this.cr.getAtt('DestinationBucketArn')),
      region: this.destinationBucket.env.region,
      account: this.destinationBucket.env.account,
      isWebsite: this.destinationBucket.isWebsite,
    });
    return this._deployedBucket;
  }

  /**
   * The object keys for the sources deployed to the S3 bucket.
   *
   * This returns a list of tokenized object keys for source files that are deployed to the bucket.
   *
   * This can be useful when using `BucketDeployment` with `extract` set to `false` and you need to reference
   * the object key that resides in the bucket for that zip source file somewhere else in your CDK
   * application, such as in a CFN output.
   *
   * For example, use `Fn.select(0, myBucketDeployment.objectKeys)` to reference the object key of the
   * first source file in your bucket deployment.
   */
  public get objectKeys(): string[] {
    const objectKeys = cdk.Token.asList(this.cr.getAtt('SourceObjectKeys'));
    return objectKeys;
  }

  /**
   * Add an additional source to the bucket deployment
   *
   * @example
   * declare const websiteBucket: s3.IBucket;
   * const deployment = new s3deploy.BucketDeployment(this, 'Deployment', {
   *   sources: [s3deploy.Source.asset('./website-dist')],
   *   destinationBucket: websiteBucket,
   * });
   *
   * deployment.addSource(s3deploy.Source.asset('./another-asset'));
   */
  public addSource(source: ISource): void {
    const config = source.bind(this, { handlerRole: this.handlerRole });
    if (!this.sources.some((c) => sourceConfigEqual(cdk.Stack.of(this), c, config))) {
      this.sources.push(config);
    }
  }

  private renderUniqueId(memoryLimit?: number, ephemeralStorageSize?: cdk.Size, vpc?: ec2.IVpc) {
    let uuid = '';

    // if the user specifes a custom memory limit, we define another singleton handler
    // with this configuration. otherwise, it won't be possible to use multiple
    // configurations since we have a singleton.
    if (memoryLimit) {
      if (cdk.Token.isUnresolved(memoryLimit)) {
        throw new Error("Can't use tokens when specifying 'memoryLimit' since we use it to identify the singleton custom resource handler.");
      }

      uuid += `-${memoryLimit.toString()}MiB`;
    }

    // if the user specifies a custom ephemeral storage size, we define another singleton handler
    // with this configuration. otherwise, it won't be possible to use multiple
    // configurations since we have a singleton.
    if (ephemeralStorageSize) {
      if (ephemeralStorageSize.isUnresolved()) {
        throw new Error("Can't use tokens when specifying 'ephemeralStorageSize' since we use it to identify the singleton custom resource handler.");
      }

      uuid += `-${ephemeralStorageSize.toMebibytes().toString()}MiB`;
    }

    // if the user specifies a VPC, we define another singleton handler
    // with this configuration. otherwise, it won't be possible to use multiple
    // configurations since we have a singleton.
    // A VPC is a must if EFS storage is used and that's why we are only using VPC in uuid.
    if (vpc) {
      uuid += `-${vpc.node.addr}`;
    }

    return uuid;
  }

  private renderSingletonUuid(memoryLimit?: number, ephemeralStorageSize?: cdk.Size, vpc?: ec2.IVpc) {
    let uuid = '8693BB64-9689-44B6-9AAF-B0CC9EB8756C';

    uuid += this.renderUniqueId(memoryLimit, ephemeralStorageSize, vpc);

    return uuid;
  }

  /**
   * Function to get/create a stack singleton instance of EFS FileSystem per vpc.
   *
   * @param scope Construct
   * @param fileSystemProps EFS FileSystemProps
   */
  private getOrCreateEfsFileSystem(scope: Construct, fileSystemProps: efs.FileSystemProps): efs.FileSystem {
    const stack = cdk.Stack.of(scope);
    const uuid = `BucketDeploymentEFS-VPC-${fileSystemProps.vpc.node.addr}`;
    return stack.node.tryFindChild(uuid) as efs.FileSystem ?? new efs.FileSystem(scope, uuid, fileSystemProps);
  }
}

export interface DeployTimeSubstitutedFileProps {
  /**
   * Path to the user's local file.
   */
  readonly source: string;

  /**
   * The S3 bucket to sync the contents of the zip file to.
   */
  readonly destinationBucket: s3.IBucket;

  /**
   * User-defined substitutions to make in the file.
   * Placeholders in the user's local file must be specified with double curly
   * brackets and spaces. For example, if you use the key 'xxxx' in the file,
   * it must be written as: {{ xxxx }} to be recognized by the construct as a
   * substitution.
   */
  readonly substitutions: { [key: string]: string };

  /**
   * Execution role associated with this function
   *
   * @default - A role is automatically created
   */
  readonly role?: iam.IRole;
}

/**
 * `DeployTimeSubstitutedFile` is an extension of `BucketDeployment` that allows users to
 * upload individual files and specify to make substitutions in the file.
 */
export class DeployTimeSubstitutedFile extends BucketDeployment {

  public readonly objectKey: string;

  constructor(scope: Construct, id: string, props: DeployTimeSubstitutedFileProps) {
    if (!fs.existsSync(props.source)) {
      throw new Error(`No file found at 'source' path ${props.source}`);
    }
    // Makes substitutions on the file
    let fileData = fs.readFileSync(props.source, 'utf-8');
    fileData = fileData.replace(/{{\s*(\w+)\s*}}/g, function(match, expr) {
      return props.substitutions[expr] ?? match;
    });

    const objectKey = cdk.FileSystem.fingerprint(props.source);
    const fileSource = Source.data(objectKey, fileData);
    const fullBucketDeploymentProps: BucketDeploymentProps = {
      prune: false,
      extract: true,
      ...props,
      sources: [fileSource],
      role: props.role,
    };
    super(scope, id, fullBucketDeploymentProps);
    // sets the object key
    this.objectKey = objectKey;
  }

  public get bucket(): s3.IBucket {
    return this.deployedBucket;
  }
}

/**
 * Metadata.
 *
 * The `x-amz-meta-` prefix will automatically be added to keys.
 *
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#UserMetadata
 */

function mapUserMetadata(metadata: { [key: string]: string }) {
  const mapKey = (key: string) => key.toLowerCase();

  return Object.keys(metadata).reduce((o, key) => ({ ...o, [mapKey(key)]: metadata[key] }), {});
}

function mapSystemMetadata(metadata: BucketDeploymentProps) {
  const res: { [key: string]: string } = {};

  if (metadata.cacheControl) { res['cache-control'] = metadata.cacheControl.map(c => c.value).join(', '); }
  if (metadata.expires) { res.expires = metadata.expires.date.toUTCString(); }
  if (metadata.contentDisposition) { res['content-disposition'] = metadata.contentDisposition; }
  if (metadata.contentEncoding) { res['content-encoding'] = metadata.contentEncoding; }
  if (metadata.contentLanguage) { res['content-language'] = metadata.contentLanguage; }
  if (metadata.contentType) { res['content-type'] = metadata.contentType; }
  if (metadata.serverSideEncryption) { res.sse = metadata.serverSideEncryption; }
  if (metadata.storageClass) { res['storage-class'] = metadata.storageClass; }
  if (metadata.websiteRedirectLocation) { res['website-redirect'] = metadata.websiteRedirectLocation; }
  if (metadata.serverSideEncryptionAwsKmsKeyId) { res['sse-kms-key-id'] = metadata.serverSideEncryptionAwsKmsKeyId; }
  if (metadata.serverSideEncryptionCustomerAlgorithm) { res['sse-c-copy-source'] = metadata.serverSideEncryptionCustomerAlgorithm; }
  if (metadata.accessControl) { res.acl = toKebabCase(metadata.accessControl.toString()); }

  return Object.keys(res).length === 0 ? undefined : res;
}

/**
 * Used for HTTP cache-control header, which influences downstream caches.
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 */
export class CacheControl {

  /**
   * Sets 'must-revalidate'.
   */
  public static mustRevalidate() { return new CacheControl('must-revalidate'); }

  /**
   * Sets 'no-cache'.
   */
  public static noCache() { return new CacheControl('no-cache'); }

  /**
   * Sets 'no-transform'.
   */
  public static noTransform() { return new CacheControl('no-transform'); }

  /**
   * Sets 'no-store'.
   */
  public static noStore() { return new CacheControl('no-store'); }

  /**
   * Sets 'must-understand'.
   */
  public static mustUnderstand() { return new CacheControl('must-understand'); }

  /**
   * Sets 'public'.
   */
  public static setPublic() { return new CacheControl('public'); }

  /**
   * Sets 'private'.
   */
  public static setPrivate() { return new CacheControl('private'); }

  /**
   * Sets 'immutable'.
   */
  public static immutable() { return new CacheControl('immutable'); }

  /**
   * Sets 'proxy-revalidate'.
   */
  public static proxyRevalidate() { return new CacheControl('proxy-revalidate'); }

  /**
   * Sets 'max-age=<duration-in-seconds>'.
   */
  public static maxAge(t: cdk.Duration) { return new CacheControl(`max-age=${t.toSeconds()}`); }

  /**
   * Sets 's-maxage=<duration-in-seconds>'.
   */
  public static sMaxAge(t: cdk.Duration) { return new CacheControl(`s-maxage=${t.toSeconds()}`); }

  /**
   * Sets 'stale-while-revalidate=<duration-in-seconds>'.
   */
  public static staleWhileRevalidate(t: cdk.Duration) { return new CacheControl(`stale-while-revalidate=${t.toSeconds()}`); }

  /**
   * Sets 'stale-if-error=<duration-in-seconds>'.
   */
  public static staleIfError(t: cdk.Duration) { return new CacheControl(`stale-if-error=${t.toSeconds()}`); }

  /**
   * Constructs a custom cache control key from the literal value.
   */
  public static fromString(s: string) { return new CacheControl(s); }

  private constructor(
    /**
     * The raw cache control setting.
     */
    public readonly value: any,
  ) { }
}

/**
 * Indicates whether server-side encryption is enabled for the object, and whether that encryption is
 * from the AWS Key Management Service (AWS KMS) or from Amazon S3 managed encryption (SSE-S3).
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 */
export enum ServerSideEncryption {

  /**
   * 'AES256'
   */
  AES_256 = 'AES256',

  /**
   * 'aws:kms'
   */
  AWS_KMS = 'aws:kms'
}

/**
 * Storage class used for storing the object.
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 */
export enum StorageClass {

  /**
   * 'STANDARD'
   */
  STANDARD = 'STANDARD',

  /**
   * 'REDUCED_REDUNDANCY'
   */
  REDUCED_REDUNDANCY = 'REDUCED_REDUNDANCY',

  /**
   * 'STANDARD_IA'
   */
  STANDARD_IA = 'STANDARD_IA',

  /**
   * 'ONEZONE_IA'
   */
  ONEZONE_IA = 'ONEZONE_IA',

  /**
   * 'INTELLIGENT_TIERING'
   */
  INTELLIGENT_TIERING = 'INTELLIGENT_TIERING',

  /**
   * 'GLACIER'
   */
  GLACIER = 'GLACIER',

  /**
   * 'DEEP_ARCHIVE'
   */
  DEEP_ARCHIVE = 'DEEP_ARCHIVE'
}

/**
 * Used for HTTP expires header, which influences downstream caches. Does NOT influence deletion of the object.
 * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#SysMetadata
 *
 * @deprecated use core.Expiration
 */
export class Expires {
  /**
   * Expire at the specified date
   * @param d date to expire at
   */
  public static atDate(d: Date) { return new Expires(d.toUTCString()); }

  /**
   * Expire at the specified timestamp
   * @param t timestamp in unix milliseconds
   */
  public static atTimestamp(t: number) { return Expires.atDate(new Date(t)); }

  /**
   * Expire once the specified duration has passed since deployment time
   * @param t the duration to wait before expiring
   */
  public static after(t: cdk.Duration) { return Expires.atDate(new Date(Date.now() + t.toMilliseconds())); }

  /**
   * Create an expiration date from a raw date string.
   */
  public static fromString(s: string) { return new Expires(s); }

  private constructor(
    /**
     * The raw expiration date expression.
     */
    public readonly value: any,
  ) { }
}

/**
 * Custom user defined metadata.
 *
 * @deprecated Use raw property bags instead (object literals, `Map<String,Object>`, etc... )
 */
export interface UserDefinedObjectMetadata {
  /**
   * Arbitrary metadata key-values
   * The `x-amz-meta-` prefix will automatically be added to keys.
   *
   * @see https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingMetadata.html#UserMetadata
   *
   * This index signature is not usable in non-TypeScript/JavaScript languages.
   *
   * @jsii ignore
   */
  readonly [key: string]: string;
}

function sourceConfigEqual(stack: cdk.Stack, a: SourceConfig, b: SourceConfig) {
  return (
    JSON.stringify(stack.resolve(a.bucket.bucketName)) === JSON.stringify(stack.resolve(b.bucket.bucketName))
    && a.zipObjectKey === b.zipObjectKey
    && a.markers === undefined && b.markers === undefined);
}