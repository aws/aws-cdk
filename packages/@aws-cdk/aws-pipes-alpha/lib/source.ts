import { Duration } from 'aws-cdk-lib';
import { IRole } from 'aws-cdk-lib/aws-iam';
/**
 * Source properties.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-event-source.html
 */
export interface SourceParameters {
  /**
   * ActiveMQBroker configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-mq.html
   *
   * @default - none
   */
  readonly activeMqBrokerParameters?: PipeSourceActiveMQBrokerParametersProperty;
  /**
   * DynamoDB stream configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-dynamodb.html
   *
   * @default - none
   */
  readonly dynamoDbStreamParameters?: PipeSourceDynamoDBStreamParametersProperty;

  /**
   * Kinesis stream configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-kinesis.html
   *
   * @default - none
   */
  readonly kinesisStreamParameters?: PipeSourceKinesisStreamParametersProperty;

  /**
   * Managed streaming Kafka configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-msk.html
   *
   * @default - none
   */
  readonly managedStreamingKafkaParameters?: PipeSourceManagedStreamingKafkaParametersProperty;

  /**
   * RabbitMQ broker configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-mq.html
   *
   * @default - none
   */
  readonly rabbitMqBrokerParameters?: PipeSourceRabbitMQBrokerParametersProperty;

  /**
   * Self-managed Kafka configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-kafka.html
   *
   * @default - none
   */
  readonly selfManagedKafkaParameters?: PipeSourceSelfManagedKafkaParametersProperty;
  /**
   * SQS queue configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-sqs.html
   *
   * @default - none
   */
  readonly sqsQueueParameters?: PipeSourceSqsQueueParametersProperty;
}

// /**
//  * Shared parameters that are available on all sources.
//  */
// interface IPipeSourceCommonParameters {
//   /**
//     * The maximum number of records to include in each batch.
//     *
//     * @default - 1
//     */
//   readonly batchSize?: Duration;

//   /**
//      * The maximum length of a time to wait for events.
//      * Must be between 0 and 300 seconds.
//      * TODO: check what is the default
//      * @default - 300
//      */
//   readonly maximumBatchingWindow?: Duration;
// }

/**
 * Source interface
 */
export interface ISource {
  /**
   * The ARN of the source resource.
   */
  sourceArn: string;

  /**
   * The parameters required to set up a source for your pipe.
   */
  sourceParameters?: SourceParameters;

  /**
   * Grant the pipe role read access to the source.
   */
  grantRead(grantee: IRole): void;
}

/**
 * The parameters for using an Active MQ broker as a source.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html
 */
export interface PipeSourceActiveMQBrokerParametersProperty {
  /**
   * The maximum number of records to include in each batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-batchsize
   *
   * @default - 1
   */
  readonly batchSize?: number;

  /**
   * The credentials needed to access the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-credentials
   */
  readonly credentials: MQBrokerAccessCredentialsProperty;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-maximumbatchingwindowinseconds
   *
   * @default - none
   */
  readonly maximumBatchingWindow?: Duration;

  /**
   * The name of the destination queue to consume.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceactivemqbrokerparameters.html#cfn-pipes-pipe-pipesourceactivemqbrokerparameters-queuename
   */
  readonly queueName: string;
}

/**
 * The parameters for using a DynamoDB stream as a source.
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html
 */
export interface PipeSourceDynamoDBStreamParametersProperty {
  /**
   * The maximum number of records to include in each batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-batchsize
   *
   * @default - 1
   */
  readonly batchSize?: number;

  /**
   * Define the target queue to send dead-letter queue events to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-deadletterconfig
   *
   * @default - none
   */
  readonly deadLetterConfig?: DeadLetterConfigProperty;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumbatchingwindowinseconds
   *
   * @default - none
   */
  readonly maximumBatchingWindow?: Duration;

  /**
   * (Streams only) Discard records older than the specified age.
   *
   * The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumrecordageinseconds
   *
   * @default - -1 (infinite)
   */
  readonly maximumRecordAge?: Duration;

  /**
   * (Streams only) Discard records after the specified number of retries.
   *
   * The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumretryattempts
   *
   * @default - -1 (infinite)
   */
  readonly maximumRetryAttempts?: number;

  /**
   * (Streams only) Define how to handle item process failures.
   *
   * `AUTOMATIC_BISECT` halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-onpartialbatchitemfailure
   *
   * @default - none
   */
  readonly onPartialBatchItemFailure?: PartialBatchItemFailure;

  /**
   * (Streams only) The number of batches to process concurrently from each shard.
   *
   * The default value is 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-parallelizationfactor
   *
   * @default - 1
   */
  readonly parallelizationFactor?: number;

  /**
   * (Streams only) The position in a stream from which to start reading.
   *
   * *Valid values* : `TRIM_HORIZON | LATEST`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-startingposition
   */
  readonly startingPosition: DynamoDBStartingPosition;
}

/**
 * Define how to handle item process failures.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-dynamodb.html#pipes-ddb-batch-failures
 */
export enum PartialBatchItemFailure {
  /**
   * AUTOMATIC_BISECT halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
   */
  AUTOMATIC_BISECT = 'AUTOMATIC_BISECT'
}

/**
 * The position in a DynamoDB stream from which to start reading.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-dynamodb.html#pipes-ddb-stream-start-position
 */
export enum DynamoDBStartingPosition {
  /**
   * Starts reading at the last untrimmed record in the shard in the system, which is the oldest data record in the shard.
   */
  TRIM_HORIZON = 'TRIM_HORIZON',

  /**
   * Starts reading just after the most recent stream record in the shard, so that you always read the most recent data in the stream.
   */
  LATEST = 'LATEST'
}

/**
 * A `DeadLetterConfig` object that contains information about a dead-letter queue configuration.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-deadletterconfig.html
 */
export interface DeadLetterConfigProperty {
  /**
   * The ARN of the specified target for the dead-letter queue.
   *
   * For Amazon Kinesis stream and Amazon DynamoDB stream sources, specify either an Amazon SNS topic or Amazon SQS queue ARN.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-deadletterconfig.html#cfn-pipes-pipe-deadletterconfig-arn
   *
   * @default - none
   */
  readonly arn?: string;
}

/**
 * The parameters for using a Kinesis stream as a source.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-kinesis.html
 */
export interface PipeSourceKinesisStreamParametersProperty {
  /**
   * The maximum number of records to include in each batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-batchsize
   *
   * @default - 1
   */
  readonly batchSize?: number;

  /**
   * Define the target queue to send dead-letter queue events to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-deadletterconfig
   *
   * @default - none
   */
  readonly deadLetterConfig?: DeadLetterConfigProperty;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumbatchingwindowinseconds
   *
   * @default - none
   */
  readonly maximumBatchingWindow?: Duration;

  /**
   * (Streams only) Discard records older than the specified age.
   *
   * The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumrecordageinseconds
   *
   * @default - -1 (infinite)
   */
  readonly maximumRecordAge?: Duration;

  /**
   * (Streams only) Discard records after the specified number of retries.
   *
   * The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumretryattempts
   *
   * @default - -1 (infinite)
   */
  readonly maximumRetryAttempts?: number;

  /**
   * (Streams only) Define how to handle item process failures.
   *
   * `AUTOMATIC_BISECT` halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-onpartialbatchitemfailure
   *
   * @default - none
   */
  readonly onPartialBatchItemFailure?: PartialBatchItemFailure;

  /**
   * (Streams only) The number of batches to process concurrently from each shard.
   *
   * The default value is 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-parallelizationfactor
   *
   * @default - 1
   */
  readonly parallelizationFactor?: number;

  /**
   * (Streams only) The position in a stream from which to start reading.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingposition
   */
  readonly startingPosition: KinesisStartingPosition;

  /**
   * With `StartingPosition` set to `AT_TIMESTAMP` , the time from which to start reading, in Unix time seconds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingpositiontimestamp
   *
   * @default - required if `startingPosition` is `AT_TIMESTAMP`
   */
  readonly startingPositionTimestamp?: string;
}

/**
 * The position in a stream from which to start reading.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-dynamodb.html#pipes-ddb-stream-start-position
 */
export enum KinesisStartingPosition {
  /**
   * Starts reading at the last untrimmed record in the shard in the system, which is the oldest data record in the shard.
   */
  TRIM_HORIZON = 'TRIM_HORIZON',

  /**
   * Starts reading just after the most recent stream record in the shard, so that you always read the most recent data in the stream.
   */
  LATEST = 'LATEST',

  /**
   * Starts reading just at or after the specified timestamp.
   */
  AT_TIMESTAMP = 'AT_TIMESTAMP'
}

/**
 * The parameters for using an MSK stream as a source.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-msk.html
 */
export interface PipeSourceManagedStreamingKafkaParametersProperty {
  /**
   * The maximum number of records to include in each batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-batchsize
   *
   * @default - 1
   */
  readonly batchSize?: number;

  /**
   * The name of the destination queue to consume.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-consumergroupid
   *
   * @default - randomly generated UUID
   */
  readonly consumerGroupId?: string;

  /**
   * The credentials needed to access the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-credentials
   *
   * @default - none
   */
  readonly credentials?: MSKAccessCredentialsProperty;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-maximumbatchingwindowinseconds
   *
   * @default - none
   */
  readonly maximumBatchingWindow?: Duration;

  /**
   * (Streams only) The position in a stream from which to start reading.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-startingposition
   *
   * @default - none
   */
  readonly startingPosition?: KafkaStartingPosition;

  /**
   * The name of the topic that the pipe will read from.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcemanagedstreamingkafkaparameters.html#cfn-pipes-pipe-pipesourcemanagedstreamingkafkaparameters-topicname
   */
  readonly topicName: string;
}

/**
 * The AWS Secrets Manager secret that stores your stream credentials.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mskaccesscredentials.html
 */
export interface MSKAccessCredentialsProperty {
  /**
   * The ARN of the Secrets Manager secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mskaccesscredentials.html#cfn-pipes-pipe-mskaccesscredentials-clientcertificatetlsauth
   *
   * @default - none
   */
  readonly clientCertificateTlsAuth?: string;

  /**
   * The ARN of the Secrets Manager secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mskaccesscredentials.html#cfn-pipes-pipe-mskaccesscredentials-saslscram512auth
   *
   * @default - none
   */
  readonly saslScram512Auth?: string;
}

/**
 * The position in a stream from which to start reading.
 */
export enum KafkaStartingPosition {
  /**
   * Starts reading at the last untrimmed record in the shard in the system, which is the oldest data record in the shard.
   */
  TRIM_HORIZON = 'TRIM_HORIZON',

  /**
   * Starts reading just after the most recent stream record in the shard, so that you always read the most recent data in the stream.
   */
  LATEST = 'LATEST'
}

/**
 * The parameters for using a Rabbit MQ broker as a source.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-mq.html
 */
export interface PipeSourceRabbitMQBrokerParametersProperty {
  /**
   * The maximum number of records to include in each batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-batchsize
   *
   * @default - 1
   */
  readonly batchSize?: number;

  /**
   * The credentials needed to access the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-credentials
   */
  readonly credentials: MQBrokerAccessCredentialsProperty;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-maximumbatchingwindowinseconds
   *
   * @default - none
   */
  readonly maximumBatchingWindow?: Duration;

  /**
   * The name of the destination queue to consume.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-queuename
   */
  readonly queueName: string;

  /**
   * The name of the virtual host associated with the source broker.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcerabbitmqbrokerparameters.html#cfn-pipes-pipe-pipesourcerabbitmqbrokerparameters-virtualhost
   *
   * @default - none
   */
  readonly virtualHost?: string;
}

/**
 * The AWS Secrets Manager secret that stores your broker credentials.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mqbrokeraccesscredentials.html
 */
export interface MQBrokerAccessCredentialsProperty {
  /**
   * The ARN of the Secrets Manager secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-mqbrokeraccesscredentials.html#cfn-pipes-pipe-mqbrokeraccesscredentials-basicauth
   */
  readonly basicAuth: string;
}

/**
 * The parameters for using a self-managed apache Kafka stream as a source.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-kafka.html
 */
export interface PipeSourceSelfManagedKafkaParametersProperty {
  /**
   * An array of server URLs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-additionalbootstrapservers
   *
   * @default - none
   */
  readonly additionalBootstrapServers?: Array<string>;

  /**
   * The maximum number of records to include in each batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-batchsize
   *
   * @default - 1
   */
  readonly batchSize?: number;

  /**
   * The name of the destination queue to consume.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-consumergroupid
   *
   * @default - randomly generated UUID
   */
  readonly consumerGroupId?: string;

  /**
   * The credentials needed to access the resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-credentials
   *
   * @default - none
   */
  readonly credentials?: SelfManagedKafkaAccessConfigurationCredentialsProperty;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-maximumbatchingwindowinseconds
   *
   * @default - none
   */
  readonly maximumBatchingWindow?: Duration;

  /**
   * The ARN of the Secrets Manager secret used for certification.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-serverrootcacertificate
   *
   * @default - none
   */
  readonly serverRootCaCertificate?: string;

  /**
   * (Streams only) The position in a stream from which to start reading.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-startingposition
   *
   * @default - none
   */
  readonly startingPosition?: KafkaStartingPosition;

  /**
   * The name of the topic that the pipe will read from.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-topicname
   */
  readonly topicName: string;

  /**
   * This structure specifies the VPC subnets and security groups for the stream, and whether a public IP address is to be used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourceselfmanagedkafkaparameters.html#cfn-pipes-pipe-pipesourceselfmanagedkafkaparameters-vpc
   *
   * @default - none
   */
  readonly vpc?: SelfManagedKafkaAccessConfigurationVpcProperty;
}

/**
 * This structure specifies the VPC subnets and security groups for the stream, and whether a public IP address is to be used.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc.html
 */
export interface SelfManagedKafkaAccessConfigurationVpcProperty {
  /**
   * Specifies the security groups associated with the stream.
   *
   * These security groups must all be in the same VPC. You can specify as many as five security groups. If you do not specify a security group, the default security group for the VPC is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc-securitygroup
   *
   * @default - none
   */
  readonly securityGroup?: Array<string>;

  /**
   * Specifies the subnets associated with the stream.
   *
   * These subnets must all be in the same VPC. You can specify as many as 16 subnets.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationvpc-subnets
   *
   * @default - none
   */
  readonly subnets?: Array<string>;
}

/**
 * The AWS Secrets Manager secret that stores your stream credentials.
 *
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html
 */
export interface SelfManagedKafkaAccessConfigurationCredentialsProperty {
  /**
   * The ARN of the Secrets Manager secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-basicauth
   *
   * @default - none
   */
  readonly basicAuth?: string;

  /**
   * The ARN of the Secrets Manager secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-clientcertificatetlsauth
   *
   * @default - none
   */
  readonly clientCertificateTlsAuth?: string;

  /**
   * The ARN of the Secrets Manager secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-saslscram256auth
   *
   * @default - none
   */
  readonly saslScram256Auth?: string;

  /**
   * The ARN of the Secrets Manager secret.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials.html#cfn-pipes-pipe-selfmanagedkafkaaccessconfigurationcredentials-saslscram512auth
   *
   * @default - none
   */
  readonly saslScram512Auth?: string;
}

/**
 * The parameters for using a Amazon SQS stream as a source.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-sqs.html
 */
export interface PipeSourceSqsQueueParametersProperty {
  /**
   * The maximum number of records to include in each batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html#cfn-pipes-pipe-pipesourcesqsqueueparameters-batchsize
   *
   * @default - 1
   */
  readonly batchSize?: number;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcesqsqueueparameters.html#cfn-pipes-pipe-pipesourcesqsqueueparameters-maximumbatchingwindowinseconds
   *
   * @default - none
   */
  readonly maximumBatchingWindow?: Duration;
}
