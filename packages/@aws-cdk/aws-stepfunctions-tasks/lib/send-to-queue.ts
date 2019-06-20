import iam = require('@aws-cdk/aws-iam');
import sqs = require('@aws-cdk/aws-sqs');
import sfn = require('@aws-cdk/aws-stepfunctions');

/**
 * Properties for SendMessageTask
 */
export interface SendToQueueProps {
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
  readonly delaySeconds?: number;

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
   * Whether to pause the workflow until a task token is returned
   *
   * @default false
   */
  readonly waitForTaskToken?: boolean;
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class SendToQueue implements sfn.IStepFunctionsTask {

  private readonly waitForTaskToken: boolean;

  constructor(private readonly queue: sqs.IQueue, private readonly props: SendToQueueProps) {
    this.waitForTaskToken = props.waitForTaskToken === true;

    if (this.waitForTaskToken && !sfn.FieldUtils.containsTaskToken(props.messageBody.value)) {
      throw new Error('Task Token is missing in messageBody (pass Context.taskToken somewhere in messageBody)');
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: 'arn:aws:states:::sqs:sendMessage' + (this.waitForTaskToken ? '.waitForTaskToken' : ''),
      policyStatements: [new iam.PolicyStatement({
        actions: ['sqs:SendMessage'],
        resources: [this.queue.queueArn]
      })],
      parameters: {
        QueueUrl: this.queue.queueUrl,
        MessageBody: this.props.messageBody.value,
        DelaySeconds: this.props.delaySeconds,
        MessageDeduplicationId: this.props.messageDeduplicationId,
        MessageGroupId: this.props.messageGroupId,
      }
    };
  }
}
