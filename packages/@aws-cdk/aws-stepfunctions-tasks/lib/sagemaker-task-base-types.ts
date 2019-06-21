import ec2 = require('@aws-cdk/aws-ec2');
import ecr = require('@aws-cdk/aws-ecr');
import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import s3 = require('@aws-cdk/aws-s3');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { Duration } from '@aws-cdk/cdk';

//
// Create Training Job types
//

/**
 * @experimental
 */
export interface AlgorithmSpecification {

    /**
     * Name of the algorithm resource to use for the training job.
     */
    readonly algorithmName?: string;

    /**
     * List of metric definition objects. Each object specifies the metric name and regular expressions used to parse algorithm logs.
     */
    readonly metricDefinitions?: MetricDefinition[];

    /**
     * Registry path of the Docker image that contains the training algorithm.
     */
    readonly trainingImage?: IDockerImage;

    /**
     * Input mode that the algorithm supports.
     *
     * @default is 'File' mode
     */
    readonly trainingInputMode?: InputMode;
}

/**
 *  Describes the training, validation or test dataset and the Amazon S3 location where it is stored.
 *
 * @experimental
 */
export interface Channel {

    /**
     * Name of the channel
     */
    readonly channelName: string;

    /**
     * Compression type if training data is compressed
     */
    readonly compressionType?: CompressionType;

    /**
     * Content type
     */
    readonly contentType?: string;

    /**
     * Location of the data channel
     */
    readonly dataSource: DataSource;

    /**
     * Input mode to use for the data channel in a training job.
     */
    readonly inputMode?: InputMode;

    /**
     * Record wrapper type
     */
    readonly recordWrapperType?: RecordWrapperType;

    /**
     * Shuffle config option for input data in a channel.
     */
    readonly shuffleConfig?: ShuffleConfig;
}

/**
 * Configuration for a shuffle option for input data in a channel.
 *
 * @experimental
 */
export interface ShuffleConfig {
    /**
     * Determines the shuffling order.
     */
    readonly seed: number;
}

/**
 * Location of the channel data.
 *
 * @experimental
 */
export interface DataSource {
    /**
     * S3 location of the data source that is associated with a channel.
     */
    readonly s3DataSource: S3DataSource;
}

/**
 * S3 location of the channel data.
 *
 * @experimental
 */
export interface S3DataSource {
    /**
     * List of one or more attribute names to use that are found in a specified augmented manifest file.
     */
    readonly attributeNames?: string[];

    /**
     * S3 Data Distribution Type
     */
    readonly s3DataDistributionType?: S3DataDistributionType;

    /**
     * S3 Data Type
     */
    readonly s3DataType?: S3DataType;

    /**
     * S3 Uri
     */
    readonly s3Location: IS3Location;
}

/**
 * @experimental
 */
export interface OutputDataConfig {
  /**
   * Optional KMS encryption key that Amazon SageMaker uses to encrypt the model artifacts at rest using Amazon S3 server-side encryption.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Identifies the S3 path where you want Amazon SageMaker to store the model artifacts.
   */
  readonly s3OutputLocation: IS3Location;
}

export interface StoppingCondition {
    /**
     * The maximum length of time, in seconds, that the training or compilation job can run.
     */
    readonly maxRuntime?: Duration;
}

export interface ResourceConfig {

    /**
     * The number of ML compute instances to use.
     *
     * @default 1 instance.
     */
    readonly instanceCount: number;

    /**
     * ML compute instance type.
     *
     * @default is the 'm4.xlarge' instance type.
     */
    readonly instanceType: ec2.InstanceType;

    /**
     * KMS key that Amazon SageMaker uses to encrypt data on the storage volume attached to the ML compute instance(s) that run the training job.
     */
    readonly volumeEncryptionKey?: kms.IKey;

    /**
     * Size of the ML storage volume that you want to provision.
     *
     * @default 10 GB EBS volume.
     */
    readonly volumeSizeInGB: number;
}

/**
 *
 * @experimental
 */
export interface VpcConfig {
    /**
     * VPC security groups.
     */
    readonly securityGroups: ec2.ISecurityGroup[];

    /**
     * VPC id
     */
    readonly vpc: ec2.Vpc;

    /**
     * VPC subnets.
     */
    readonly subnets: ec2.ISubnet[];
}

/**
 * Specifies the metric name and regular expressions used to parse algorithm logs.
 *
 * @experimental
 */
export interface MetricDefinition {

    /**
     * Name of the metric.
     */
    readonly name: string;

    /**
     * Regular expression that searches the output of a training job and gets the value of the metric.
     */
    readonly regex: string;
}

/**
 * Specifies a location in a S3 Bucket.
 *
 * @experimental
 */
export interface IS3Location {
    /** The URI of the location in S3 */
    readonly uri: string;

    /** Grants read permissions to the S3 location. */
    grantRead(grantee: iam.IGrantable): void;
    /** Grants write permissions to the S3 location. */
    grantWrite(grantee: iam.IGrantable): void;
}

/**
 * Constructs `IS3Location` objects.
 */
export class S3Location {
    /**
     * An `IS3Location` built with a determined bucket and key prefix.
     *
     * @param bucket    is the bucket where the objects are to be stored.
     * @param keyPrefix is the key prefix used by the location.
     */
    public static inBucket(bucket: s3.IBucket, keyPrefix: string): IS3Location {
        return {
            uri: bucket.urlForObject(keyPrefix),
            grantRead: (grantee) => bucket.grantRead(grantee, keyPrefix + '*'),
            grantWrite: (grantee) => bucket.grantWrite(grantee, keyPrefix + '*'),
        };
    }

    /**
     * An `IS3Location` determined fully by a JSON Path from the task input.
     *
     * Due to the dynamic nature of those locations, the IAM grants that will be set by `grantRead` and `grantWrite`
     * apply to the `*` resource.
     *
     * @param expression the JSON expression resolving to an S3 location URI.
     */
    public static fromJsonExpression(expression: string): IS3Location {
        return {
            uri: sfn.Data.stringAt(expression),
            grantRead: grantee => grantee.grantPrincipal.addToPolicy(new iam.PolicyStatement({
                actions: ['s3:GetObject', `s3:ListBucket`],
                resources: ['*']
            })),
            grantWrite: grantee => grantee.grantPrincipal.addToPolicy(new iam.PolicyStatement({
                actions: ['s3:PutObject'],
                resources: ['*']
            })),
        };
    }

    private constructor() { }
}

export interface IDockerImage {
    readonly name: string;
    grantRead(grantee: iam.IGrantable): void;
}

/**
 * Specifies options for accessing images in ECR.
 */
export interface EcrImageOptions {
    /**
     * The tag to use for this ECR Image. This option is mutually exclusive with `digest`.
     */
    readonly tag?: string;

    /**
     * The digest to use for this ECR Image. This option is mutually exclusive with `tag`.
     */
    readonly digest?: string;
}

/**
 * Creates `IDockerImage` instances.
 */
export class DockerImage {
    /**
     * Reference a Docker image stored in an ECR repository.
     *
     * @param repo the ECR repository where the image is hosted.
     * @param opts an optional `tag` or `digest` to use.
     */
    public static inEcr(repo: ecr.IRepository, opts: EcrImageOptions = {}): IDockerImage {
        if (opts.tag && opts.digest) {
            throw new Error(`The tag and digest options are mutually exclusive, but both were specified`);
        }
        const suffix = opts.tag
            ? `:${opts.tag}`
            : opts.digest
                ? `@${opts.digest}`
                : '';
        return {
            name: repo.repositoryUri + suffix,
            grantRead: repo.grantPull.bind(repo),
        };
    }

    /**
     * Reference a Docker image which URI is obtained from the task's input.
     *
     * @param expression      the JSON path expression with the task input.
     * @param enableEcrAccess whether ECR access should be permitted (set to `false` if the image will never be in ECR).
     */
    public static fromJsonExpression(expression: string, enableEcrAccess = true): IDockerImage {
        return this.fromImageUri(sfn.Data.stringAt(expression), enableEcrAccess);
    }

    /**
     * Reference a Docker image by it's URI.
     *
     * When referencing ECR images, prefer using `inEcr`.
     *
     * @param uri             the URI to the docker image.
     * @param enableEcrAccess whether ECR access should be permitted (set to `true` if the image is located in an ECR
     *                        repository).
     */
    public static fromImageUri(uri: string, enableEcrAccess = false): IDockerImage {
        return {
            name: uri,
            grantRead(grantee) {
                if (!enableEcrAccess) { return; }
                grantee.grantPrincipal.addToPolicy(new iam.PolicyStatement({
                    actions: [
                        'ecr:BatchCheckLayerAvailability',
                        'ecr:GetDownloadUrlForLayer',
                        'ecr:BatchGetImage'
                    ],
                    resources: ['*']
                }));
            },
        };
    }

    private constructor() { }
}

/**
 * S3 Data Type.
 */
export enum S3DataType {
    /**
     * Manifest File Data Type
     */
    MANIFEST_FILE = 'ManifestFile',

    /**
     * S3 Prefix Data Type
     */
    S3_PREFIX = 'S3Prefix',

    /**
     * Augmented Manifest File Data Type
     */
    AUGMENTED_MANIFEST_FILE = 'AugmentedManifestFile'
}

/**
 * S3 Data Distribution Type.
 */
export enum S3DataDistributionType {
    /**
     * Fully replicated S3 Data Distribution Type
     */
    FULLY_REPLICATED = 'FullyReplicated',

    /**
     * Sharded By S3 Key Data Distribution Type
     */
    SHARDED_BY_S3_KEY = 'ShardedByS3Key'
}

/**
 * Define the format of the input data.
 */
export enum RecordWrapperType {
    /**
     * None record wrapper type
     */
    NONE = 'None',

    /**
     * RecordIO record wrapper type
     */
    RECORD_IO = 'RecordIO'
}

/**
 *  Input mode that the algorithm supports.
 */
export enum InputMode {
    /**
     * Pipe mode
     */
    PIPE = 'Pipe',

    /**
     * File mode.
     */
    FILE = 'File'
}

/**
 * Compression type of the data.
 */
export enum CompressionType {
    /**
     * None compression type
     */
    NONE = 'None',

    /**
     * Gzip compression type
     */
    GZIP = 'Gzip'
}

//
// Create Transform Job types
//

/**
 *  Dataset to be transformed and the Amazon S3 location where it is stored.
 *
 *  @experimental
 */
export interface TransformInput {

    /**
     * The compression type of the transform data.
     */
    readonly compressionType?: CompressionType;

    /**
     * Multipurpose internet mail extension (MIME) type of the data.
     */
    readonly contentType?: string;

    /**
     * S3 location of the channel data
     */
    readonly transformDataSource: TransformDataSource;

    /**
     * Method to use to split the transform job's data files into smaller batches.
     */
    readonly splitType?: SplitType;
}

/**
 * S3 location of the input data that the model can consume.
 *
 *  @experimental
 */
export interface TransformDataSource {

    /**
     * S3 location of the input data
     */
    readonly s3DataSource: TransformS3DataSource;
}

/**
 * Location of the channel data.
 *
 *  @experimental
 */
export interface TransformS3DataSource {

    /**
     * S3 Data Type
     *
     * @default 'S3Prefix'
     */
    readonly s3DataType?: S3DataType;

    /**
     * Identifies either a key name prefix or a manifest.
     */
    readonly s3Uri: string;
}

/**
 * S3 location where you want Amazon SageMaker to save the results from the transform job.
 *
 *  @experimental
 */
export interface TransformOutput {

    /**
     * MIME type used to specify the output data.
     */
    readonly accept?: string;

    /**
     * Defines how to assemble the results of the transform job as a single S3 object.
     */
    readonly assembleWith?: AssembleWith;

    /**
     * AWS KMS key that Amazon SageMaker uses to encrypt the model artifacts at rest using Amazon S3 server-side encryption.
     */
    readonly encryptionKey?: kms.Key;

    /**
     * S3 path where you want Amazon SageMaker to store the results of the transform job.
     */
    readonly s3OutputPath: string;
}

/**
 * ML compute instances for the transform job.
 *
 *  @experimental
 */
export interface TransformResources {

    /**
     * Nmber of ML compute instances to use in the transform job
     */
    readonly instanceCount: number;

    /**
     * ML compute instance type for the transform job.
     */
    readonly instanceType: ec2.InstanceType;

    /**
     * AWS KMS key that Amazon SageMaker uses to encrypt data on the storage volume attached to the ML compute instance(s).
     */
    readonly volumeKmsKeyId?: kms.Key;
}

/**
 * Specifies the number of records to include in a mini-batch for an HTTP inference request.
 */
export enum BatchStrategy {

    /**
     * Fits multiple records in a mini-batch.
     */
    MULTI_RECORD = 'MultiRecord',

    /**
     * Use a single record when making an invocation request.
     */
    SINGLE_RECORD = 'SingleRecord'
}

/**
 * Method to use to split the transform job's data files into smaller batches.
 */
export enum SplitType {

    /**
     * Input data files are not split,
     */
    NONE = 'None',

    /**
     * Split records on a newline character boundary.
     */
    LINE = 'Line',

    /**
     * Split using MXNet RecordIO format.
     */
    RECORD_IO = 'RecordIO',

    /**
     * Split using TensorFlow TFRecord format.
     */
    TF_RECORD = 'TFRecord'
}

/**
 * How to assemble the results of the transform job as a single S3 object.
 */
export enum AssembleWith {

    /**
     * Concatenate the results in binary format.
     */
    NONE = 'None',

    /**
     * Add a newline character at the end of every transformed record.
     */
    LINE = 'Line'

}
