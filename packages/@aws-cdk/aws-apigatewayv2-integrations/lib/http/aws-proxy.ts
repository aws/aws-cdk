import { HttpIntegrationSubtype, HttpIntegrationType, HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig, IHttpRouteIntegration, IntegrationCredentials, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { IRole, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { IStream } from '@aws-cdk/aws-kinesis';
import { IStateMachine } from '@aws-cdk/aws-stepfunctions';
import { ArrayMappingExpression, DateMappingExpression, DurationMappingExpression, EventBusMappingExpression, Mapping, QueueMappingExpression, StringMappingExpression } from './mapping-expression';

interface AwsServiceIntegrationProps {
  /**
   * The credentials to use for the integration
   */
  readonly role: IRole;
  /**
   * The region of the integration, cannot be an expression.
   * @default - undefined
   */
  readonly region?: string;
}

abstract class AwsServiceIntegration<T extends AwsServiceIntegrationProps> implements
  IHttpRouteIntegration {
  protected payloadFormatVersion = PayloadFormatVersion.VERSION_1_0;
  protected integrationType = HttpIntegrationType.LAMBDA_PROXY;
  constructor(protected readonly props: T) { }
  abstract bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig;
}

/**
 * Properties for EventBridge PutEvents Integrations.
 *
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html#EventBridge-PutEvents
 */
export interface EventBridgePutEventsIntegrationProps extends AwsServiceIntegrationProps {
  // mapping: EventBridgePutEventMappingBuilder;
  /**
   * How to map the event detail.
   */
  readonly detail: StringMappingExpression;
  /**
   * How to map the event detail-type.
   */
  readonly detailType: StringMappingExpression;
  /**
   * How to map the event source.
   */
  readonly source: StringMappingExpression;
  /**
   * How to map the event timestamp. Expects an RFC3339 timestamp.
   *
   * @default - the timestamp of the PutEvents call is used
   */
  readonly time?: DateMappingExpression;
  /**
   * The event bus to receive the event.
   *
   * @default - the default event bus
   */
  readonly eventBus?: EventBusMappingExpression;
  /**
   * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns.
   *
   * Must be a string representation of a JSON array, either containing static values or an expression.
   *
   * @default - none
   */
  readonly resources?: ArrayMappingExpression;
  /**
   * An AWS X-Ray trade header, which is an http header (X-Amzn-Trace-Id) that contains the
   * trace-id associated with the event.
   *
   * @default - none
   */
  readonly traceHeader?: StringMappingExpression;
}

/**
 * An integration with EventBridge-PutEvents
 */
export class EventBridgePutEventsIntegration
  extends AwsServiceIntegration<EventBridgePutEventsIntegrationProps> {
  constructor(props: EventBridgePutEventsIntegrationProps) {
    super(props);
  }
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const role = this.props.role ?? new Role(options.scope, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    return {
      type: this.integrationType,
      subtype: HttpIntegrationSubtype.EVENTBRIDGE_PUTEVENTS,
      payloadFormatVersion: this.payloadFormatVersion,
      credentials: IntegrationCredentials.fromRole(role),
      requestParameters: {
        Detail: this.props.detail.mapping,
        DetailType: this.props.detailType.mapping,
        Source: this.props.source.mapping,
        Time: this.props.time?.mapping,
        EventBusName: this.props.eventBus?.mapping,
        Region: this.props.region,
        Resources: this.props.resources?.mapping,
        TraceHeader: this.props.traceHeader?.mapping,
      },
    };
  }
}

interface SqsIntegrationProps extends AwsServiceIntegrationProps {
  /** The SQS Queue to send messages to */
  readonly queue: QueueMappingExpression;
}

/**
 * Properties for the SQS-SendMessage integration.
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html#SQS-SendMessage
 */
export interface SqsSendMessageIntegrationProps extends SqsIntegrationProps {
  /** The message body */
  readonly body: StringMappingExpression;
  /**
   * The message send delay, up to 15 minutes.
   * Messages with a positive DelaySeconds value become available for processing after the delay
   * period is finished. If you don't specify a value, the default value for the queue applies.
   *
   * @default - undefined
   */
  readonly delay?: DurationMappingExpression,
  /**
   * Attributes of the message.
   * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-metadata.html#sqs-message-attributes
   * @default - undefined
   */
  readonly attributes?: ArrayMappingExpression;
  /**
   * The token used for deduplication of sent messages.
   * This parameter applies only to FIFO (first-in-first-out) queues.
   * @default - undefined
   */
  readonly deduplicationId?: StringMappingExpression;
  /**
   * The tag that specifies that a message belongs to a specific message group.
   * This parameter applies only to FIFO (first-in-first-out) queues.
   * @default - undefined
   */
  readonly groupId?: StringMappingExpression;
  /**
   * The message system attribute to send.
   * Currently, the only supported message system attribute is AWSTraceHeader.
   * Its type must be String and its value must be a correctly formatted AWS X-Ray trace header
   * string.
   * @default - undefined
   */
  readonly systemAttributes?: StringMappingExpression;
}

/**
 * An SQS-SendMessage Integration.
 */
export class SqsSendMessageIntegration
  extends AwsServiceIntegration<SqsSendMessageIntegrationProps> {
  constructor(props: SqsSendMessageIntegrationProps) {
    super(props);
  }
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const role = this.props.role ?? new Role(options.scope, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    return {
      type: this.integrationType,
      subtype: HttpIntegrationSubtype.SQS_SENDMESSAGE,
      payloadFormatVersion: this.payloadFormatVersion,
      credentials: IntegrationCredentials.fromRole(role),
      requestParameters: {
        QueueUrl: this.props.queue.mapping,
        MessageBody: this.props.body.mapping,
        DelaySeconds: this.props.delay?.mapping,
        MessageAttributes: this.props.attributes?.mapping,
        MessageDeduplicationId: this.props.deduplicationId?.mapping,
        MessageGroupId: this.props.groupId?.mapping,
        MessageSystemAttributes: this.props.systemAttributes?.mapping,
        Region: this.props.region,
      },
    };
  }
}

/**
 * The available SQS Attributes.
 */
export enum SqsAttribute {
  /** All */
  ALL = 'All',
  /** Policy */
  POLICY = 'Policy',
  /** VisibilityTimeout */
  VISIBILITY_TIMEOUT = 'VisibilityTimeout',
  /** MaximumMessageSize */
  MAXIMUM_MESSAGE_SIZE = 'MaximumMessageSize',
  /** MessageRetentionPeriod */
  MESSAGE_RETENTION_PERIOD = 'MessageRetentionPeriod',
  /** ApproximateNumberOfMessages */
  APPROXIMATE_NUMBER_OF_MESSAGES = 'ApproximateNumberOfMessages',
  /** ApproximateNumberOfMessagesNotVisible */
  APPROXIMATE_NUMBER_OF_MESSAGES_NOT_VISIBLE = 'ApproximateNumberOfMessagesNotVisible',
  /** CreatedTimestamp */
  CREATED_TIMESTAMP = 'CreatedTimestamp',
  /** LastModifiedTimestamp */
  LAST_MODIFIED_TIMESTAMP = 'LastModifiedTimestamp',
  /** QueueArn */
  QUEUE_ARN = 'QueueArn',
  /** ApproximateNumberOfMessagesDelayed */
  APPROXIMATE_NUMBER_OF_MESSAGES_DELAYED = 'ApproximateNumberOfMessagesDelayed',
  /** DelaySeconds */
  DELAY_SECONDS = 'DelaySeconds',
  /** ReceiveMessageWaitTimeSeconds */
  RECEIVE_MESSAGE_WAIT_TIME_SECONDS = 'ReceiveMessageWaitTimeSeconds',
  /** RedrivePolicy */
  REDRIVE_POLICY = 'RedrivePolicy',
  /** FifoQueue */
  FIFO_QUEUE = 'FifoQueue',
  /** ContentBasedDeduplication */
  CONTENT_BASED_DEDUPLICATION = 'ContentBasedDeduplication',
  /** KmsMasterKeyId */
  KMS_MASTER_KEY_ID = 'KmsMasterKeyId',
  /** KmsDataKeyReusePeriodSeconds */
  KMS_DATA_KEY_REUSE_PERIOD_SECONDS = 'KmsDataKeyReusePeriodSeconds',
  /** DeduplicationScope */
  DEDUPLICATION_SCOPE = 'DeduplicationScope',
  /** FifoThroughputLimit */
  FIFO_THROUGHPUT_LIMIT = 'FifoThroughputLimit',
}

/**
 * A list of SqsAttributes, either a fixed value or mapped from the request.
 */
export class AttributeListMappingExpression {
  /**
   * Use a fixed value.
   *
   * @param attributeNames the value
   */
  static fromAttributeList(attributeNames: Array<SqsAttribute>) {
    return new AttributeListMappingExpression(JSON.stringify(attributeNames));
  }
  /**
   * Use a mapping to set the value.
   *
   * @param mapping how to map the value
   */
  static fromMapping(mapping: Mapping) {
    return new AttributeListMappingExpression(mapping.expression);
  }
  /**
   * @param mapping the mapping value
   */
  private constructor(readonly mapping: string) { }
}

/**
 * Properties for the SQS-ReceiveMessage Integration.
 */
export interface SqsReceiveMessageIntegrationProps extends SqsIntegrationProps {
  /**
   * The Queue to read messages from.
   */
  readonly queue: QueueMappingExpression;
  /**
   * The attributes to return.
   * @default - undefined
   */
  readonly attributeNames?: AttributeListMappingExpression;
  /**
   * The maximum number of messages to receive.
   * Valid values: 1 to 10.
   * @default - 1
   */
  readonly maxNumberOfMessages?: StringMappingExpression;
  /**
   * The message attributes to return
   * @default - undefined
   */
  readonly messageAttributeNames?: ArrayMappingExpression;
  /**
   * The token used for deduplication of ReceiveMessage calls.
   * Only applicable to FIFO queues.
   * @default - undefined
   */
  readonly receiveRequestAttemptId?: StringMappingExpression;
  /**
   * The duration that the received messages are hidden from subsequent retrieve requests after
   * being retrieved by a ReceiveMessage request.
   * @default - undefined
   */
  readonly visibilityTimeout?: DurationMappingExpression;
  /**
   * The duration for which the call waits for a message to arrive in the queue before returning.
   * @default - undefined
   */
  readonly waitTime?: DurationMappingExpression;
}

/**
 * An SQS-ReceiveMessage integration.
 */
export class SqsReceiveMessageIntegration
  extends AwsServiceIntegration<SqsReceiveMessageIntegrationProps> {
  constructor(props: SqsReceiveMessageIntegrationProps) {
    super(props);
  }
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const role = this.props.role ?? new Role(options.scope, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    return {
      type: this.integrationType,
      subtype: HttpIntegrationSubtype.SQS_RECEIVEMESSAGE,
      payloadFormatVersion: this.payloadFormatVersion,
      credentials: IntegrationCredentials.fromRole(role),
      requestParameters: {
        QueueUrl: this.props.queue.mapping,
        AttributeNames: this.props.attributeNames?.mapping,
        MaxNumberOfMessages: this.props.maxNumberOfMessages?.mapping,
        MessageAttributeNames: this.props.messageAttributeNames?.mapping,
        ReceiveRequestAttemptId: this.props.receiveRequestAttemptId?.mapping,
        VisibilityTimeout: this.props.visibilityTimeout?.mapping,
        WaitTimeSeconds: this.props.waitTime?.mapping,
        Region: this.props.region,
      },
    };
  }
}

/**
 * Properties for an SQS-DeleteMessage integration.
 */
export interface SqsDeleteMessageIntegrationProps extends SqsIntegrationProps {
  /**
   * The receipt handle associated with the message to delete.
   */
  readonly receiptHandle: StringMappingExpression;
}

/**
 * An SQS-DeleteMessage integration.
 */
export class SqsDeleteMessageIntegration extends AwsServiceIntegration<SqsDeleteMessageIntegrationProps> {
  constructor(props: SqsDeleteMessageIntegrationProps) {
    super(props);
  }
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const role = this.props.role ?? new Role(options.scope, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    return {
      type: this.integrationType,
      subtype: HttpIntegrationSubtype.SQS_DELETEMESSAGE,
      payloadFormatVersion: this.payloadFormatVersion,
      credentials: IntegrationCredentials.fromRole(role),
      requestParameters: {
        QueueUrl: this.props.queue.mapping,
        ReceiptHandle: this.props.receiptHandle.mapping,
        Region: this.props.region,
      },
    };
  }
}

/**
 * Properties for the SQS-PurgeQueue integration.
 */
export interface SqsPurgeQueueIntegrationProps extends SqsIntegrationProps {
}

/**
 * An SQS-PurgeQueue integration.
 */
export class SqsPurgeQueueIntegration
  extends AwsServiceIntegration<SqsPurgeQueueIntegrationProps> {
  constructor(props: SqsPurgeQueueIntegrationProps) {
    super(props);
  }
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const role = this.props.role ?? new Role(options.scope, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.SQS_PURGEQUEUE,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: IntegrationCredentials.fromRole(role),
      requestParameters: {
        QueueUrl: this.props.queue.mapping,
        Region: this.props.region,
      },
    };
  }
}

/**
 * Properties for a Kinesis-PutRecord integration.
 */
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

/**
 * A Kinesis-PutRecord integration.
 */
export class KinesisPutRecordIntegration
  extends AwsServiceIntegration<KinesisPutRecordIntegrationProps> {
  constructor(props: KinesisPutRecordIntegrationProps) {
    super(props);
  }
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const role = this.props.role ?? new Role(options.scope, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.KINESIS_PUTRECORD,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: IntegrationCredentials.fromRole(role),
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

/**
 * Properties for a StepFunctions-StartExecution or StepFunctions-StartSyncExecution integration.
 */
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
   * @default - undefined
   */
  readonly traceHeader?: string;
}

/**
 * A StepFunctions-StartExecution integration.
 */
export class StepFunctionsStartExecutionIntegration
  extends AwsServiceIntegration<StepFunctionsStartExecutionIntegrationProps> {
  constructor(props: StepFunctionsStartExecutionIntegrationProps) {
    super(props);
  }
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const role = this.props.role ?? new Role(options.scope, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    return {
      type: HttpIntegrationType.LAMBDA_PROXY,
      subtype: HttpIntegrationSubtype.STEPFUNCTIONS_STARTEXECUTION,
      payloadFormatVersion: PayloadFormatVersion.VERSION_1_0,
      credentials: IntegrationCredentials.fromRole(role),
      requestParameters: {
        StateMachineArn: this.props.stateMachine.stateMachineArn,
        Name: this.props.name,
        Input: this.props.input,
        Region: this.props.region,
      },
    };
  }
}

/**
 * A StepFunctions-StartSyncExecution integration.
 */
export class StepFunctionsStartSyncExecutionIntegration
  extends AwsServiceIntegration<StepFunctionsStartExecutionIntegrationProps> {
  constructor(props: StepFunctionsStartExecutionIntegrationProps) {
    super(props);
  }
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const role = this.props.role ?? new Role(options.scope, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    role.addToPrincipalPolicy(new PolicyStatement({
      actions: ['states:StartSyncExecution'],
      resources: [this.props.stateMachine.stateMachineArn],
    }));
    return {
      type: this.integrationType,
      subtype: HttpIntegrationSubtype.STEPFUNCTIONS_STARTSYNCEXECUTION,
      payloadFormatVersion: this.payloadFormatVersion,
      credentials: IntegrationCredentials.fromRole(role),
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

/**
 * Properties for a StepFunctions-StopExecution integration.
 */
export interface StepFunctionsStopExecutionIntegrationProps extends AwsServiceIntegrationProps {
  /**
   * The Amazon Resource Name (ARN) of the execution to stop.
   */
  readonly executionArn: string;
  /**
   * A more detailed explanation of the cause of the failure.
   * @default - undefined
   */
  readonly cause?: string;
  /**
   * The error code of the failure.
   * @default - undefined
   */
  readonly error?: string;
}

/**
 * A StepFunctions-StopExecution integration.
 */
export class StepFunctionsStopExecutionIntegration
  extends AwsServiceIntegration<StepFunctionsStopExecutionIntegrationProps> {
  constructor(props: StepFunctionsStopExecutionIntegrationProps) {
    super(props);
  }
  bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig {
    const role = this.props.role ?? new Role(options.scope, 'Role', {
      assumedBy: new ServicePrincipal('apigateway.amazonaws.com'),
    });
    return {
      type: this.integrationType,
      subtype: HttpIntegrationSubtype.STEPFUNCTIONS_STOPEXECUTION,
      payloadFormatVersion: this.payloadFormatVersion,
      credentials: IntegrationCredentials.fromRole(role),
      requestParameters: {
        ExecutionArn: this.props.executionArn,
        Cause: this.props.cause,
        Error: this.props.error,
        Region: this.props.region,
      },
    };
  }
}
