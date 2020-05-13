import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import { getResourceArn, TaskStateConfig, taskStateJson, validatePatternSupported } from '../private/task-utils';

/**
 * Properties for SendMessageTask
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
   * The length of time, in seconds, for which to delay a specific message.
   *
   * Valid values are 0-900 seconds.
   *
   * @default Default value of the queue is used
   */
  readonly delay?: cdk.Duration;

  /**
   * The token used for deduplication of sent messages.
   *
   * @default Use content-based deduplication
   */
  readonly messageDeduplicationId?: string;

  /**
   * The tag that specifies that a message belongs to a specific message group.
   *
   * Required for FIFO queues. FIFO ordering applies to messages in the same message
   * group.
   *
   * @default No group ID
   */
  readonly messageGroupId?: string;

  /**
   * The service integration pattern indicates different ways to call SendMessage to SQS.
   *
   * @default IntegrationPattern.REQUEST_RESPONSE
   */
  readonly integrationPattern?: sfn.IntegrationPattern;
}

/**
 * A StepFunctions Task to send messages to SQS queue.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class SqsSendMessage extends sfn.TaskStateBase {

  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN,
  ];

  private readonly integrationPattern: sfn.IntegrationPattern;
  private readonly metricsConfig: sfn.TaskMetricsConfig = {};
  private readonly policies: iam.PolicyStatement[];

  constructor(scope: cdk.Construct, id: string, private readonly props: SqsSendMessageProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.REQUEST_RESPONSE;

    validatePatternSupported(this.integrationPattern, SqsSendMessage.SUPPORTED_INTEGRATION_PATTERNS);

    if (props.integrationPattern === sfn.IntegrationPattern.WAIT_FOR_TASK_TOKEN) {
      if (!sfn.FieldUtils.containsTaskToken(props.messageBody)) {
        throw new Error('Task Token is required in `messageBody` Use Context.taskToken to set the token.');
      }
    }

    this.policies = [
      new iam.PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [this.props.queue.queueArn],
      }),
    ];
  }

  protected renderTask(): any {
    const taskConfig: TaskStateConfig = {
      resourceArn: getResourceArn('sqs', 'sendMessage', this.integrationPattern),
      parameters: {
        QueueUrl: this.props.queue.queueUrl,
        MessageBody: this.props.messageBody.value,
        DelaySeconds: this.props.delay && this.props.delay.toSeconds(),
        MessageDeduplicationId: this.props.messageDeduplicationId,
        MessageGroupId: this.props.messageGroupId,
      },
    };

    return taskStateJson(taskConfig);
  }

  protected taskMetrics(): sfn.TaskMetricsConfig {
    return this.metricsConfig;
  }

  protected taskPolicies(): iam.PolicyStatement[] {
    return this.policies;
  }
}
