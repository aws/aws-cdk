import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import { DockerImageAsset, DockerImageAssetProps } from '@aws-cdk/aws-ecr-assets';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as s3 from '@aws-cdk/aws-s3';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Construct, Duration } from '@aws-cdk/core';

/**
 * Task to train a machine learning model using Amazon SageMaker
 * @experimental
 */
export interface ISageMakerTask extends sfn.IStepFunctionsTask, iam.IGrantable {}

/**
 * Specify the training algorithm and algorithm-specific metadata
 * @experimental
 */
export interface AlgorithmSpecification {

  /**
   * Name of the algorithm resource to use for the training job.
   * This must be an algorithm resource that you created or subscribe to on AWS Marketplace.
   * If you specify a value for this parameter, you can't specify a value for TrainingImage.
   *
   * @default - No algorithm is specified
   */
  readonly algorithmName?: string;

  /**
   * List of metric definition objects. Each object specifies the metric name and regular expressions used to parse algorithm logs.
   *
   * @default - No metrics
   */
  readonly metricDefinitions?: MetricDefinition[];

  /**
   * Registry path of the Docker image that contains the training algorithm.
   *
   * @default - No Docker image is specified
   */
  readonly trainingImage?: DockerImage;

  /**
   * Input mode that the algorithm supports.
   *
   * @default 'File' mode
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
   *
   * @default - None
   */
  readonly compressionType?: CompressionType;

  /**
   * The MIME type of the data.
   *
   * @default - None
   */
  readonly contentType?: string;

  /**
   * Location of the channel data.
   */
  readonly dataSource: DataSource;

  /**
   * Input mode to use for the data channel in a training job.
   *
   * @default - None
   */
  readonly inputMode?: InputMode;

  /**
   * Specify RecordIO as the value when input data is in raw format but the training algorithm requires the RecordIO format.
   * In this case, Amazon SageMaker wraps each individual S3 object in a RecordIO record.
   * If the input data is already in RecordIO format, you don't need to set this attribute.
   *
   * @default - None
   */
  readonly recordWrapperType?: RecordWrapperType;

  /**
   * Shuffle config option for input data in a channel.
   *
   * @default - None
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
 * @see https://docs.aws.amazon.com/sagemaker/latest/APIReference/API_S3DataSource.html
 *
 * @experimental
 */
export interface S3DataSource {
  /**
   * List of one or more attribute names to use that are found in a specified augmented manifest file.
   *
   * @default - No attribute names
   */
  readonly attributeNames?: string[];

  /**
   * S3 Data Distribution Type
   *
   * @default - None
   */
  readonly s3DataDistributionType?: S3DataDistributionType;

  /**
   * S3 Data Type
   *
   * @default S3_PREFIX
   */
  readonly s3DataType?: S3DataType;

  /**
   * S3 Uri
   */
  readonly s3Location: S3Location;
}

/**
 * Configures the S3 bucket where SageMaker will save the result of model training
 * @experimental
 */
export interface OutputDataConfig {
  /**
   * Optional KMS encryption key that Amazon SageMaker uses to encrypt the model artifacts at rest using Amazon S3 server-side encryption.
   *
   * @default - Amazon SageMaker uses the default KMS key for Amazon S3 for your role's account
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Identifies the S3 path where you want Amazon SageMaker to store the model artifacts.
   */
  readonly s3OutputLocation: S3Location;
}

/**
 * Specifies a limit to how long a model training job can run.
 * When the job reaches the time limit, Amazon SageMaker ends the training job.
 *
 * @experimental
 */
export interface StoppingCondition {
  /**
   * The maximum length of time, in seconds, that the training or compilation job can run.
   *
   * @default - 1 hour
   */
  readonly maxRuntime?: Duration;
}

/**
 * Specifies the resources, ML compute instances, and ML storage volumes to deploy for model training.
 *
 * @experimental
 */
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
   *
   * @default - Amazon SageMaker uses the default KMS key for Amazon S3 for your role's account
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
 * Specifies the VPC that you want your Amazon SageMaker training job to connect to.
 *
 * @experimental
 */
export interface VpcConfig {
  /**
   * VPC
   */
  readonly vpc: ec2.IVpc;

  /**
   * VPC subnets.
   *
   * @default - Private Subnets are selected
   */
  readonly subnets?: ec2.SubnetSelection;
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
 * Stores information about the location of an object in Amazon S3
 *
 * @experimental
 */
export interface S3LocationConfig {

  /**
   * Uniquely identifies the resource in Amazon S3
   */
  readonly uri: string;
}

/**
 * Constructs `IS3Location` objects.
 *
 * @experimental
 */
export abstract class S3Location {
  /**
   * An `IS3Location` built with a determined bucket and key prefix.
   *
   * @param bucket    is the bucket where the objects are to be stored.
   * @param keyPrefix is the key prefix used by the location.
   */
  public static fromBucket(bucket: s3.IBucket, keyPrefix: string): S3Location {
    return new StandardS3Location({ bucket, keyPrefix, uri: bucket.urlForObject(keyPrefix) });
  }

  /**
   * An `IS3Location` determined fully by a JSON Path from the task input.
   *
   * Due to the dynamic nature of those locations, the IAM grants that will be set by `grantRead` and `grantWrite`
   * apply to the `*` resource.
   *
   * @param expression the JSON expression resolving to an S3 location URI.
   */
  public static fromJsonExpression(expression: string): S3Location {
    return new StandardS3Location({ uri: sfn.Data.stringAt(expression) });
  }

  /**
   * Called when the S3Location is bound to a StepFunctions task.
   */
  public abstract bind(task: ISageMakerTask, opts: S3LocationBindOptions): S3LocationConfig;
}

/**
 * Options for binding an S3 Location.
 *
 * @experimental
 */
export interface S3LocationBindOptions {
  /**
   * Allow reading from the S3 Location.
   *
   * @default false
   */
  readonly forReading?: boolean;

  /**
   * Allow writing to the S3 Location.
   *
   * @default false
   */
  readonly forWriting?: boolean;
}

/**
 * Configuration for a using Docker image.
 *
 * @experimental
 */
export interface DockerImageConfig {
  /**
   * The fully qualified URI of the Docker image.
   */
  readonly imageUri: string;
}

/**
 * Creates `IDockerImage` instances.
 *
 * @experimental
 */
export abstract class DockerImage {
  /**
   * Reference a Docker image stored in an ECR repository.
   *
   * @param repository the ECR repository where the image is hosted.
   * @param tag an optional `tag`
   */
  public static fromEcrRepository(repository: ecr.IRepository, tag: string = 'latest'): DockerImage {
    return new StandardDockerImage({ repository, imageUri: repository.repositoryUriForTag(tag) });
  }

  /**
   * Reference a Docker image which URI is obtained from the task's input.
   *
   * @param expression           the JSON path expression with the task input.
   * @param allowAnyEcrImagePull whether ECR access should be permitted (set to `false` if the image will never be in ECR).
   */
  public static fromJsonExpression(expression: string, allowAnyEcrImagePull = true): DockerImage {
    return new StandardDockerImage({ imageUri: expression, allowAnyEcrImagePull });
  }

  /**
   * Reference a Docker image by it's URI.
   *
   * When referencing ECR images, prefer using `inEcr`.
   *
   * @param imageUri the URI to the docker image.
   */
  public static fromRegistry(imageUri: string): DockerImage {
    return new StandardDockerImage({ imageUri });
  }

  /**
   * Reference a Docker image that is provided as an Asset in the current app.
   *
   * @param scope the scope in which to create the Asset.
   * @param id    the ID for the asset in the construct tree.
   * @param props the configuration props of the asset.
   */
  public static fromAsset(scope: Construct, id: string, props: DockerImageAssetProps): DockerImage {
    const asset = new DockerImageAsset(scope, id, props);
    return new StandardDockerImage({ repository: asset.repository, imageUri: asset.imageUri });
  }

  /**
   * Called when the image is used by a SageMaker task.
   */
  public abstract bind(task: ISageMakerTask): DockerImageConfig;
}

/**
 * S3 Data Type.
 *
 * @experimental
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
 *
 * @experimental
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
 *
 * @experimental
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
 *
 * @experimental
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
 *
 * @experimental
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
   *
   * @default NONE
   */
  readonly compressionType?: CompressionType;

  /**
   * Multipurpose internet mail extension (MIME) type of the data.
   *
   * @default - None
   */
  readonly contentType?: string;

  /**
   * S3 location of the channel data
   */
  readonly transformDataSource: TransformDataSource;

  /**
   * Method to use to split the transform job's data files into smaller batches.
   *
   * @default NONE
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
   *
   * @default - None
   */
  readonly accept?: string;

  /**
   * Defines how to assemble the results of the transform job as a single S3 object.
   *
   * @default - None
   */
  readonly assembleWith?: AssembleWith;

  /**
   * AWS KMS key that Amazon SageMaker uses to encrypt the model artifacts at rest using Amazon S3 server-side encryption.
   *
   * @default - default KMS key for Amazon S3 for your role's account.
   */
  readonly encryptionKey?: kms.IKey;

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
   * Number of ML compute instances to use in the transform job
   */
  readonly instanceCount: number;

  /**
   * ML compute instance type for the transform job.
   */
  readonly instanceType: ec2.InstanceType;

  /**
   * AWS KMS key that Amazon SageMaker uses to encrypt data on the storage volume attached to the ML compute instance(s).
   *
   * @default - None
   */
  readonly volumeKmsKeyId?: kms.Key;
}

/**
 * Specifies the number of records to include in a mini-batch for an HTTP inference request.
 *
 * @experimental
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
 *
 * @experimental
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
 *
 * @experimental
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

class StandardDockerImage extends DockerImage {
  private readonly allowAnyEcrImagePull: boolean;
  private readonly imageUri: string;
  private readonly repository?: ecr.IRepository;

  constructor(opts: { allowAnyEcrImagePull?: boolean, imageUri: string, repository?: ecr.IRepository }) {
    super();

    this.allowAnyEcrImagePull = !!opts.allowAnyEcrImagePull;
    this.imageUri = opts.imageUri;
    this.repository = opts.repository;
  }

  public bind(task: ISageMakerTask): DockerImageConfig {
    if (this.repository) {
      this.repository.grantPull(task);
    }
    if (this.allowAnyEcrImagePull) {
      task.grantPrincipal.addToPolicy(new iam.PolicyStatement({
        actions: [
          'ecr:BatchCheckLayerAvailability',
          'ecr:GetDownloadUrlForLayer',
          'ecr:BatchGetImage',
        ],
        resources: ['*'],
      }));
    }
    return {
      imageUri: this.imageUri,
    };
  }
}

class StandardS3Location extends S3Location {
  private readonly bucket?: s3.IBucket;
  private readonly keyGlob: string;
  private readonly uri: string;

  constructor(opts: { bucket?: s3.IBucket, keyPrefix?: string, uri: string }) {
    super();
    this.bucket = opts.bucket;
    this.keyGlob = `${opts.keyPrefix || ''}*`;
    this.uri = opts.uri;
  }

  public bind(task: ISageMakerTask, opts: S3LocationBindOptions): S3LocationConfig {
    if (this.bucket) {
      if (opts.forReading) {
        this.bucket.grantRead(task, this.keyGlob);
      }
      if (opts.forWriting) {
        this.bucket.grantWrite(task, this.keyGlob);
      }
    } else {
      const actions = new Array<string>();
      if (opts.forReading) {
        actions.push('s3:GetObject', 's3:ListBucket');
      }
      if (opts.forWriting) {
        actions.push('s3:PutObject');
      }
      task.grantPrincipal.addToPolicy(new iam.PolicyStatement({ actions, resources: ['*'] }));
    }
    return { uri: this.uri };
  }
}
