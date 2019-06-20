import ec2 = require('@aws-cdk/aws-ec2');
import kms = require('@aws-cdk/aws-kms');
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
    readonly trainingImage?: string;

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
    readonly s3Uri: string;
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
  readonly s3OutputPath: string;
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
    readonly volumeKmsKeyId?: kms.IKey;

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
