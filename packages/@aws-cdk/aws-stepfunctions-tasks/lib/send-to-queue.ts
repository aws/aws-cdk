import cloudwatch = require('@aws-cdk/aws-cloudwatch');
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
  public readonly resourceArn: string;
  public readonly policyStatements?: iam.PolicyStatement[] | undefined;
  public readonly metricDimensions?: cloudwatch.DimensionHash | undefined;
  public readonly metricPrefixSingular?: string;
  public readonly metricPrefixPlural?: string;

  public readonly heartbeatSeconds?: number | undefined;
  public readonly parameters?: { [name: string]: any; } | undefined;

  constructor(queue: sqs.IQueue, props: SendToQueueProps) {
    this.resourceArn = 'arn:aws:states:::sqs:sendMessage';
    this.policyStatements = [new iam.PolicyStatement()
      .addAction('sqs:SendMessage')
      .addResource(queue.queueArn)
    ];
    this.parameters = {
      QueueUrl: queue.queueUrl,
      ...renderString('MessageBody', props.messageBody),
      ...renderNumber('DelaySeconds', props.delaySeconds),
      ...renderString('MessageDeduplicationId', props.messageDeduplicationId),
      ...renderString('MessageGroupId', props.messageGroupId),
    };

    // No IAM permissions necessary, execution role implicitly has Activity permissions.
  }
}