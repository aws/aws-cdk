import iam = require('@aws-cdk/aws-iam');
import sqs = require('@aws-cdk/aws-sqs');
import stepfunctions = require('@aws-cdk/aws-stepfunctions');
import cdk = require('@aws-cdk/cdk');

/**
 * Properties for SendMessageTask
 */
export interface SendMessageTaskProps extends stepfunctions.BasicTaskProps {
  /**
   * The topic to send a message to to
   */
  readonly queue: sqs.IQueue;

  /**
   * The message body to send to the queue.
   *
   * Exactly one of `messageBody` and `messageBodyPath` is required.
   */
  readonly messageBody?: string;

  /**
   * JSONPath for the message body to send to the queue.
   *
   * Exactly one of `messageBody` and `messageBodyPath` is required.
   */
  readonly messageBodyPath?: string;

  /**
   * The length of time, in seconds, for which to delay a specific message.
   *
   * Valid values are 0-900 seconds.
   *
   * @default Default value of the queue is used
   */
  readonly delaySeconds?: number;

  /**
   * JSONPath expression for delaySeconds setting
   *
   * @default Default value of the queue is used
   */
  readonly delaySecondsPath?: string;

  /**
   * The token used for deduplication of sent messages.
   *
   * @default Use content-based deduplication
   */
  readonly messageDeduplicationId?: string;

  /**
   * JSONPath expression for deduplication ID
   *
   * @default Use content-based deduplication
   */
  readonly messageDeduplicationIdPath?: string;

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
   * JSONPath expression for message group ID
   *
   * @default No group ID
   */
  readonly messageGroupIdPath?: string;
}

/**
 * A StepFunctions Task to send a message to an SQS Queue
 */
export class SendMessageTask extends stepfunctions.Task {
  constructor(scope: cdk.Construct, id: string, props: SendMessageTaskProps) {
    if ((props.messageBody !== undefined) === (props.messageBodyPath !== undefined)) {
      throw new Error(`Supply exactly one of 'messageBody' and 'messageBodyPath'`);
    }

    if ((props.delaySeconds !== undefined) && (props.delaySecondsPath !== undefined)) {
      throw new Error(`Supply either of 'delaySeconds' or 'delaySecondsPath'`);
    }

    if ((props.messageDeduplicationId !== undefined) && (props.messageDeduplicationIdPath !== undefined)) {
      throw new Error(`Supply either of 'messageDeduplicationId' or 'messageDeduplicationIdPath'`);
    }

    if ((props.messageGroupId !== undefined) && (props.messageGroupIdPath !== undefined)) {
      throw new Error(`Supply either of 'messageGroupId' or 'messageGroupIdPath'`);
    }

    super(scope, id, {
      ...props,
      resourceArn: 'arn:aws:states:::sqs:sendMessage',
      policyStatements: [new iam.PolicyStatement()
        .addAction('sns:Publish')
        .addResource(props.queue.queueArn)
      ],
      parameters: {
        'QueueUrl': props.queue.queueUrl,
        'MessageBody': props.messageBody,
        'MessageBody.$': props.messageBodyPath,
        'DelaySeconds': props.delaySeconds,
        'DelaySeconds.$': props.delaySecondsPath,
        'MessageDeduplicationId': props.messageDeduplicationId,
        'MessageDeduplicationId.$': props.messageDeduplicationIdPath,
        'MessageGroupId': props.messageGroupId,
        'MessageGroupId.$': props.messageGroupIdPath,
      }
    });
  }
}