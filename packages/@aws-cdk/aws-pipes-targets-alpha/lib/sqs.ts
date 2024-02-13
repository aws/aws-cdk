import { IInputTransformation, IPipe, ITarget, TargetConfig } from '@aws-cdk/aws-pipes-alpha';
import { IRole } from 'aws-cdk-lib/aws-iam';
import { IQueue } from 'aws-cdk-lib/aws-sqs';

/**
 * SQS target properties.
 */
export interface SqsTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default none
   */
  readonly inputTransformation?: IInputTransformation;

  /**
   * This parameter applies only to FIFO (first-in-first-out) queues.
   *
   * The token used for deduplication of sent messages.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html#cfn-pipes-pipe-pipetargetsqsqueueparameters-messagededuplicationid
   * @default none
   */
  readonly messageDeduplicationId?: string;

  /**
   * The FIFO message group ID to use as the target.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetsqsqueueparameters.html#cfn-pipes-pipe-pipetargetsqsqueueparameters-messagegroupid
   * @default none
   */
  readonly messageGroupId?: string;
}

/**
 * A EventBridge Pipes target that sends messages to an SQS queue.
 */
export class SqsTarget implements ITarget {
  private queue: IQueue;
  private queueParameters?: SqsTargetParameters;
  public readonly targetArn: string;
  constructor(queue: IQueue, parameters?: SqsTargetParameters) {
    this.queue = queue;
    this.targetArn = queue.queueArn;
    this.queueParameters = parameters;
  }
  grantPush(grantee: IRole): void {
    this.queue.grantSendMessages(grantee);
  }
  bind(pipe: IPipe): TargetConfig {
    if (!this.queueParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        inputTemplate: this.queueParameters.inputTransformation?.bind(pipe).inputTemplate,
        sqsQueueParameters: this.queueParameters,
      },
    };
  }
}
