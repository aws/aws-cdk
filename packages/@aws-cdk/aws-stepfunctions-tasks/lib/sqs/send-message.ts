import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for sending a message to an SQS queue
 */
export interface SqsSendMessageProps extends sfn.TaskStateBaseProps {

  /**
   * The SQS queue that messages will be sent to
   */
  readonly queue: sqs.IQueue

  /**
   * The text message to send to the queue.
   */
  readonly messageBody: sfn.TaskInput;

  /**
   * Message attributes to attach to the SQS message sent to the queue.
   *
   * @default - none
   */
  readonly messageAttributes?: SqsMessageAttributes;

  /**
   * The length of time, for which to delay a message.
   * Messages that you send to the queue remain invisible to consumers for the duration
   * of the delay period. The maximum allowed delay is 15 minutes.
   *
   * @default - delay set on the queue. If a delay is not set on the queue,
   *   messages are sent immediately (0 seconds).
   */
  readonly delay?: cdk.Duration;

  /**
   * The token used for deduplication of sent messages.
   * Any messages sent with the same deduplication ID are accepted successfully,
   * but aren't delivered during the 5-minute deduplication interval.
   *
   * @default - None
   */
  readonly messageDeduplicationId?: string;

  /**
   * The tag that specifies that a message belongs to a specific message group.
   *
   * Messages that belong to the same message group are processed in a FIFO manner.
   * Messages in different message groups might be processed out of order.
   *
   * @default - None
   */
  readonly messageGroupId?: string;
}

/**
 * Attributes associated with a message sent to an SQS queue.
 */
export class SqsMessageAttributes {
  /**
   * Message attributes provided directly from task input. The value must be an
   * object where values match the `SQS.MessageAttributeValue` schema.
   *
   * @param path the JSON path expression where the attributes are located.
   *
   * @returns a new `SqsMessageAttributes` instance.
   *
   * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_MessageAttributeValue.html
   */
  public static fromJsonPathAt(path: string): SqsMessageAttributes {
    return new SqsMessageAttributes(sfn.TaskInput.fromJsonPathAt(path));
  }

  /**
   * Message attributes provided by an object literal.
   *
   * @param obj the message attributes to use.
   *
   * @returns a new `SqsMessageAttributes` instance.
   */
  public static fromObject(obj: { [key: string]: SqsMessageAttributeValue }): SqsMessageAttributes {
    const rendered: { [key: string]: any; } = {};
    for (const [key, value] of Object.entries(obj)) {
      rendered[key] = value._taskInput.value;
    }

    return new SqsMessageAttributes(sfn.TaskInput.fromObject(rendered));
  }

  /** @internal */
  public readonly _taskInput: sfn.TaskInput;

  private constructor(value: sfn.TaskInput) {
    this._taskInput = value;
  }
}

/**
 * Message attribute values.
 */
export class SqsMessageAttributeValue {
  /**
   * Attribute value provided directly from the task input. The value must be an
   * object matching the `SQS.MessageAttributeValue` schema.
   *
   * @param path the JSON path expression where the attribute is located.
   *
   * @returns a new `SqsMessageAttributeValue` instance.
   *
   * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_MessageAttributeValue.html
   */
  public static fromJsonPathAt(path: string): SqsMessageAttributeValue {
    return new SqsMessageAttributeValue(sfn.TaskInput.fromJsonPathAt(path));
  }

  /**
   * Binary attribute provided as a base64-encoded string.
   *
   * @param base64 the base64-encoded attribute value.
   *
   * @returns a new `SqsMessageAttributeValue` instance.
   */
  public static fromBase64(base64: string): SqsMessageAttributeValue {
    return new SqsMessageAttributeValue(sfn.TaskInput.fromObject({ DataType: 'Binary', BinaryValue: base64 }));
  }

  /**
   * Binary attribute provided from the task input.
   *
   * @param path the JSON expression where the base64-encoded attribute value is.
   *
   * @returns a new `SqsMessageAttributeValue` instance.
   */
  public static base64FromJsonPathAt(path: string): SqsMessageAttributeValue {
    return new SqsMessageAttributeValue(sfn.TaskInput.fromObject({ DataType: 'Binary', BinaryValue: sfn.TaskInput.fromJsonPathAt(path).value }));
  }

  /**
   * Number attribute.
   *
   * @param number the number value.
   *
   * @returns a new `SqsMessageAttributeValue` instance.
   */
  public static fromNumber(number: number): SqsMessageAttributeValue {
    const stringified = Token.isUnresolved(number)
      ? Token.asString(number)
      : number.toString();
    return new SqsMessageAttributeValue(sfn.TaskInput.fromObject({ DataType: 'Number', StringValue: stringified }));
  }

  /**
   * Number attribute provided from the task input.
   *
   * @param path the JSON expression where the number attribute value is.
   *
   * @returns a new `SqsMessageAttributeValue` instance.
   */
  public static numberFromJsonPathAt(path: string): SqsMessageAttributeValue {
    return new SqsMessageAttributeValue(sfn.TaskInput.fromObject({ DataType: 'Number', StringValue: sfn.TaskInput.fromJsonPathAt(path).value }));
  }

  /**
   * String attribute.
   *
   * @param str the string value.
   *
   * @returns a new `SqsMessageAttributeValue` instance.
   */
  public static fromString(str: string): SqsMessageAttributeValue {
    return new SqsMessageAttributeValue(sfn.TaskInput.fromObject({ DataType: 'String', StringValue: str }));
  }

  /**
   * String attribute provided from the task input.
   *
   * @param path the JSON expression where the number attribute value is.
   *
   * @returns a new `SqsMessageAttributeValue` instance.
   */
  public static stringFromJsonPathAt(path: string): SqsMessageAttributeValue {
    return new SqsMessageAttributeValue(sfn.TaskInput.fromObject({ DataType: 'String', StringValue: sfn.TaskInput.fromJsonPathAt(path).value }));
  }

  /** @internal */
  public readonly _taskInput: sfn.TaskInput;

  private constructor(value: sfn.TaskInput) {
    this._taskInput = value;
  }
}

/**
 * A StepFunctions Task to send messages to SQS queue.
 *
 */
export class SqsSendMessage extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: SqsSendMessageProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, SqsSendMessage.SUPPORTED_INTEGRATION_PATTERNS);

    if (props.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN) {
      if (!sfn.FieldUtils.containsTaskToken(props.messageBody)) {
        throw new Error('Task Token is required in `messageBody` Use JsonPath.taskToken to set the token.');
      }
    }

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [this.props.queue.queueArn],
      }),
    ];
  }

  /**
   * Provides the SQS SendMessage service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('sqs', 'sendMessage', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        QueueUrl: this.props.queue.queueUrl,
        MessageBody: this.props.messageBody.value,
        MessageAttributes: this.props.messageAttributes?._taskInput.value,
        DelaySeconds: this.props.delay?.toSeconds(),
        MessageDeduplicationId: this.props.messageDeduplicationId,
        MessageGroupId: this.props.messageGroupId,
      }),
    };
  }
}
