import { HttpIntegrationSubtype, HttpIntegrationType, HttpRouteIntegrationBindOptions, HttpRouteIntegrationConfig, IHttpRouteIntegration, IntegrationCredentials, PayloadFormatVersion } from '@aws-cdk/aws-apigatewayv2';
import { IEventBus } from '@aws-cdk/aws-events';
import { IRole, PolicyStatement, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { IStream } from '@aws-cdk/aws-kinesis';
import { IQueue } from '@aws-cdk/aws-sqs';
import { IStateMachine } from '@aws-cdk/aws-stepfunctions';
import { Duration } from '@aws-cdk/core';

interface AwsServiceIntegrationProps {
  /**
   * The credentials to use for the integration
   */
  readonly role: IRole;
  /**
   * The region of the integration, cannot be an expression.
   * @default - undefined
   */
  region?: string;
}

abstract class AwsServiceIntegration<T extends AwsServiceIntegrationProps> implements
  IHttpRouteIntegration {
  protected payloadFormatVersion = PayloadFormatVersion.VERSION_1_0;
  protected integrationType = HttpIntegrationType.LAMBDA_PROXY;
  constructor(protected readonly props: T) { }
  abstract bind(options: HttpRouteIntegrationBindOptions): HttpRouteIntegrationConfig;
}

export class MappingExpression {
  static staticValue(string: string): MappingExpression {
    return new MappingExpression(string);
  }
  static fromHeader(headerName: string): MappingExpression {
    return new MappingExpression(`$request.header.${headerName}`);
  }
  static fromQueryString(queryParam: string): MappingExpression {
    return new MappingExpression(`$request.querystring.${queryParam}`);
  }
  static fromPath(pathParam: string): MappingExpression {
    return new MappingExpression(`$request.path.${pathParam}`);
  }
  static requestBody(): MappingExpression {
    return new MappingExpression('$request.body');
  }
  static fromRequestBody(path: string): MappingExpression {
    return new MappingExpression(`$request.body.${path}`);
  }
  static fromContext(contextVariable: string): MappingExpression {
    return new MappingExpression(`$context.${contextVariable}`);
  }
  static fromStage(stageVariable: string): MappingExpression {
    return new MappingExpression(`$stageVariables.${stageVariable}`);
  }
  protected constructor(readonly expression: string) { }
}

export class EventBusMappingExpression extends MappingExpression {
  static fromEventBus(eventBus: IEventBus): MappingExpression {
    return new MappingExpression(eventBus.eventBusName);
  }
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
  detail: MappingExpression;
  /**
   * How to map the event detail-type.
   */
  detailType: MappingExpression;
  /**
   * How to map the event source.
   */
  source: MappingExpression;
  /**
   * How to map the event timestamp. Expects an RFC3339 timestamp.
   *
   * @default - the timestamp of the PutEvents call is used
   */
  time?: MappingExpression;
  /**
   * The event bus to receive the event.
   *
   * @default - the default event bus
   */
  eventBus?: EventBusMappingExpression;
  /**
   * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns.
   *
   * Must be a string representation of a JSON array, either containing static values or an expression.
   *
   * @default - none
   */
  resources?: MappingExpression;
  /**
   * An AWS X-Ray trade header, which is an http header (X-Amzn-Trace-Id) that contains the
   * trace-id associated with the event.
   *
   * @default - none
   */
  traceHeader?: MappingExpression;
}

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
        Detail: this.props.detail.expression,
        DetailType: this.props.detailType.expression,
        Source: this.props.source.expression,
        Time: this.props.time?.expression,
        EventBusName: this.props.eventBus?.expression,
        Region: this.props.region,
        Resources: this.props.resources?.expression,
        TraceHeader: this.props.traceHeader?.expression,
      },
    };
  }
}

export class QueueMappingExpression extends MappingExpression {
  /**
   * Send messages to a statically defined queue.
   * @param queue a static queue to send all messages to
   * @returns the expression for the queue URL
   */
  static fromQueue(queue: IQueue): MappingExpression {
    return new MappingExpression(queue.queueUrl);
  }
}

export class DurationMappingExpression extends MappingExpression {
  static fromDuration(duration: Duration): MappingExpression {
    return new MappingExpression(duration.toSeconds().toString());
  }
}

interface SQSIntegrationProps extends AwsServiceIntegrationProps {
  /** The SQS Queue to send messages to */
  readonly queue: QueueMappingExpression;
}

/**
 * Properties for the SQS-SendMessage integration.
 * @see https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-aws-services-reference.html#SQS-SendMessage
 */
export interface SQSSendMessageIntegrationProps extends SQSIntegrationProps {
  /** The message body */
  readonly body: MappingExpression;
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
   */
  readonly attributes?: MappingExpression;
  /**
   * The token used for deduplication of sent messages.
   * This parameter applies only to FIFO (first-in-first-out) queues.
   * @default - undefined
   */
  readonly deduplicationId?: MappingExpression;
  /**
   * The tag that specifies that a message belongs to a specific message group.
   * This parameter applies only to FIFO (first-in-first-out) queues.
   */
  readonly groupId?: MappingExpression;
  /**
   * The message system attribute to send.
   * Currently, the only supported message system attribute is AWSTraceHeader.
   * Its type must be String and its value must be a correctly formatted AWS X-Ray trace header
   * string.
   * @default - undefined
   */
  readonly systemAttributes?: MappingExpression;
}

export class SQSSendMessageIntegration
  extends AwsServiceIntegration<SQSSendMessageIntegrationProps> {
  constructor(props: SQSSendMessageIntegrationProps) {
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
        QueueUrl: this.props.queue.expression,
        MessageBody: this.props.body.expression,
        DelaySeconds: this.props.delay?.expression,
        MessageAttributes: this.props.attributes?.expression,
        MessageDeduplicationId: this.props.deduplicationId?.expression,
        MessageGroupId: this.props.groupId?.expression,
        MessageSystemAttributes: this.props.systemAttributes?.expression,
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
  readonly queue: QueueMappingExpression;
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
  readonly visibilityTimeout?: DurationMappingExpression;
  /**
   * The duration for which the call waits for a message to arrive in the queue before returning.
   * @default - undefined
   */
  readonly waitTime?: DurationMappingExpression;
}

export class SQSReceiveMessageIntegration
  extends AwsServiceIntegration<SQSReceiveMessageIntegrationProps> {
  constructor(props: SQSReceiveMessageIntegrationProps) {
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
        QueueUrl: this.props.queue.expression,
        AttributeNames: this.props.attributeNames,
        MaxNumberOfMessages: this.props.maxNumberOfMessages,
        MessageAttributeNames: this.props.messageAttributeNames,
        ReceiveRequestAttemptId: this.props.receiveRequestAttemptId,
        VisibilityTimeout: this.props.visibilityTimeout?.expression,
        WaitTimeSeconds: this.props.waitTime?.expression,
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

export class SQSDeleteMessageIntegration extends AwsServiceIntegration<SQSDeleteMessageIntegrationProps> {
  constructor(props: SQSDeleteMessageIntegrationProps) {
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
        QueueUrl: this.props.queue.expression,
        ReceiptHandle: this.props.receiptHandle,
        Region: this.props.region,
      },
    };
  }
}

export interface SQSPurgeQueueIntegrationProps extends SQSIntegrationProps {
}

export class SQSPurgeQueueIntegration
  extends AwsServiceIntegration<SQSPurgeQueueIntegrationProps> {
  constructor(props: SQSPurgeQueueIntegrationProps) {
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
        QueueUrl: this.props.queue.expression,
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
