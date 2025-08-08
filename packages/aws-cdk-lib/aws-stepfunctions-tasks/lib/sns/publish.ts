import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sns from '../../../aws-sns';
import * as sfn from '../../../aws-stepfunctions';
import { Token, ValidationError } from '../../../core';
import { integrationResourceArn, isJsonPathOrJsonataExpression, validatePatternSupported } from '../private/task-utils';

/**
 * The data type set for the SNS message attributes
 *
 * @see https://docs.aws.amazon.com/sns/latest/dg/sns-message-attributes.html#SNSMessageAttributes.DataTypes
 */
export enum MessageAttributeDataType {
  /**
   * Strings are Unicode with UTF-8 binary encoding
   */
  STRING = 'String',

  /**
   * An array, formatted as a string
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-message-attributes.html#SNSMessageAttributes.DataTypes
   */
  STRING_ARRAY = 'String.Array',

  /**
   * Numbers are positive or negative integers or floating-point numbers
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-message-attributes.html#SNSMessageAttributes.DataTypes
   */
  NUMBER = 'Number',

  /**
   * Binary type attributes can store any binary data
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-message-attributes.html#SNSMessageAttributes.DataTypes
   */
  BINARY = 'Binary',
}

/**
 * A message attribute to add to the SNS message
 *
 * @see https://docs.aws.amazon.com/sns/latest/dg/sns-message-attributes.html
 */
export interface MessageAttribute {
  /**
   * The value of the attribute
   */
  readonly value: any;

  /**
   * The data type for the attribute
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-message-attributes.html#SNSMessageAttributes.DataTypes
   * @default determined by type inspection if possible, fallback is String
   */
  readonly dataType?: MessageAttributeDataType;
}

interface SnsPublishOptions {
  /**
   * The SNS topic that the task will publish to.
   */
  readonly topic: sns.ITopic;

  /**
   * The message you want to send.
   *
   * With the exception of SMS, messages must be UTF-8 encoded strings and
   * at most 256 KB in size.
   * For SMS, each message can contain up to 140 characters.
   */
  readonly message: sfn.TaskInput;

  /**
   * Add message attributes when publishing.
   *
   * These attributes carry additional metadata about the message and may be used
   * for subscription filters.
   *
   * @see https://docs.aws.amazon.com/sns/latest/dg/sns-message-attributes.html
   * @default {}
   */
  readonly messageAttributes?: { [key: string]: MessageAttribute };

  /**
   * Send different messages for each transport protocol.
   *
   * For example, you might want to send a shorter message to SMS subscribers
   * and a more verbose message to email and SQS subscribers.
   *
   * Your message must be a JSON object with a top-level JSON key of
   * "default" with a value that is a string
   * You can define other top-level keys that define the message you want to
   * send to a specific transport protocol (i.e. "sqs", "email", "http", etc)
   *
   * @see https://docs.aws.amazon.com/sns/latest/api/API_Publish.html#API_Publish_RequestParameters
   * @default false
   */
  readonly messagePerSubscriptionType?: boolean;

  /**
   * Used as the "Subject" line when the message is delivered to email endpoints.
   * This field will also be included, if present, in the standard JSON messages
   * delivered to other endpoints.
   *
   * @default - No subject
   */
  readonly subject?: string;

  /**
   * This parameter applies only to FIFO topics.
   *
   * The MessageGroupId is a tag that specifies that a message belongs to a specific message group.
   * Messages that belong to the same message group are processed in a FIFO manner
   * (however, messages in different message groups might be processed out of order).
   * Every message must include a MessageGroupId.
   *
   * @default - Not used for standard topics, required for FIFO topics.
   */
  readonly messageGroupId?: string;

  /**
   * This parameter applies only to FIFO topics.
   *
   * Every message must have a unique MessageDeduplicationId, which is a token used for deduplication of sent messages.
   * If a message with a particular MessageDeduplicationId is sent successfully, any message sent with the same MessageDeduplicationId
   * during the 5-minute deduplication interval is treated as a duplicate.
   *
   * If the topic has ContentBasedDeduplication set, the system generates a MessageDeduplicationId
   * based on the contents of the message. Your MessageDeduplicationId overrides the generated one.
   *
   * @default - Not used for standard topics, required for FIFO topics with ContentBasedDeduplication disabled.
   */
  readonly messageDeduplicationId?: string;
}

/**
 * Properties for publishing a message to an SNS topic using JSONPath
 */
export interface SnsPublishJsonPathProps extends sfn.TaskStateJsonPathBaseProps, SnsPublishOptions { }

/**
 * Properties for publishing a message to an SNS topic using JSONata
 */
export interface SnsPublishJsonataProps extends sfn.TaskStateJsonataBaseProps, SnsPublishOptions { }

/**
 * Properties for publishing a message to an SNS topic
 */
export interface SnsPublishProps extends sfn.TaskStateBaseProps, SnsPublishOptions { }

/**
 * A Step Functions Task to publish messages to SNS topic.
 */
export class SnsPublish extends sfn.TaskStateBase {
  /**
   * A Step Functions Task to publish messages to SNS topic using JSONPath.
   */
  public static jsonPath(scope: Construct, id: string, props: SnsPublishJsonPathProps) {
    return new SnsPublish(scope, id, props);
  }

  /**
   * A Step Functions Task to publish messages to SNS topic using JSONata.
   */
  public static jsonata(scope: Construct, id: string, props: SnsPublishJsonataProps) {
    return new SnsPublish(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  protected readonly taskMetrics: sfn.TaskMetricsConfig | undefined;
  protected readonly taskPolicies: iam.PolicyStatement[] | undefined;

  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: SnsPublishProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, SnsPublish.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN) {
      if (!sfn.FieldUtils.containsTaskToken(props.message)) {
        throw new ValidationError('Task Token is required in `message` Use JsonPath.taskToken to set the token.', this);
      }
    }

    if (props.topic.fifo) {
      if (!props.messageGroupId) {
        throw new ValidationError('\'messageGroupId\' is required for FIFO topics', this);
      }
      if (props.messageGroupId.length > 128) {
        throw new ValidationError(`\'messageGroupId\' must be at most 128 characters long, got ${props.messageGroupId.length}`, this);
      }
      if (!props.topic.contentBasedDeduplication && !props.messageDeduplicationId) {
        throw new ValidationError('\'messageDeduplicationId\' is required for FIFO topics with \'contentBasedDeduplication\' disabled', this);
      }
      if (props.messageDeduplicationId && props.messageDeduplicationId.length > 128) {
        throw new ValidationError(`\'messageDeduplicationId\' must be at most 128 characters long, got ${props.messageDeduplicationId.length}`, this);
      }
    }

    this.taskPolicies = [
      new iam.PolicyStatement({
        actions: ['sns:Publish'],
        resources: [this.props.topic.topicArn],
      }),
    ];
  }

  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('sns', 'publish', this.integrationPattern),
      ...this._renderParametersOrArguments({
        TopicArn: this.props.topic.topicArn,
        Message: this.props.message.value,
        MessageDeduplicationId: this.props.messageDeduplicationId,
        MessageGroupId: this.props.messageGroupId,
        MessageStructure: this.props.messagePerSubscriptionType ? 'json' : undefined,
        MessageAttributes: renderMessageAttributes(this, this.props.messageAttributes),
        Subject: this.props.subject,
      }, queryLanguage),
    };
  }
}

interface MessageAttributeValue {
  DataType: string;
  StringValue?: string;
  BinaryValue?: string;
}

function renderMessageAttributes(scope: Construct, attributes?: { [key: string]: MessageAttribute }): any {
  if (attributes === undefined) { return undefined; }
  const renderedAttributes: { [key: string]: MessageAttributeValue } = {};
  Object.entries(attributes).map(([key, val]) => {
    renderedAttributes[key] = renderMessageAttributeValue(scope, val);
  });
  return sfn.TaskInput.fromObject(renderedAttributes).value;
}

function renderMessageAttributeValue(scope: Construct, attribute: MessageAttribute): MessageAttributeValue {
  const dataType = attribute.dataType;
  if (attribute.value instanceof sfn.TaskInput) {
    return {
      DataType: dataType ?? MessageAttributeDataType.STRING,
      StringValue: dataType !== MessageAttributeDataType.BINARY ? attribute.value.value : undefined,
      BinaryValue: dataType === MessageAttributeDataType.BINARY ? attribute.value.value : undefined,
    };
  }

  if (dataType === MessageAttributeDataType.BINARY) {
    return { DataType: dataType, BinaryValue: `${attribute.value}` };
  }

  if (Token.isUnresolved(attribute.value)) {
    return { DataType: dataType ?? MessageAttributeDataType.STRING, StringValue: attribute.value };
  }

  validateMessageAttribute(scope, attribute);
  if (Array.isArray(attribute.value)) {
    return { DataType: MessageAttributeDataType.STRING_ARRAY, StringValue: JSON.stringify(attribute.value) };
  }
  const value = attribute.value;
  if (typeof value === 'number') {
    return { DataType: MessageAttributeDataType.NUMBER, StringValue: `${value}` };
  } else {
    return { DataType: MessageAttributeDataType.STRING, StringValue: `${value}` };
  }
}

function validateMessageAttribute(scope: Construct, attribute: MessageAttribute): void {
  const dataType = attribute.dataType;
  const value = attribute.value;
  if (dataType === undefined) {
    return;
  }
  if (Array.isArray(value)) {
    if (dataType !== MessageAttributeDataType.STRING_ARRAY) {
      throw new ValidationError(`Requested SNS message attribute type was ${dataType} but ${value} was of type Array`, scope);
    }
    const validArrayTypes = ['string', 'boolean', 'number'];
    value.forEach((v) => {
      if (v !== null || !validArrayTypes.includes(typeof v)) {
        throw new ValidationError(`Requested SNS message attribute type was ${typeof value} but Array values must be one of ${validArrayTypes}`, scope);
      }
    });
    return;
  }
  const error = new Error(`Requested SNS message attribute type was ${dataType} but ${value} was of type ${typeof value}`);
  switch (typeof value) {
    case 'string':
      // trust the user or will default to string
      if (isJsonPathOrJsonataExpression(attribute.value)) {
        return;
      }
      if (dataType === MessageAttributeDataType.STRING ||
        dataType === MessageAttributeDataType.BINARY) {
        return;
      }
      throw error;
    case 'number':
      if (dataType === MessageAttributeDataType.NUMBER) { return; }
      throw error;
    case 'boolean':
      if (dataType === MessageAttributeDataType.STRING) { return; }
      throw error;
    default:
      throw error;
  }
}
