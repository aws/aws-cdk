import { IRole } from 'aws-cdk-lib/aws-iam';
import { CfnPipe } from 'aws-cdk-lib/aws-pipes';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { IQueue, Queue } from 'aws-cdk-lib/aws-sqs';
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
}

/**
 * Sources that support a dead-letter target
 */
export abstract class SourceWithDlq implements ISource {
  /**
   * The ARN of the source resource.
   */
  readonly sourceArn: string;
  /**
   * The dead-letter SQS queue or SNS topic.
   */
  readonly deadLetterTarget?: IQueue | ITopic;

  constructor(sourceArn: string, deadLetterTarget?: IQueue | ITopic) {
    this.sourceArn = sourceArn;
    this.deadLetterTarget = deadLetterTarget;
  }

  abstract bind(pipe: IPipe): SourceConfig;
  abstract grantRead(grantee: IRole): void;

  /**
   * Grants the pipe role permission to publish to the dead-letter target.
   */
  public grantDlqPush(grantee: IRole, deadLetterTarget?: IQueue | ITopic) {
    if (deadLetterTarget instanceof Queue) {
      deadLetterTarget.grantSendMessages(grantee);
    } else if (deadLetterTarget instanceof Topic) {
      deadLetterTarget.grantPublish(grantee);
    }
  }

  protected getDeadLetterTargetArn(dlq?: IQueue | ITopic): string | undefined {
    if (dlq instanceof Queue) {
      return dlq.queueArn;
    } else if (dlq instanceof Topic) {
      return dlq.topicArn;
    }
    return undefined;
  }
}
