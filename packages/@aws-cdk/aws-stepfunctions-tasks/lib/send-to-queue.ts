import iam = require('@aws-cdk/aws-iam');
import sqs = require('@aws-cdk/aws-sqs');
import sfn = require('@aws-cdk/aws-stepfunctions');
import { renderNumber, renderString } from './json-path';
import { NumberValue } from './number-value';

/**
 * Properties for SendMessageTask
 */
export interface SendToQueueProps {
  /**
   * The message body to send to the queue.
   */
  readonly messageBody: string;

  /**
   * The length of time, in seconds, for which to delay a specific message.
   *
   * Valid values are 0-900 seconds.
   *
   * @default Default value of the queue is used
   */
  readonly delaySeconds?: NumberValue;

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
}

/**
 * A StepFunctions Task to invoke a Lambda function.
 *
 * A Function can be used directly as a Resource, but this class mirrors
 * integration with other AWS services via a specific class instance.
 */
export class SendToQueue implements sfn.IStepFunctionsTask {
  constructor(private readonly queue: sqs.IQueue, private readonly props: SendToQueueProps) {
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskProperties {
    return {
      resourceArn: 'arn:aws:states:::sqs:sendMessage',
      policyStatements: [new iam.PolicyStatement()
        .addAction('sqs:SendMessage')
        .addResource(this.queue.queueArn)
      ],
      parameters: {
        QueueUrl: this.queue.queueUrl,
        ...renderString('MessageBody', this.props.messageBody),
        ...renderNumber('DelaySeconds', this.props.delaySeconds),
        ...renderString('MessageDeduplicationId', this.props.messageDeduplicationId),
        ...renderString('MessageGroupId', this.props.messageGroupId),
      }
    };
  }
}