import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Token } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

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
  BINARY = 'Binary'
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
  readonly dataType?: MessageAttributeDataType
}

/**
 * Properties for publishing a message to an SNS topic
 */
export interface SnsPublishProps extends sfn.TaskStateBaseProps {

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
}

/**
 * A Step Functions Task to publish messages to SNS topic.
 *
 */
export class SnsPublish extends sfn.TaskStateBase {

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
        throw new Error('Task Token is required in `message` Use JsonPath.taskToken to set the token.');
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
   * Provides the SNS Publish service integration task configuration
   */
  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('sns', 'publish', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        TopicArn: this.props.topic.topicArn,
        Message: this.props.message.value,
        MessageStructure: this.props.messagePerSubscriptionType ? 'json' : undefined,
        MessageAttributes: renderMessageAttributes(this.props.messageAttributes),
        Subject: this.props.subject,
      }),
    };
  }
}

interface MessageAttributeValue {
  DataType: string;
  StringValue?: string;
  BinaryValue?: string;
}

function renderMessageAttributes(attributes?: { [key: string]: MessageAttribute }): any {
  if (attributes === undefined) { return undefined; }
  const renderedAttributes: { [key: string]: MessageAttributeValue } = {};
  Object.entries(attributes).map(([key, val]) => {
    renderedAttributes[key] = renderMessageAttributeValue(val);
  });
  return sfn.TaskInput.fromObject(renderedAttributes).value;
}

function renderMessageAttributeValue(attribute: MessageAttribute): MessageAttributeValue {
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

  validateMessageAttribute(attribute);
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

function validateMessageAttribute(attribute: MessageAttribute): void {
  const dataType = attribute.dataType;
  const value = attribute.value;
  if (dataType === undefined) {
    return;
  }
  if (Array.isArray(value)) {
    if (dataType !== MessageAttributeDataType.STRING_ARRAY) {
      throw new Error(`Requested SNS message attribute type was ${dataType} but ${value} was of type Array`);
    }
    const validArrayTypes = ['string', 'boolean', 'number'];
    value.forEach((v) => {
      if (v !== null || !validArrayTypes.includes(typeof v)) {
        throw new Error(`Requested SNS message attribute type was ${typeof value} but Array values must be one of ${validArrayTypes}`);
      }
    });
    return;
  }
  const error = new Error(`Requested SNS message attribute type was ${dataType} but ${value} was of type ${typeof value}`);
  switch (typeof value) {
    case 'string':
      // trust the user or will default to string
      if (sfn.JsonPath.isEncodedJsonPath(attribute.value)) {
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
