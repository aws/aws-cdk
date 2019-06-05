import ec2 = require('@aws-cdk/aws-ec2');
import kms = require('@aws-cdk/aws-kms');

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
     */
    readonly trainingInputMode: InputMode.File | InputMode.Pipe;
}

export interface Channel {

    /**
     * Name of the channel
     */
    readonly channelName: string;

    /**
     * Compression type if training data is compressed
     */
    readonly compressionType?: CompressionType.None | CompressionType.Gzip;

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
    readonly inputMode?: InputMode.File | InputMode.Pipe;

    /**
     * Record wrapper type
     */
    readonly recordWrapperType?: RecordWrapperType.None | RecordWrapperType.RecordIO;

    /**
     * Shuffle config option for input data in a channel.
     */
    readonly shuffleConfig?: ShuffleConfig;
}

export interface ShuffleConfig {
    /**
     * Determines the shuffling order.
     */
    readonly seed: number;
}

export interface DataSource {
    /**
     * S3 location of the data source that is associated with a channel.
     */
    readonly s3DataSource: S3DataSource;
}

export interface S3DataSource {
    /**
     * List of one or more attribute names to use that are found in a specified augmented manifest file.
     */
    readonly attributeNames?: string[];

    /**
     * S3 Data Distribution Type
     */
    readonly s3DataDistributionType?: S3DataDistributionType.FullyReplicated | S3DataDistributionType.ShardedByS3Key;

    /**
     * S3 Data Type
     */
    readonly s3DataType: S3DataType;

    /**
     * S3 Uri
     */
    readonly s3Uri: string;
}

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
    readonly maxRuntimeInSeconds?: number;
}

export interface Tag {
    /**
     * Key tag.
     */
    readonly key: string;

    /**
     * Value tag.
     */
    readonly value: string;
}

export interface ResourceConfig {

    /**
     * The number of ML compute instances to use.
     */
    readonly instanceCount: number;

    /**
     * ML compute instance type.
     */
    readonly instanceType: ec2.InstanceType;

    /**
     * KMS key that Amazon SageMaker uses to encrypt data on the storage volume attached to the ML compute instance(s) that run the training job.
     */
    readonly volumeKmsKeyId?: kms.IKey;

    /**
     * Size of the ML storage volume that you want to provision.
     */
    readonly volumeSizeInGB: number;
}

export interface VpcConfig {
    /**
     * VPC security groups.
     */
    readonly securityGroups: ec2.ISecurityGroup[];

    /**
     * VPC subnets.
     */
    readonly subnetSelection: ec2.SubnetSelection;
}

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

export enum S3DataType {
    /**
     * Manifest File Data Type
     */
    ManifestFile = 'ManifestFile',

    /**
     * S3 Prefix Data Type
     */
    S3Prefix = 'S3Prefix',

    /**
     * Augmented Manifest File Data Type
     */
    AugmentedManifestFile = 'AugmentedManifestFile'
}

export enum S3DataDistributionType {
    /**
     * Fully replicated S3 Data Distribution Type
     */
    FullyReplicated = 'FullyReplicated',

    /**
     * Sharded By S3 Key Data Distribution Type
     */
    ShardedByS3Key = 'ShardedByS3Key'
}

export enum RecordWrapperType {
    /**
     * None record wrapper type
     */
    None = 'None',

    /**
     * RecordIO record wrapper type
     */
    RecordIO = 'RecordIO'
}

export enum InputMode {
    /**
     * Pipe mode
     */
    Pipe = 'Pipe',

    /**
     * File mode.
     */
    File = 'File'
}

export enum CompressionType {
    /**
     * None compression type
     */
    None = 'None',

    /**
     * Gzip compression type
     */
    Gzip = 'Gzip'
}
