import { HttpIntegrationSubtype, HttpIntegrationType, HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig, IHttpRouteIntegration, IntegrationCredentials, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { IEventBus } from '@aws-cdk/aws-events';
import { IStream } from '@aws-cdk/aws-kinesis';
import { IQueue } from '@aws-cdk/aws-sqs';
import { IStateMachine } from '@aws-cdk/aws-stepfunctions';
import { Duration } from '@aws-cdk/core';

interface AwsServiceIntegrationProps {
  /**
   * The credentials to use for the integration
   *
   * @default - none; use resource-based permissions.
   */
  readonly credentials?: IntegrationCredentials;
  /**
   * The region of the integration
   * @default - undefined
   */
  region?: string;
}

/**
 * Properties for EventBridge PutEvents Integrations.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html#EventBridge-PutEvents
 */
export interface EventBridgePutEventsIntegrationProps extends AwsServiceIntegrationProps {
  /**
   * How to map the event detail.
   */
  detail: string;
  /**
   * How to map the event detail-type.
   */
  detailType: string;
  /**
   * How to map the event source.
   */
  source: string;
  /**
   * How to map the event timestamp. Expects an RFC3339 timestamp.
   *
   * @default - the timestamp of the PutEvents call is used
   */
  time?: string;
  /**
   * The event bus to receive the event.
   *
   * @default - the default event bus
   */
  eventBus?: IEventBus;
  /**
   * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns.
   *
   * @default - none
   */
  resources?: Array<string>;
  /**
   * An AWS X-Ray trade header, which is an http header (X-Amzn-Trace-Id) that contains the
   * trace-id associated with the event.
   *
   * @default - none
   */
  traceHeader?: string;
}

export class EventBridgePutEventsIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: EventBridgePutEventsIntegrationProps) {
  }
  bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      subtype: HttpIntegrationSubtype.EVENTBRIDGE_PUTEVENTS,
      credentials: this.props.credentials,
      requestParameters: {
        Detail: this.props.detail,
        DetailType: this.props.detailType,
        Source: this.props.source,
        Time: this.props.time,
        EventBus: this.props.eventBus?.eventBusArn,
        Region: this.props.region,
        Resources: this.props.resources,
        TraceHeader: this.props.traceHeader,
      },
    };
  }
}

interface SQSIntegrationProps extends AwsServiceIntegrationProps {
  /** The SQS Queue to send messages to */
  readonly queue: IQueue;
}

/**
 * Properties for the SQS-SendMessage integration.
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html#SQS-SendMessage
 */
export interface SQSSendMessageIntegrationProps extends SQSIntegrationProps {
  /** The message body */
  readonly body: string;
  /**
   * The message send delay, up to 15 minutes.
   * Messages with a positive DelaySeconds value become available for processing after the delay
   * period is finished. If you don't specify a value, the default value for the queue applies.
   *
   * @default - undefined
   */
  readonly delay?: Duration,
  /**
   * Attributes of the message.
   * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-metadata.html#sqs-message-attributes
   */
  readonly attributes?: string;
  /**
   * The token used for deduplication of sent messages.
   * This parameter applies only to FIFO (first-in-first-out) queues.
   * @default - undefined
   */
  readonly deduplicationId?: string;
  /**
   * The tag that specifies that a message belongs to a specific message group.
   * This parameter applies only to FIFO (first-in-first-out) queues.
   */
  readonly groupId?: string;
  /**
   * The message system attribute to send.
   * Currently, the only supported message system attribute is AWSTraceHeader.
   * Its type must be String and its value must be a correctly formatted AWS X-Ray trace header
   * string.
   * @default - undefined
   */
  readonly systemAttributes?: string;
}

export class SQSSendMessageIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: SQSSendMessageIntegrationProps) { }
  bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.SQS_SENDMESSAGE,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: this.props.credentials,
      requestParameters: {
        QueueUrl: this.props.queue.queueUrl,
        MessageBody: this.props.body,
        DelaySeconds: this.props.delay?.toSeconds(),
        MessageAttributes: this.props.attributes,
        MessageDeduplicationId: this.props.deduplicationId,
        MessageGroupId: this.props.groupId,
        MessageSystemAttributes: this.props.systemAttributes,
        Region: this.props.region,
      },
    };
  }
}

export enum SQSAttribute {
  ALL = 'All',
  POLICY = 'Policy',
  VISIBILITY_TIMEOUT = 'VisibilityTimeout',
  MAXIMUM_MESSAGE_SIZE = 'MaximumMessageSize',
  MESSAGE_RETENTION_PERIOD = 'MessageRetentionPeriod',
  APPROXIMATE_NUMBER_OF_MESSAGES = 'ApproximateNumberOfMessages',
  APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE = 'ApproximateNumberOfMessagesNotVisible',
  CREATED_TIMESTAMP = 'CreatedTimestamp',
  LAST_MODIFIED_TIMESTAMP = 'LastModifiedTimestamp',
  QUEUE_ARN = 'QueueArn',
  APPROXIMATE_NUMBER_OF_MESSAGES_DELAYED = 'ApproximateNumberOfMessagesDelayed',
  DELAY_SECONDS = 'DelaySeconds',
  RECEIVE_MESSAGE_WAIT_TIME_SECONDS = 'ReceiveMessageWaitTimeSeconds',
  REDRIVE_POLICY = 'RedrivePolicy',
  FIFO_QUEUE = 'FifoQueue',
  CONTENT_BASED_DEDUPLICATION = 'ContentBasedDeduplication',
  KMS_MASTER_KEY_ID = 'KmsMasterKeyId',
  KMS_DATA_KEY_REUSE_PERIOD_SECONDS = 'KmsDataKeyReusePeriodSeconds',
  DEDUPLICATION_SCOPE = 'DeduplicationScope',
  FIFO_THROUGHPUT_LIMIT = 'FifoThroughputLimit',
}

export interface SQSReceiveMessageIntegrationProps extends SQSIntegrationProps {
  /**
   * The Queue to read messages from.
   */
  readonly queue: IQueue;
  /**
   * The attributes to return.
   * @default - undefined
   */
  readonly attributeNames?: Array<SQSAttribute>;
  /**
   * The maximum number of messages to receive.
   * Valid values: 1 to 10.
   * @default - 1
   */
  readonly maxNumberOfMessages?: number;
  /**
   * The message attributes to return
   * @default - undefined
   */
  readonly messageAttributeNames?: Array<string>;
  /**
   * The token used for deduplication of ReceiveMessage calls.
   * Only applicable to FIFO queues.
   * @default - undefined
   */
  readonly receiveRequestAttemptId?: string;
  /**
   * The duration that the received messages are hidden from subsequent retrieve requests after
   * being retrieved by a ReceiveMessage request.
   * @default - undefined
   */
  readonly visibilityTimeout?: Duration;
  /**
   * The duration for which the call waits for a message to arrive in the queue before returning.
   * @default - undefined
   */
  readonly waitTime?: Duration;
}

export class SQSReceiveMessageIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: SQSReceiveMessageIntegrationProps) { }
  bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.SQS_RECEIVEMESSAGE,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: this.props.credentials,
      requestParameters: {
        QueueUrl: this.props.queue.queueUrl,
        AttributeNames: this.props.attributeNames,
        MaxNumberOfMessages: this.props.maxNumberOfMessages,
        MessageAttributeNames: this.props.messageAttributeNames,
        ReceiveRequestAttemptId: this.props.receiveRequestAttemptId,
        VisibilityTimeout: this.props.visibilityTimeout?.toSeconds(),
        WaitTimeSeconds: this.props.waitTime?.toSeconds(),
        Region: this.props.region,
      },
    };
  }
}

export interface SQSDeleteMessageIntegrationProps extends SQSIntegrationProps {
  /**
   * The receipt handle associated with the message to delete.
   */
  readonly receiptHandle: string;
}

export class SQSDeleteMessageIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: SQSDeleteMessageIntegrationProps) { }
  bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.SQS_DELETEMESSAGE,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: this.props.credentials,
      requestParameters: {
        QueueUrl: this.props.queue.queueUrl,
        ReceiptHandle: this.props.receiptHandle,
        Region: this.props.region,
      },
    };
  }
}

export interface SQSPurgeQueueIntegrationProps extends SQSIntegrationProps {
}

export class SQSPurgeQueueIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: SQSPurgeQueueIntegrationProps) { }
  bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.SQS_PURGEQUEUE,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: this.props.credentials,
      requestParameters: {
        QueueUrl: this.props.queue.queueUrl,
        Region: this.props.region,
      },
    };
  }
}

export interface KinesisPutRecordIntegrationProps extends AwsServiceIntegrationProps {
  /**
   * The name of the stream to put the data record into.
   */
  readonly stream: IStream;
  /**
   * The data blob to put into the record, which is base64-encoded when the blob is serialized.
   */
  readonly data: string;
  /**
   * Determines which shard in the stream the data record is assigned to.
   */
  readonly partitionKey: string;
  /**
   * Guarantees strictly increasing sequence numbers, for puts from the same client and to the same
   * partition key.
   * @default - undefined
   */
  readonly sequenceNumberForOrdering?: string;
  /**
   * The hash value used to explicitly determine the shard the data record is assigned to by
   * overriding the partition key hash.
   * @default - undefined
   */
  readonly explicitHashKey?: string;
}

export class KinesisPutRecordIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: KinesisPutRecordIntegrationProps) { }
  bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.KINESIS_PUTRECORD,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: this.props.credentials,
      requestParameters: {
        StreamName: this.props.stream.streamName,
        Data: this.props.data,
        PartitionKey: this.props.partitionKey,
        SequenceNumberForOrdering: this.props.sequenceNumberForOrdering,
        ExplicitHashKey: this.props.explicitHashKey,
        Region: this.props.region,
      },
    };
  }
}

export interface StepFunctionsStartExecutionIntegrationProps extends AwsServiceIntegrationProps {
  /**
   * The StateMachine to execute.
   */
  readonly stateMachine: IStateMachine;
  /**
   * The name of the execution.
   * @default - undefined
   */
  readonly name?: string;
  /**
   * The string that contains the JSON input data for the execution.
   * @default - no input
   */
  readonly input?: string;
  /**
   * Passes the AWS X-Ray trace header.
   */
  readonly traceHeader?: string;
}

export class StepFunctionsStartExecutionIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: StepFunctionsStartExecutionIntegrationProps) { }
  bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.STEPFUNCTIONS_STARTEXECUTION,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: this.props.credentials,
      requestParameters: {
        StateMachineArn: this.props.stateMachine.stateMachineArn,
        Name: this.props.name,
        Input: this.props.input,
        Region: this.props.region,
      },
    };
  }
}

export class StepFunctionsStartSyncExecutionIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: StepFunctionsStartExecutionIntegrationProps) { }
  bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.STEPFUNCTIONS_STARTSYNCEXECUTION,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: this.props.credentials,
      requestParameters: {
        StateMachineArn: this.props.stateMachine.stateMachineArn,
        Name: this.props.name,
        Input: this.props.input,
        TraceHeader: this.props.traceHeader,
        Region: this.props.region,
      },
    };
  }
}

export interface StepFunctionsStopExecutionIntegrationProps extends AwsServiceIntegrationProps {
  /**
   * The Amazon Resource Name (ARN) of the execution to stop.
   */
  executionArn: string;
  /**
   * A more detailed explanation of the cause of the failure.
   * @default - undefined
   */
  cause?: string;
  /**
   * The error code of the failure.
   * @default - undefined
   */
  error?: string;
}

export class StepFunctionsStopExecutionIntegration implements IHttpRouteIntegration {
  constructor(private readonly props: StepFunctionsStopExecutionIntegrationProps) { }
  bind(_options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.STEPFUNCTIONS_STOPEXECUTION,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: this.props.credentials,
      requestParameters: {
        ExecutionArn: this.props.executionArn,
        Cause: this.props.cause,
        Error: this.props.error,
        Region: this.props.region,
      },
    };
  }
}
