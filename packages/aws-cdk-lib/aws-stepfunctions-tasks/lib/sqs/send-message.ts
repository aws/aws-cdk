import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as sqs from '../../../aws-sqs';
import * as sfn from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

interface SqsSendMessageOptions {
  /**
   * The SQS queue that messages will be sent to
   */
  readonly queue: sqs.IQueue;

  /**
   * The text message to send to the queue.
   */
  readonly messageBody: sfn.TaskInput;

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
 * Properties for sending a message to an SQS queue using JSONPath
 */
export interface SqsSendMessageJsonPathProps extends sfn.TaskStateJsonPathBaseProps, SqsSendMessageOptions { }

/**
 * Properties for sending a message to an SQS queue using JSONata
 */
export interface SqsSendMessageJsonataProps extends sfn.TaskStateJsonataBaseProps, SqsSendMessageOptions { }

/**
 * Properties for sending a message to an SQS queue
 */
export interface SqsSendMessageProps extends sfn.TaskStateBaseProps, SqsSendMessageOptions { }

/**
 * A StepFunctions Task to send messages to SQS queue.
 */
export class SqsSendMessage extends sfn.TaskStateBase {
  /**
   * A StepFunctions Task to send messages to SQS queue using JSONPath.
   */
  public static jsonPath(scope: Construct, id: string, props: SqsSendMessageJsonPathProps) {
    return new SqsSendMessage(scope, id, props);
  }

  /**
   * A StepFunctions Task to send messages to SQS queue using JSONata.
   */
  public static jsonata(scope: Construct, id: string, props: SqsSendMessageJsonataProps) {
    return new SqsSendMessage(scope, id, {
      ...props,
      queryLanguage: sfn.QueryLanguage.JSONATA,
    });
  }

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
  }

  /**
   * @internal
   */
  protected _renderTask(topLevelQueryLanguage?: sfn.QueryLanguage): any {
    const queryLanguage = sfn._getActualQueryLanguage(topLevelQueryLanguage, this.props.queryLanguage);
    return {
      Resource: integrationResourceArn('sqs', 'sendMessage', this.integrationPattern),
      ...this._renderParametersOrArguments({
        QueueUrl: this.props.queue.queueUrl,
        MessageBody: this.props.messageBody.value,
        DelaySeconds: this.props.delay?.toSeconds(),
        MessageDeduplicationId: this.props.messageDeduplicationId,
        MessageGroupId: this.props.messageGroupId,
      }, queryLanguage),
    };
  }
}
