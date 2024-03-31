import { IRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { IPipe } from './pipe';
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
  readonly activeMqBrokerParameters?: CfnPipe.PipeSourceActiveMQBrokerParametersProperty;
  /**
   * DynamoDB stream configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-dynamodb.html
   *
   * @default - none
   */
  readonly dynamoDbStreamParameters?: CfnPipe.PipeSourceDynamoDBStreamParametersProperty;

  /**
   * Kinesis stream configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-kinesis.html
   *
   * @default - none
   */
  readonly kinesisStreamParameters?: CfnPipe.PipeSourceKinesisStreamParametersProperty;

  /**
   * Managed streaming Kafka configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-msk.html
   *
   * @default - none
   */
  readonly managedStreamingKafkaParameters?: CfnPipe.PipeSourceManagedStreamingKafkaParametersProperty;

  /**
   * RabbitMQ broker configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-mq.html
   *
   * @default - none
   */
  readonly rabbitMqBrokerParameters?: CfnPipe.PipeSourceRabbitMQBrokerParametersProperty;

  /**
   * Self-managed Kafka configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-kafka.html
   *
   * @default - none
   */
  readonly selfManagedKafkaParameters?: CfnPipe.PipeSourceSelfManagedKafkaParametersProperty;
  /**
   * SQS queue configuration parameters.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-pipes-sqs.html
   *
   * @default - none
   */
  readonly sqsQueueParameters?: CfnPipe.PipeSourceSqsQueueParametersProperty;
}

/**
 * Source properties.
 */
export interface SourceConfig {
  /**
   * The parameters required to set up a source for your pipe.
   *
   * @default - none
   */
  readonly sourceParameters?: SourceParameters;
}

/**
 * Source interface
 */
export interface ISource {
  /**
   * The ARN of the source resource.
   */
  readonly sourceArn: string;

  /**
   * Bind the source to a pipe.
   */
  bind(pipe: IPipe): SourceConfig;

  /**
   * Grant the pipe role read access to the source.
   */
  grantRead(grantee: IRole): void;

  /**
   * Grant the pipe role write access to the dead-letter target.
   */
  grantDlqPush?(grantee: IRole): void;
}

/**
 * Source interface with dead-letter target
 */
interface ISourceWithDlq extends ISource {
  grantDlqPush(grantee: IRole): void;
}

export abstract class SourceWithDlq implements ISourceWithDlq {
  readonly sourceArn: string;
  readonly deadLetterTargetArn?: string;

  constructor(sourceArn: string, deadLetterTargetArn?: string) {
    this.sourceArn = sourceArn;
    this.deadLetterTargetArn = deadLetterTargetArn;
  }

  abstract grantDlqPush(grantee: IRole): void;
  abstract bind(pipe: IPipe): SourceConfig;
  abstract grantRead(grantee: IRole): void;
}
