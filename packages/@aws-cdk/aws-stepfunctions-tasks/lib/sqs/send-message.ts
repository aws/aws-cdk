import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * The data type set for SNS message attributes.
 *
 * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-metadata.html#message-attribute-data-types
 */
export enum SqsMessageAttributeDataType {
  /**
   * Strings are Unicode with UTF-8 binary encoding.
   *
   * Supports primitive string types. Passed as-is into the message attribute
   */
  STRING = 'String',

  /**
   * Any signed number with up to 38 digits of precision between 10^-128 and 10^+126.
   *
   * Supports primitive number types.
   */
  NUMBER = 'Number',

  /**
   * Binary type attributes can store any binary data.
   *
   * Supports a primitive string type containing the base64 data.
   */
  BINARY = 'Binary',
}

/**
 * Object that contains all the attributes to be send along a message.
 *
 * All data types can have a custom label attached to help consumers narrow the type.
 * For example, Binary data could have the 'png' label attached to clear up the data type of the file.
 * These labels are not interpreted, validated, or used by SQS, Step Functions or the CDK.
 */
export interface SqsMessageAttribute {
  /**
   * Data type of the attribute.
   */
  readonly dataType: SqsMessageAttributeDataType,

  /**
   * Value of the attached data. Usually a string, number or base64 encoded data.
   * Validated based on the specified data type.
   */
  readonly value: any,

  /**
   * The custom label to attach to the data type
   *
   * @default - The data type of this attribute will include no custom label.
   * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-message-metadata.html#message-attribute-data-types
   */
  readonly dataTypeLabel?: string,
}

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
   * Attributes to send along with the message. Messages can not have over 10 attributes.
   *
   * @default - No attributes will be sent with the message
   */
  readonly messageAttributes?: { [key: string]: SqsMessageAttribute };

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

    // sending to an encrypted queue requires
    // permissions on the associated kms key
    if (this.props.queue.encryptionMasterKey) {
      this.taskPolicies.push(
        new iam.PolicyStatement({
          actions: ['kms:Decrypt', 'kms:GenerateDataKey*'],
          resources: [this.props.queue.encryptionMasterKey.keyArn],
        }));
    }

    if (this.props.messageAttributes) {
      const length = Object.keys(this.props.messageAttributes).length;
      if (length > 10) {
        throw new Error(`SQS messages can not have more than 10 attributes attached. Got ${length}.`);
      }
    }
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
        MessageAttributes: renderMessageAttributes(this.props.messageAttributes),
        DelaySeconds: this.props.delay?.toSeconds(),
        MessageDeduplicationId: this.props.messageDeduplicationId,
        MessageGroupId: this.props.messageGroupId,
      }),
    };
  }
}

interface MessageAttributeValue {
  DataType: string;
  StringValue?: string;
  BinaryValue?: string;
}

function renderMessageAttributes(attributes?: { [name: string]: SqsMessageAttribute }): { [name: string]: MessageAttributeValue } | undefined {
  if (attributes === undefined) { return undefined; }

  const renderedAttributes: { [key: string]: MessageAttributeValue } = {};
  Object.entries(attributes).map(([name, attribute]) => {
    renderedAttributes[name] = renderMessageAttributeValue(attribute);
  });
  return renderedAttributes;
}

function renderMessageAttributeValue(attribute: SqsMessageAttribute): MessageAttributeValue {
  const completeDataType = attribute.dataTypeLabel ? `${attribute.dataType}.${attribute.dataTypeLabel}` : attribute.dataType;

  switch (attribute.dataType) {
    case SqsMessageAttributeDataType.BINARY: {
      if (typeof attribute.value !== 'string') {
        throw new Error('Binary attributes can only receive a string containing the base64-encoded data');
      }

      return {
        DataType: completeDataType,
        BinaryValue: attribute.value,
      };
    }
    case SqsMessageAttributeDataType.NUMBER: {
      if (typeof attribute.value !== 'number' && typeof attribute.value !== 'string') {
        throw new Error('Number attributes can only receive primitive numbers or a string representation of the number');
      }

      return {
        DataType: completeDataType,
        StringValue: attribute.value.toString(),
      };
    }
    case SqsMessageAttributeDataType.STRING: {
      if (typeof attribute.value !== 'string') {
        throw new Error('String attributes can only receive string values');
      }

      return {
        DataType: completeDataType,
        StringValue: attribute.value.toString(),
      };
    }
  }
}